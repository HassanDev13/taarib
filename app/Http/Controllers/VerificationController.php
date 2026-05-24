<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\ResourcePage;
use App\Models\Term;
use App\Models\TermEdit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Storage;

class VerificationController extends Controller
{
    public function verifyTerm(Term $term)
    {
        return $this->renderVerificationPage($term->resourcePage, $term);
    }

    public function verifyPage(ResourcePage $page)
    {
        return $this->renderVerificationPage($page);
    }

    private function renderVerificationPage(
        ResourcePage $page,
        ?Term $currentTerm = null,
    ) {
        $page->load("resource");
        $resource = $page->resource;
        $resource->load("pages");
        $terms = $page->terms()->orderBy("y")->get();

        // Load edit history for each term with user information
        $terms->load([
            "edits" => function ($query) {
                $query->with("user")->orderBy("created_at", "desc");
            },
        ]);

        $allPages = $resource->pages()->orderBy("page_number")->get();

        $nextPage = $resource
            ->pages()
            ->where("page_number", ">", $page->page_number)
            ->orderBy("page_number")
            ->first();

        $prevPage = $resource
            ->pages()
            ->where("page_number", "<", $page->page_number)
            ->orderBy("page_number", "desc")
            ->first();

        return Inertia::render("Terms/Verify", [
            "auth" => [
                "user" => auth()->user(),
            ],
            "currentTerm" => $currentTerm,
            "page" => [
                "id" => $page->id,
                "page_number" => $page->page_number,
                "image_path" => $page->image_path,
                "status" => $page->status,
                "resource_id" => $page->resource_id,
            ],
            "resource" => [
                "id" => $resource->id,
                "name" => $resource->name,
                "pages" => $allPages->map(
                    fn($p) => [
                        "id" => $p->id,
                        "page_number" => $p->page_number,
                    ],
                ),
            ],
            "terms" => $terms,
            "nextPageId" => $nextPage?->id,
            "prevPageId" => $prevPage?->id,
            "totalPages" => $resource->pages()->count(),
            "pdfUrl" => route("resources.pdf", $resource->id),
            "imageUrl" => $page->image_path
                ? route("pages.image", $page->id)
                : null,
        ]);
    }

    public function servePdf(Resource $resource)
    {
        $path = storage_path("app/private/" . $resource->path);

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    public function serveImage(ResourcePage $page)
    {
        // 1) If OCR image already exists, serve it directly (fast path)
        $ocrPath = $page->image_path
            ? storage_path("app/" . $page->image_path)
            : null;

        if ($ocrPath && file_exists($ocrPath)) {
            return $this->serveImageFile($ocrPath);
        }

        // 2) Check on-demand cache (generated at request time)
        $resource = $page->resource;
        if (!$resource || !$resource->path) {
            abort(404);
        }

        $pdfPath = storage_path("app/private/" . $resource->path);
        if (!file_exists($pdfPath)) {
            abort(404);
        }

        $relativePath = "resource_pages/" . $resource->id . "/page-{$page->page_number}.jpg";
        $cacheFile = storage_path("app/" . $relativePath);

        // 3) Return cached image if already stored (either OCR or previously generated)
        if (file_exists($cacheFile)) {
            // Update image_path in DB if not set (e.g. old OCR pages already have it)
            if (!$page->image_path) {
                $page->update(['image_path' => $relativePath]);
            }
            return $this->serveImageFile($cacheFile);
        }

        if (!is_dir(dirname($cacheFile))) {
            mkdir(dirname($cacheFile), 0755, true);
        }

        // pdftoppm adds "-{page}.jpg" to output prefix, so we use a temp prefix
        $tmpPrefix = dirname($cacheFile) . "/_gen_{$page->page_number}";

        $cmd = [
            "/usr/bin/pdftoppm",
            "-f", (string) $page->page_number,
            "-l", (string) $page->page_number,
            "-jpeg",
            "-r", "120",
            $pdfPath,
            $tmpPrefix,
        ];

        $process = new \Symfony\Component\Process\Process($cmd);
        $process->setTimeout(30);
        $process->run();

        // pdftoppm outputs zero-padded: {prefix}-001.jpg, {prefix}-066.jpg, {prefix}-119.jpg
        $generatedFile = $tmpPrefix . "-" . str_pad($page->page_number, 3, "0", STR_PAD_LEFT) . ".jpg";

        if (!$process->isSuccessful() || !file_exists($generatedFile)) {
            // Try glob fallback in case padding is different
            $glob = glob($tmpPrefix . "-*.jpg");
            $generatedFile = $glob[0] ?? null;
            if (!$generatedFile || !file_exists($generatedFile)) {
                abort(404);
            }
        }

        // Rename to final cache path
        rename($generatedFile, $cacheFile);

        // Save image_path to database so next request goes directly to cache
        $page->update(['image_path' => $relativePath]);

        return $this->serveImageFile($cacheFile);
    }

    private function serveImageFile(string $path)
    {
        if (!file_exists($path)) {
            abort(404);
        }

        $lastModified = filemtime($path);
        $etag = md5($path . $lastModified);

        $ifNoneMatch = request()->header("If-None-Match");
        $ifModifiedSince = request()->header("If-Modified-Since");

        if ($ifNoneMatch && $ifNoneMatch === $etag) {
            return response()->make("", 304);
        }

        if (
            $ifModifiedSince &&
            strtotime($ifModifiedSince) >= $lastModified
        ) {
            return response()->make("", 304);
        }

        // Determine MIME from extension
        $mime = str_ends_with($path, ".png") ? "image/png" : "image/jpeg";

        return response()
            ->file($path, [
                "Content-Type" => $mime,
                "Cache-Control" => "public, max-age=31536000",
            ]);
    }

    public function updateTerm(Request $request, Term $term)
    {
        $validated = $request->validate([
            "term_en" => "nullable|string|max:255",
            "term_ar" => "nullable|string|max:255",
            "corrections" => "nullable|string",
        ]);

        // Remove null values to only update provided fields
        $validated = array_filter($validated, fn($value) => $value !== null);

        // Record edit history for each changed field
        foreach ($validated as $field => $newValue) {
            $oldValue = $term->$field;

            // Only record if value actually changed
            if ($oldValue !== $newValue) {
                TermEdit::create([
                    "term_id" => $term->id,
                    "user_id" => auth()->id(),
                    "field_changed" => $field,
                    "old_value" => $oldValue,
                    "new_value" => $newValue,
                ]);
            }
        }

        $term->update($validated);

        return back();
    }

    public function updateTermStatus(Request $request, Term $term)
    {
        $validated = $request->validate([
            "status" => "required|in:accepted,rejected,unverified",
            "rejection_reason" => "nullable|string|required_if:status,rejected",
        ]);

        // Record status change in edit history
        $oldStatus = $term->status;
        $newStatus = $validated["status"];

        if ($oldStatus !== $newStatus) {
            TermEdit::create([
                "term_id" => $term->id,
                "user_id" => auth()->id(),
                "field_changed" => "status",
                "old_value" => $oldStatus,
                "new_value" => $newStatus,
            ]);
        }

        $term->update($validated);

        return back();
    }
}

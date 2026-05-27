<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');
        $search = $request->query('search');
        
        $query = Book::with('categories')->where('status', 'approved');
        
        if ($categoryId) {
            $query->whereHas('categories', function($q) use ($categoryId) {
                $q->where('book_categories.id', $categoryId);
            });
        }
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }
        
        $books = $query->latest()->get();
        
        $categories = \App\Models\BookCategory::with('children')->whereNull('parent_id')->withCount(['books' => function($q) {
            $q->where('status', 'approved');
        }])->get();

        return Inertia::render('Library/Index', [
            'books' => $books,
            'categories' => $categories,
            'currentCategoryId' => $categoryId ? (int)$categoryId : null,
            'currentSearch' => $search,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\BookCategory::with('children')->whereNull('parent_id')->get();

        return Inertia::render('Library/Upload', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'uploader_name' => 'nullable|string|max:255',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:book_categories,id',
            'file' => 'required|file|mimes:pdf|max:102400', // max 100MB
        ]);

        $ip = $request->ip();

        // Check daily limit (20 per IP)
        $dailyCount = Book::where('ip_address', $ip)
            ->whereDate('created_at', today())
            ->count();

        if ($dailyCount >= 20) {
            return back()->withErrors(['file' => 'لقد وصلت للحد الأقصى للرفع اليومي (20 كتاب).']);
        }

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads', 'books');

            $book = Book::create([
                'title' => $request->title,
                'author' => $request->author,
                'uploader_name' => $request->uploader_name,
                'file_path' => $path,
                'status' => 'draft',
                'user_id' => auth()->id(), // null if not logged in
                'ip_address' => $ip,
            ]);

            $book->categories()->sync($request->category_ids);

            return back()->with('success', 'thank_you');
        }

        return back()->withErrors(['file' => 'حدث خطأ أثناء رفع الملف.']);
    }

    public function download(Book $book)
    {
        if ($book->status !== 'approved' && (!auth()->check() || !auth()->user()->is_admin)) {
            abort(403, 'This book is not approved yet.');
        }

        if (!Storage::disk('books')->exists($book->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('books')->download($book->file_path, "{$book->title}.pdf");
    }

    public function view(Book $book)
    {
        if ($book->status !== 'approved' && (!auth()->check() || !auth()->user()->is_admin)) {
            abort(403, 'This book is not approved yet.');
        }

        if (!Storage::disk('books')->exists($book->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('books')->response($book->file_path);
    }
}

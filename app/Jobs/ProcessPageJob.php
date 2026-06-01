<?php

namespace App\Jobs;

use App\Models\ResourcePage;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ProcessPageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    public function __construct(protected ResourcePage $page) {}

    public function handle()
    {
        $this->page->update(['status' => 'processing', 'error_message' => null]);

        try {
            $fullPath = storage_path('app/' . $this->page->image_path);
            
            $apiKey = env('GEMINI_API_KEY');
            if (!$apiKey) {
                throw new Exception('GEMINI_API_KEY is not set in the environment.');
            }

            // We use the flash-lite model as requested
            $model = 'gemini-3.1-flash-lite'; 
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $imageData = base64_encode(file_get_contents($fullPath));
            
            // Try to figure out mime type safely
            $mimeType = mime_content_type($fullPath);
            if (!$mimeType) {
                $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
                $mimeType = $extension === 'png' ? 'image/png' : 'image/jpeg';
            }

            // Bring the system prompt from ProcessPageForGPTJob and adapt it
            $promptText = "Analyze this document image which contains a technical terminology table or list (English and Arabic).\n"
                . "Extract ONLY the English terms and their corresponding Arabic translation.\n\n"
                . "RULES:\n"
                . "1. Recombine separated Arabic letters: 'ا ل ب ا ي ت' → 'البايت'\n"
                . "2. Fix definite articles: 'ا ل' → 'الـ'\n"
                . "3. Match semantic translations only: 'processor'/'معالج' = CORRECT, but do not match transliterations.\n"
                . "4. Only extract terms where both English and Arabic terms exist in the same context.\n"
                . "5. Ignore texts like introductions, tables of contents, or non-relevant text.\n"
                . "6. If the page does not contain any valid terminology dictionary terms, return an empty array.\n\n"
                . "Output ONLY JSON with the following structure:\n"
                . "{\n"
                . "  \"verified_pairs\": [\n"
                . "    {\n"
                . "      \"term_en\": \"english_term\",\n"
                . "      \"term_ar\": \"arabic_term_reconstructed\",\n"
                . "      \"confidence_level\": 9\n"
                . "    }\n"
                . "  ]\n"
                . "}\n"
                . "Confidence should be 1-10 (9-10=exact, 7-8=strong, 5-6=reasonable, 3-4=uncertain, 1-2=weak).";

            $payload = [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $promptText],
                            [
                                'inline_data' => [
                                    'mime_type' => $mimeType,
                                    'data' => $imageData
                                ]
                            ]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'response_mime_type' => 'application/json',
                ]
            ];

            Log::info("ProcessPageJob (Gemini) sending payload", ['page_id' => $this->page->id, 'mimeType' => $mimeType]);

            $response = Http::timeout(120)->post($url, $payload);

            if ($response->failed()) {
                throw new Exception('Gemini API request failed: ' . $response->body());
            }

            $result = $response->json();
            $extractedText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            
            Log::info("Gemini Raw Output for Page {$this->page->id}: " . $extractedText);

            // Clean up the output in case Gemini returns markdown blocks despite application/json mime type
            $cleanedOutput = preg_replace("/^```json\s*/m", "", $extractedText);
            $cleanedOutput = preg_replace("/^```\s*/m", "", $cleanedOutput);
            $cleanedOutput = trim($cleanedOutput);

            $terms = json_decode($cleanedOutput, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($terms)) {
                throw new Exception('Failed to parse Gemini JSON output: ' . json_last_error_msg() . ' -> ' . $cleanedOutput);
            }

            // Support either wrapped in 'verified_pairs' or just an array directly
            $verifiedPairs = $terms['verified_pairs'] ?? $terms;
            $validTerms = [];

            foreach ($verifiedPairs as $term) {
                // Support both keys based on prompt history
                $termAr = $term["term_ar"] ?? $term["term_ar_reconstructed"] ?? null;
                
                if (isset($term["term_en"]) && !empty(trim($term["term_en"])) && $termAr && !empty(trim($termAr))) {
                    $validTerms[] = [
                        "term_en" => trim($term["term_en"]),
                        "term_ar" => trim($termAr),
                        "confidence_level" => $term["confidence_level"] ?? null,
                    ];
                }
            }

            if (empty($validTerms)) {
                Log::info("ResourcePage {$this->page->id} has no valid terms, skipping.");
                $this->page->update([
                    'gpt_text' => $extractedText,
                    'text' => 'No dictionary terms found on this page, ignored.',
                    'status' => 'done',
                    'error_message' => null, // Explicitly clear any error message
                ]);
            } else {
                $resourceId = $this->page->resource_id;
                
                foreach ($validTerms as $term) {
                    $exists = \App\Models\Term::where('term_en', $term["term_en"])
                        ->where('term_ar', $term["term_ar"])
                        ->where('extraction_tool', 'flash-lite')
                        ->whereHas('resourcePage', function ($query) use ($resourceId) {
                            $query->where('resource_id', $resourceId);
                        })
                        ->exists();

                    if (!$exists) {
                        $this->page->terms()->create([
                            "term_en" => $term["term_en"],
                            "term_ar" => $term["term_ar"],
                            "confidence_level" => $term["confidence_level"],
                            "extraction_tool" => "flash-lite",
                        ]);
                    }
                }

                $this->page->update([
                    'gpt_text' => $extractedText,
                    'text' => 'Processed via Gemini directly from image',
                    'status' => 'done'
                ]);
            }

            $this->checkResourceCompletion();

        } catch (Exception $e) {
            Log::error('ProcessPageJob (Gemini) failed', ['page_id' => $this->page->id, 'error' => $e->getMessage()]);
            $this->page->update([
                'status' => 'error',
                'error_message' => $e->getMessage(),
            ]);
        }
    }

    protected function checkResourceCompletion()
    {
        $resource = $this->page->resource()->with('pages')->first();

        $allDone = !$resource->pages()->where('status', '!=', 'done')->exists();

        if ($allDone) {
            $resource->update(['status' => 'done']);
        }
    }
}

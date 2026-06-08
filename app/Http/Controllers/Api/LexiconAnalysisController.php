<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class LexiconAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'word' => 'required|string|max:255'
        ]);

        $word = $request->input('word');
        // Clean word (remove tashkeel for better searching)
        $cleanWord = preg_replace('/[\x{0610}-\x{061A}\x{064B}-\x{065F}\x{0670}\x{06D6}-\x{06DC}\x{06DF}-\x{06E8}\x{06EA}-\x{06ED}]/u', '', $word);
        $words = array_values(array_filter(explode(' ', $cleanWord)));
        $analyses = [];
        $db = DB::connection('lexicon');

        // 1. Initial setup and local root lookup
        $missingRoots = [];
        foreach ($words as $currentWord) {
            $analysis = [
                'word' => $currentWord,
                'root' => null,
                'core_concept' => null,
                'classical_meaning' => null,
                'modern_meaning' => null,
                'english_translation' => null,
                'word_family' => []
            ];

            $ghoniEntry = $db->table('mujamul_ghoni')->where('no_harakat', $currentWord)->first();
            if ($ghoniEntry && !empty($ghoniEntry->root)) {
                $analysis['root'] = $ghoniEntry->root;
            } else {
                $hwRoot = $db->table('hanswehr')->where('word', $currentWord)->where('is_root', 1)->first();
                if ($hwRoot) {
                    $analysis['root'] = $currentWord;
                }
            }

            if (!$analysis['root']) {
                $missingRoots[] = $currentWord;
            }

            $analyses[$currentWord] = $analysis;
        }

        // 1.5. Bulk AI Root Extraction for missing roots (Single API Call to prevent Rate Limits)
        if (!empty($missingRoots)) {
            try {
                $model = env('OPENAI_MODEL', 'deepseek-chat');
                $wordsList = implode('، ', $missingRoots);
                
                $response = OpenAI::chat()->create([
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'أنت خبير في علم الصرف. أعطني الجذر اللغوي (الحروف المجردة) لكل كلمة. يجب أن يكون الرد بصيغة JSON فقط: {"الكلمة":"الجذر"} مثال: {"بيانات":"بين", "مشغل":"شغل"}'],
                        ['role' => 'user', 'content' => $wordsList]
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.0,
                ]);

                $aiResult = json_decode($response->choices[0]->message->content, true);
                
                if (is_array($aiResult)) {
                    foreach ($aiResult as $w => $r) {
                        $cleanedRoot = preg_replace('/[\x{0610}-\x{061A}\x{064B}-\x{065F}\s]/u', '', $r);
                        if (isset($analyses[$w]) && mb_strlen($cleanedRoot) >= 2 && mb_strlen($cleanedRoot) <= 5) {
                            $analyses[$w]['root'] = trim($cleanedRoot);
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Bulk AI Root Extraction failed: ' . $e->getMessage());
            }
        }

        // 2. Fetch dictionary data for each word using the discovered roots
        $finalAnalyses = [];
        foreach ($words as $currentWord) {
            $analysis = $analyses[$currentWord];
            $searchRoot = $analysis['root'] ?: $currentWord;

            // Core Concept
            $maqayees = $db->table('maqayeesul_luga')->where('word', $searchRoot)->first();
            if ($maqayees) {
                $analysis['core_concept'] = ['source' => 'مقاييس اللغة', 'text' => $maqayees->meanings];
            }

            // Classical Meaning
            $lisan = $db->table('lisanularab')->where('word', $searchRoot)->first();
            if ($lisan) {
                $analysis['classical_meaning'] = ['source' => 'لسان العرب', 'text' => $lisan->meanings];
            } else {
                $shihah = $db->table('mujamul_shihah')->where('word', $currentWord)->first();
                if ($shihah) {
                    $analysis['classical_meaning'] = ['source' => 'الصحاح', 'text' => $shihah->meanings];
                }
            }

            // Modern Meaning
            $wasith = $db->table('mujamul_wasith')->where('word', $currentWord)->first();
            if ($wasith) {
                $analysis['modern_meaning'] = ['source' => 'المعجم الوسيط', 'text' => $wasith->meanings];
            } else {
                $muashiroh = $db->table('mujamul_muashiroh')->where('word', $currentWord)->first();
                if ($muashiroh) {
                    $analysis['modern_meaning'] = ['source' => 'معجم المعاصرة', 'text' => $muashiroh->meanings];
                }
            }

            // English Translation
            $hw = $db->table('hanswehr')->where('word', $currentWord)->first();
            if ($hw) {
                $analysis['english_translation'] = ['source' => 'Hans Wehr', 'text' => $hw->meanings];
            } else {
                $lane = $db->table('lanelexcon')->where('word', $currentWord)->first();
                if ($lane) {
                    $analysis['english_translation'] = ['source' => "Lane's Lexicon", 'text' => $lane->meanings];
                }
            }

            // Word Family
            if ($analysis['root']) {
                $analysis['word_family'] = $db->table('mujamul_ghoni')
                    ->where('root', $analysis['root'])
                    ->where('no_harakat', '!=', $currentWord)
                    ->limit(10)
                    ->pluck('word')
                    ->unique()
                    ->values()
                    ->toArray();
            }

            // Clean Text
            $cleanText = function($text) {
                if (!$text) return $text;
                $text = str_replace(['<br>', '<br/>', '<br />', '<b>', '</b>'], ["\n", "\n", "\n", "", ""], $text);
                return trim(strip_tags($text));
            };

            if ($analysis['core_concept']) $analysis['core_concept']['text'] = $cleanText($analysis['core_concept']['text']);
            if ($analysis['classical_meaning']) $analysis['classical_meaning']['text'] = $cleanText($analysis['classical_meaning']['text']);
            if ($analysis['modern_meaning']) $analysis['modern_meaning']['text'] = $cleanText($analysis['modern_meaning']['text']);
            if ($analysis['english_translation']) $analysis['english_translation']['text'] = $cleanText($analysis['english_translation']['text']);

            $finalAnalyses[] = $analysis;
        }

        return response()->json([
            'success' => true,
            'data' => $finalAnalyses
        ]);
    }
}

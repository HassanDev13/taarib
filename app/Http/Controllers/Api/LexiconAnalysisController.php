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
        
        $db = DB::connection('lexicon');

        $analysis = [
            'word' => $word,
            'root' => null,
            'core_concept' => null,
            'classical_meaning' => null,
            'modern_meaning' => null,
            'english_translation' => null,
            'word_family' => []
        ];

        // 1. Find Root
        // Let's check mujamul_ghoni first
        $ghoniEntry = $db->table('mujamul_ghoni')->where('no_harakat', $cleanWord)->first();
        if ($ghoniEntry && !empty($ghoniEntry->root)) {
            $analysis['root'] = $ghoniEntry->root;
        } else {
            // Try to find if the word is already a root in hanswehr
            $hwRoot = $db->table('hanswehr')->where('word', $cleanWord)->where('is_root', 1)->first();
            if ($hwRoot) {
                $analysis['root'] = $cleanWord;
            }
        }

        // 1.5. Fallback: AI Root Extractor (If local failed)
        if (!$analysis['root']) {
            try {
                $model = env('OPENAI_MODEL', 'deepseek-chat');
                $response = OpenAI::chat()->create([
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'أنت خبير في علم الصرف العربي. مهمتك الوحيدة هي إرجاع الجذر اللغوي (الثلاثي أو الرباعي) للكلمة العربية المعطاة. أرجع الجذر فقط (الحروف المجردة) بدون أي إضافات أو تشكيل. مثال: مكتب -> كتب، بيانات -> بين، اتصال -> وصل.'],
                        ['role' => 'user', 'content' => $cleanWord]
                    ],
                    'temperature' => 0.0,
                    'max_tokens' => 15,
                ]);
                $aiRoot = trim($response->choices[0]->message->content);
                // Ensure it looks like a root (2-5 Arabic chars)
                if (mb_strlen($aiRoot) >= 2 && mb_strlen($aiRoot) <= 5 && !preg_match('/\s/', $aiRoot)) {
                    $analysis['root'] = preg_replace('/[\x{0610}-\x{061A}\x{064B}-\x{065F}]/u', '', $aiRoot);
                }
            } catch (\Exception $e) {
                Log::error('AI Root Extraction failed: ' . $e->getMessage());
            }
        }

        $searchRoot = $analysis['root'] ?: $cleanWord;

        // 2. Core Concept (Maqayees al-Lughah)
        $maqayees = $db->table('maqayeesul_luga')->where('word', $searchRoot)->first();
        if ($maqayees) {
            $analysis['core_concept'] = [
                'source' => 'مقاييس اللغة (ابن فارس)',
                'text' => $maqayees->meanings
            ];
        }

        // 3. Classical Meaning (Lisan Al Arab or Shihah)
        $lisan = $db->table('lisanularab')->where('word', $searchRoot)->first();
        if ($lisan) {
            $analysis['classical_meaning'] = [
                'source' => 'لسان العرب (ابن منظور)',
                'text' => $lisan->meanings
            ];
        } else {
            $shihah = $db->table('mujamul_shihah')->where('word', $cleanWord)->first();
            if ($shihah) {
                $analysis['classical_meaning'] = [
                    'source' => 'الصحاح (الجوهري)',
                    'text' => $shihah->meanings
                ];
            }
        }

        // 4. Modern Meaning (Al-Wasit or Al-Muashiroh)
        $wasith = $db->table('mujamul_wasith')->where('word', $cleanWord)->first();
        if ($wasith) {
            $analysis['modern_meaning'] = [
                'source' => 'المعجم الوسيط (مجمع اللغة العربية)',
                'text' => $wasith->meanings
            ];
        } else {
            $muashiroh = $db->table('mujamul_muashiroh')->where('word', $cleanWord)->first();
            if ($muashiroh) {
                $analysis['modern_meaning'] = [
                    'source' => 'معجم اللغة العربية المعاصرة',
                    'text' => $muashiroh->meanings
                ];
            }
        }

        // 5. English Translation (Hans Wehr or Lane's Lexicon)
        $hw = $db->table('hanswehr')->where('word', $cleanWord)->first();
        if ($hw) {
            $analysis['english_translation'] = [
                'source' => 'Hans Wehr Dictionary',
                'text' => $hw->meanings
            ];
        } else {
            $lane = $db->table('lanelexcon')->where('word', $cleanWord)->first();
            if ($lane) {
                $analysis['english_translation'] = [
                    'source' => "Lane's Lexicon",
                    'text' => $lane->meanings
                ];
            }
        }

        // 6. Word Family (Derivations from the same root)
        if ($analysis['root']) {
            $family = $db->table('mujamul_ghoni')
                ->where('root', $analysis['root'])
                ->where('no_harakat', '!=', $cleanWord)
                ->limit(10)
                ->pluck('word')
                ->unique()
                ->values()
                ->toArray();
            
            $analysis['word_family'] = $family;
        }

        // 7. Clean up text formatting (remove HTML tags like <br>)
        $cleanText = function($text) {
            if (!$text) return $text;
            $text = str_replace(['<br>', '<br/>', '<br />', '<b>', '</b>'], ["\n", "\n", "\n", "", ""], $text);
            return trim(strip_tags($text));
        };

        if ($analysis['core_concept']) $analysis['core_concept']['text'] = $cleanText($analysis['core_concept']['text']);
        if ($analysis['classical_meaning']) $analysis['classical_meaning']['text'] = $cleanText($analysis['classical_meaning']['text']);
        if ($analysis['modern_meaning']) $analysis['modern_meaning']['text'] = $cleanText($analysis['modern_meaning']['text']);
        if ($analysis['english_translation']) $analysis['english_translation']['text'] = $cleanText($analysis['english_translation']['text']);

        return response()->json([
            'success' => true,
            'data' => $analysis
        ]);
    }
}

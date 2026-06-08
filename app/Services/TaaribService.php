<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class TaaribService
{
    private $heritageDb;
    private $arabicWordRoots;
    private $arabicRoots;

    public function __construct()
    {
        $this->heritageDb = storage_path('app/taarib/arabic_lexicons.db');
        
        // كلمات عربية → جذورها الثلاثية
        $this->arabicWordRoots = [
            'بيانات' => 'بين', 'بيان' => 'بين', 'معطيات' => 'عطي',
            'معلومات' => 'علم', 'معلومة' => 'علم', 'حوسبة' => 'حسب',
            'سحاب' => 'سحب', 'سحبة' => 'سحب', 'سحابة' => 'سحب', 'سحابي' => 'سحب', 'سحب' => 'سحب',
            'شبكة' => 'شبك', 'خادم' => 'خدم', 'خوادم' => 'خدم',
            'خدمة' => 'خدم', 'خوارزمية' => 'خورزم',
            'برمجة' => 'برمج', 'تطبيق' => 'طبق', 'نظام' => 'نظم',
            'أمن' => 'أمن', 'تشفير' => 'شفر', 'تخزين' => 'خزن',
            'ذاكرة' => 'ذكر', 'معالج' => 'عالج', 'مستخدم' => 'مستعمل',
            'واجهة' => 'وجه', 'قاعدة' => 'قعد', 'جدول' => 'جدل',
            'فهرس' => 'فهرس', 'دالة' => 'دلو', 'متغير' => 'غير',
            'قيمة' => 'قوم', 'خطأ' => 'غلط', 'طلب' => 'طلب',
            'استجابة' => 'جوب', 'مصدر' => 'صدر', 'تحميل' => 'حمل',
            'تنزيل' => 'نزل', 'رفع' => 'رفع', 'إرسال' => 'رسل',
            'استقبال' => 'قبل', 'تحليل' => 'حلل', 'تصميم' => 'صمم',
            'تطوير' => 'طور', 'تحديث' => 'حدث', 'نسخ' => 'نسخ',
            'حذف' => 'حذف', 'إضافة' => 'زود', 'بحث' => 'بحث',
            'استعلام' => 'علم', 'إدارة' => 'دبر', 'مدير' => 'دبر',
            'تشغيل' => 'شغل', 'معالجة' => 'عالج', 'حاسوب' => 'حسب',
            'حاسب' => 'حسب', 'خزن' => 'خزن', 'نقل' => 'نقل',
            'ربط' => 'ربط', 'اتصال' => 'وصل', 'تواصل' => 'وصل',
            'بروتوكول' => 'برتكول', 'ترجمة' => 'ترجم', 'تعريب' => 'عرب',
        ];

        // مصطلحات إنجليزية → جذور عربية
        $this->arabicRoots = [
            'data' => 'بين', 'database' => 'بين', 'metadata' => 'بين',
            'cloud' => 'سحب', 'server' => 'خدم', 'service' => 'خدم',
            'algorithm' => 'خورزم', 'network' => 'شبك', 'web' => 'شبك',
            'software' => 'برمج', 'application' => 'طبق',
            'user' => 'مستعمل', 'memory' => 'ذكر',
            'processor' => 'عالج', 'storage' => 'خزن',
            'security' => 'أمن', 'encryption' => 'شفر', 'code' => 'رمز',
            'protocol' => 'برتكول', 'router' => 'توجيه',
            'kernel' => 'نوى', 'container' => 'حوى',
            'api' => 'واجهة', 'machine' => 'آلة', 'learning' => 'تعلم',
            'intelligence' => 'ذكاء', 'communication' => 'وصل',
            'compute' => 'حسب', 'computing' => 'حسب',
            'query' => 'سأل', 'search' => 'بحث', 'model' => 'نموذج',
            'system' => 'نظم', 'development' => 'طور',
            'browser' => 'تصفح', 'cache' => 'خزن',
            'document' => 'وثق', 'file' => 'ملف',
            'function' => 'فعل', 'input' => 'دخل', 'output' => 'خرج',
            'logic' => 'نطق', 'process' => 'مضى',
            'request' => 'طلب', 'response' => 'جوب',
            'source' => 'مصدر', 'test' => 'خبر',
            'thread' => 'خيط', 'transfer' => 'نقل',
            'variable' => 'غير', 'virtual' => 'مثل',
            'backup' => 'نسخ', 'command' => 'أمر',
            'compile' => 'جمع', 'config' => 'شكل',
            'error' => 'غلط', 'bug' => 'علة',
            'feature' => 'ميز', 'filter' => 'غرب',
            'firewall' => 'حجب', 'gateway' => 'باب',
            'generate' => 'ولد', 'hardware' => 'صلب',
            'index' => 'فهرس', 'log' => 'سجل',
            'monitor' => 'نظر', 'node' => 'عقد',
            'port' => 'باب', 'queue' => 'صف',
            'record' => 'سجل', 'report' => 'بلغ',
            'route' => 'درب', 'script' => 'خط',
            'session' => 'جلس', 'signal' => 'أشر',
            'socket' => 'قبس', 'stream' => 'تدفق',
            'switch' => 'بدل', 'table' => 'جدول',
            'token' => 'رمز', 'update' => 'حدث',
            'version' => 'نسخ', 'window' => 'نافذ',
            'information' => 'علم', 'info' => 'علم',
            'knowledge' => 'علم', 'know' => 'علم',
            'program' => 'برمج', 'programming' => 'برمج',
            'management' => 'دبر', 'manager' => 'دبر',
            'control' => 'ملك', 'operation' => 'عمل',
            'standard' => 'قوم', 'value' => 'قوم',
            'type' => 'نوع', 'method' => 'نهج',
            'direction' => 'وجه', 'direct' => 'وجه',
            'organization' => 'نظم', 'company' => 'شرك',
            'result' => 'نتج', 'cause' => 'سبب',
            'time' => 'وقت', 'date' => 'أرخ',
            'big' => 'كبر', 'small' => 'صغر',
            'many' => 'كثر', 'few' => 'قل',
            'part' => 'بعض', 'all' => 'كل',
            'first' => 'أول', 'last' => 'أخر',
            'new' => 'جدد', 'old' => 'قدم',
            'quality' => 'جود', 'quantity' => 'كثر',
        ];
    }

    /**
     * الأداة 1: البحث في المعاجم التراثية
     * بحث جذر عربي في 9 معاجم
     */
    public function searchHeritage(string $root, ?string $sourceOnly = null, int $limit = 20): array
    {
        $results = [];
        
        if (!file_exists($this->heritageDb)) {
            return [['source' => 'error', 'meaning' => 'قاعدة المعاجم التراثية غير متوفرة']];
        }

        try {
            $db = new \SQLite3($this->heritageDb);
            $db->busyTimeout(5000);
            
            $root = \SQLite3::escapeString($root);

            $tables = [
                ['table' => 'lisanularab', 'col' => 'word', 'era' => 'القرن 7 هـ'],
                ['table' => 'mujamul_muhith', 'col' => 'word', 'era' => 'القرن 8 هـ'],
                ['table' => 'mujamul_shihah', 'col' => 'word', 'era' => 'القرن 4 هـ'],
                ['table' => 'maqayeesul_luga', 'col' => 'word', 'era' => 'القرن 4 هـ'],
                ['table' => 'mujamul_wasith', 'col' => 'word', 'era' => '1960 م'],
                ['table' => 'mujamul_muashiroh', 'col' => 'word', 'era' => 'معاصر'],
                ['table' => 'mujamul_ghoni', 'col' => 'root', 'era' => '2008 م'],
            ];

            // If filtering for one source, only query that table
            if ($sourceOnly) {
                $filteredTables = array_filter($tables, fn($t) => $t['table'] === $sourceOnly);
                if (empty($filteredTables)) {
                    $db->close();
                    return [];
                }
                $tables = $filteredTables;
            }

            $perTable = max(1, min(2, (int)ceil($limit / count($tables))));
            $fetched = 0;
            foreach ($tables as $t) {
                $remaining = $limit - $fetched;
                if ($remaining <= 0) break;
                $q = $db->query("SELECT {$t['col']} AS word, meanings FROM \"{$t['table']}\" WHERE {$t['col']} = '{$root}' LIMIT " . min($remaining, $perTable));
                if ($q) {
                    while ($row = $q->fetchArray(SQLITE3_ASSOC)) {
                        $m = $row['meanings'] ?? '';
                        $results[] = [
                            'source' => $t['table'],
                            'era' => $t['era'],
                            'word' => $row['word'],
                            'meaning' => mb_substr($m, 0, 300) . (mb_strlen($m) > 300 ? '...' : ''),
                        ];
                        $fetched++;
                    }
                }
            }

            // Hans Wehr & Lane's (skip if filtering for a specific source, or limit reached)
            if (!$sourceOnly && $fetched < $limit) {
                foreach (['hanswehr' => '1952 م', 'lanelexcon' => '1863 م'] as $tbl => $era) {
                    if ($fetched >= $limit) break;
                    $q = $db->query("SELECT word, meanings FROM \"{$tbl}\" WHERE word = '{$root}' AND is_root = 1 LIMIT 1");
                    if ($q) {
                        while ($row = $q->fetchArray(SQLITE3_ASSOC)) {
                            $m = $row['meanings'] ?? '';
                            $results[] = [
                                'source' => $tbl,
                                'era' => $era,
                                'word' => $row['word'],
                                'meaning' => mb_substr($m, 0, 300) . (mb_strlen($m) > 300 ? '...' : ''),
                            ];
                            $fetched++;
                        }
                    }
                }
            }

            $db->close();
        } catch (\Exception $e) {
            Log::error('Taarib heritage search error: ' . $e->getMessage());
            return [['source' => 'error', 'meaning' => 'خطأ في قاعدة المعاجم: ' . $e->getMessage()]];
        }

        return $results;
    }

    /**
     * Count total entries for a root without fetching the data
     */
    public function countHeritageEntries(string $root, ?string $sourceOnly = null): int
    {
        if (!file_exists($this->heritageDb)) return 0;
        $total = 0;
        try {
            $db = new \SQLite3($this->heritageDb);
            $db->busyTimeout(5000);
            $root = \SQLite3::escapeString($root);

            $tables = [
                ['table' => 'lisanularab', 'col' => 'word'],
                ['table' => 'mujamul_muhith', 'col' => 'word'],
                ['table' => 'mujamul_shihah', 'col' => 'word'],
                ['table' => 'maqayeesul_luga', 'col' => 'word'],
                ['table' => 'mujamul_wasith', 'col' => 'word'],
                ['table' => 'mujamul_muashiroh', 'col' => 'word'],
                ['table' => 'mujamul_ghoni', 'col' => 'root'],
            ];

            if ($sourceOnly) {
                $filtered = array_filter($tables, fn($t) => $t['table'] === $sourceOnly);
                $tables = $filtered;
            }

            foreach ($tables as $t) {
                $q = $db->querySingle("SELECT COUNT(*) FROM \"{$t['table']}\" WHERE {$t['col']} = '{$root}'");
                $total += (int)$q;
            }

            if (!$sourceOnly) {
                foreach (['hanswehr', 'lanelexcon'] as $tbl) {
                    $q = $db->querySingle("SELECT COUNT(*) FROM \"{$tbl}\" WHERE word = '{$root}' AND is_root = 1");
                    $total += (int)$q;
                }
            }

            $db->close();
        } catch (\Exception $e) {
            Log::error('Taarib count error: ' . $e->getMessage());
        }
        return $total;
    }

    /**
     * الأداة 2: إيجاد جذر عربي لمصطلح إنجليزي
     */
    public function findRootsForTerm(string $term): array
    {
        $t = mb_strtolower(trim($term));
        
        $matches = [];
        
        // Exact match
        if (isset($this->arabicRoots[$t])) {
            $matches[] = [
                'term' => $t,
                'root' => $this->arabicRoots[$t],
                'match_type' => 'exact'
            ];
            return $matches;
        }
        
        // Partial match
        foreach ($this->arabicRoots as $key => $root) {
            if (str_starts_with($t, $key) || str_starts_with($key, $t)) {
                $matches[] = [
                    'term' => $t,
                    'root' => $root,
                    'match_type' => 'partial',
                    'matched_key' => $key
                ];
                return $matches;
            }
        }
        
        return [['term' => $t, 'root' => null, 'match_type' => 'none']];
    }

    /**
     * الأداة 3: جذر كلمة عربية
     */
    public function findArabicWordRoot(string $arabicWord): array
    {
        if (isset($this->arabicWordRoots[$arabicWord])) {
            return [
                'word' => $arabicWord,
                'root' => $this->arabicWordRoots[$arabicWord],
                'found' => true
            ];
        }
        return [
            'word' => $arabicWord,
            'root' => null,
            'found' => false
        ];
    }

    /**
     * الأداة 4: نقد الترجمة
     * تحليل ترجمة عربية بناءً على جذرها التراثي
     */
    public function critiqueTranslation(string $arabicTerm, string $englishTerm, ?string $knownRoot = null, array $prefetchedHeritage = []): array
    {
        // If heritage is already prefetched (from ChatController) — use it directly
        if (!empty($prefetchedHeritage)) {
            return [
                'arabic_term' => $arabicTerm,
                'english_term' => $englishTerm,
                'root' => $knownRoot ?? 'غير معروف',
                'root_found' => $knownRoot !== null,
                'heritage_entries' => $prefetchedHeritage,
            ];
        }

        $rootInfo = $this->findArabicWordRoot($arabicTerm);
        $heritage = $rootInfo['found'] ? $this->searchHeritage($rootInfo['root'], null, 8) : [];
        
        return [
            'arabic_term' => $arabicTerm,
            'english_term' => $englishTerm,
            'root' => $rootInfo['root'] ?? 'غير معروف',
            'root_found' => $rootInfo['found'],
            'heritage_entries' => $heritage,
        ];
    }

    /**
     * الأداة 5: تحليل شامل عبر Deepseek
     * يستخدم API نفس chat
     */
    public function generateDeepAnalysis(string $englishTerm, array $heritageData, array $modernTerms): string
    {
        $heritageText = '';
        foreach ($heritageData as $h) {
            if (isset($h['meaning'])) {
                $shortened = mb_substr($h['meaning'], 0, 300);
                if (mb_strlen($h['meaning']) > 300) {
                    $shortened .= '...';
                }
                $era = $h['era'] ?? 'غير محدد';
                $source = $h['source'] ?? 'مصدر غير معروف';
                $heritageText .= "**{$source}** ({$era}): {$shortened}\n\n";
            }
        }

        $modernText = '';
        foreach ($modernTerms as $ar => $info) {
            $modernText .= "- {$ar}: من {$info['count']} مصدر\n";
        }

        $prompt = "قم بإجراء تحليل معجمي واشتقاقي عميق للمصطلح اللغوي التقني التالي:\n\n";
        $prompt .= "- المصطلح الإنجليزي (Original): {$englishTerm}\n";
        $prompt .= "- الترجمة العربية المقترحة/السائدة المراد تحليلها (Translation): المصطلحات أدناه\n\n";
        $prompt .= "### [البيانات والمصادر المتاحة]\n\n";
        $prompt .= "1. رصد الاستخدام الحديث (من قاعدة البيانات):\n{$modernText}\n\n";
        $prompt .= "2. المادة المعجمية التراثية والحديثة الموثقة:\n{$heritageText}\n\n";
        $prompt .= "### [المطلوب منك تفصيلاً]\n\n";
        $prompt .= "1. التحليل الجذري والتأصيلي:\n";
        $prompt .= "تحديد الجذر الثلاثي أو الرباعي للترجمة العربية. تتبع دلالته المحورية في المعاجم التراثية (خاصة مقاييس اللغة ولسان العرب) وكيف تطور معناه.\n\n";
        $prompt .= "2. نقد الترجمة السائدة (المقترحة):\n";
        $prompt .= "تقييم مدى مطابقة اللفظ العربي للمفهوم التقني (Functional / Conceptual Mapping).\n";
        $prompt .= "- ما هي نقاط القوة اللغوية؟\n";
        $prompt .= "- ما هي نقاط الضعف (مثلاً: هل هو ترجمة حرفية قاصرة؟ هل اللفظ فضفاض أو يسبب خلطاً مع مصطلحات أخرى؟ هل يفتقر لمرونة الاشتقاق كالفعل واسم الفاعل)؟\n\n";
        $prompt .= "3. البدائل الاشتقاقية (إن وجدت):\n";
        $prompt .= "إذا كانت الترجمة قاصرة، اقترح بديلاً أفضل بناءً على:\n";
        $prompt .= "- السماع التراثي (توليد دلالي جديد للفظ قديم).\n";
        $prompt .= "- أو القياس الاشتقاقي الصحيح (على أوزان العرب مثل: فِعالة، تفعيل، فاعول... إلخ).\n\n";
        $prompt .= "4. الخلاصة والتوصية المعجمية:\n";
        $prompt .= "حكم نهائي موجز ومحدد (هل يُعتمد اللفظ، أم يُعدل، أم يُستبدل؟) مع صياغة التعريف الدقيق للمصطلح المعرب.\n\n";
        $prompt .= "اكتب التحليل بلغة أكاديمية فصيحة، واضحة، ومباشرة دون مقدمات إنشائية.";

        try {
            $response = OpenAI::chat()->create([
                'model' => 'deepseek-chat',
                'messages' => [
                    ['role' => 'system', 'content' => 'أنت خبير لغوي ومعجمي عربي متخصص في تعريب المصطلحات التقنية والحوسبية. تتميز بتحليلك الأكاديمي الصارم، ولا تقبل المصطلحات الشائعة كمسلمات بل تفككها بناءً على فلسفة اللغة والاشتقاق، والموازنة بين دقة المعنى التقني وأصالة اللفظ العربي.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens' => 2048,
                'temperature' => 0.3,
            ]);
            
            return $response->choices[0]->message->content ?? '';
        } catch (\Exception $e) {
            Log::error('Taarib deep analysis error: ' . $e->getMessage());
            return 'تعذر إجراء التحليل العميق: ' . $e->getMessage();
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatV2Controller extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function index(): Response
    {
        if (auth()->check()) {
            auth()->user()->checkAndResetDailyCredits();
        }

        // Fetch landing page statistics
        $stats = [
            'terms_count' => \App\Models\Term::distinct('term_en')->count('term_en'),
            'resources_count' => \App\Models\Resource::count(),
            'users_count' => \App\Models\User::count(),
        ];

        return Inertia::render('ChatV2/Index', [
            'stats' => $stats
        ]);
    }

    public function search(Request $request): Response
    {
        if ($request->user()) {
            $request->user()->checkAndResetDailyCredits();
        }
        
        $q = $request->query('q');
        $results = [];
        $hadResults = false;
        
        if (!empty($q)) {
            $results = $this->searchService->searchTerms($q, false, true);
            $hadResults = !empty($results);
            
            // Track the search query
            try {
                $analytics = app(AnalyticsService::class);
                $analytics->trackSearchQuery(
                    $request,
                    $q,
                    is_array($results) ? count($results) : 0,
                    'semantic',
                    $hadResults
                );
            } catch (\Exception $e) {
                Log::error('Analytics tracking error: ' . $e->getMessage());
            }
        }

        return Inertia::render('ChatV2/Results', [
            'q' => $q,
            'results' => $results
        ]);
    }

    public function chat(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant',
            'messages.*.content' => 'nullable|string',
            'detailed_mode' => 'nullable|boolean',
        ]);

        $userMessages = $request->input('messages');
        $detailedMode = $request->input('detailed_mode', false);
        
        // Handle keyword logic for the last user message
        $lastMessageIndex = count($userMessages) - 1;
        if ($lastMessageIndex >= 0 && $userMessages[$lastMessageIndex]['role'] === 'user') {
            $content = trim($userMessages[$lastMessageIndex]['content']);
            // If it's a single word (no spaces), treat it as a message to be searched
            if (!str_contains($content, ' ')) {
                 $userMessages[$lastMessageIndex]['content'] = "Find information about \"{$content}\"";
            }
        }

        // Credit System Logic
        $user = $request->user();
        if ($user) {
            $user->checkAndResetDailyCredits();

            // Check if user has credits
            if ($user->daily_credits <= 0) {
                 return response()->json([
                     'error' => 'لقد استنفدت رصيدك اليومي (20 محاولة). يرجى العودة غداً.'
                 ], 403);
            }

            // Deduct credit explicitly and save only if not unlimited
            if (!$user->is_unlimited) {
                $user->daily_credits -= 1;
                $user->save();
            }
        }

        return new StreamedResponse(function () use ($userMessages, $detailedMode) {
            // Disable output buffering
            if (ob_get_level()) ob_end_clean();

            try {
                $systemContent = 'You are a highly efficient Search Engine and Information Analyst specialized in Computer Science terminology. Your goal is to provide detailed, structured, and accurate search reports based on the term database, which contains specialized Computer Science terms and their Arabic translations.
                    
OPERATIONAL RULES:
1. RESPONSE FORMAT: Always provide a well-structured "Search Report". Use clear headings (Markdown # and ##), bullet points, and tables. 
2. LANGUAGE: Always respond in ARABIC.
3. DATA PRECISION: Always cite the Resource Name and Page Number for every finding.
4. TONALITY: Be professional and factual. Do not say "Welcome" or use conversational filler. Treat yourself as a Search Engine result page.
5. COUNTING RESOURCES: CRITICAL - When determining the total number of sources, do NOT double-count. If two or more translated terms come back from the SAME resource, count that resource only ONCE. Always use the top-level `resource_count` from the data.
6. TOOLS: 
   - Use `search_terms` to find relevant terms. Always assume the user wants the Smart Search capabilities.
   - Use `get_project_info` for metadata queries.
   - Use `list_resources` for structural queries.
7. 0 RESULTS FALLBACK: If `search_terms` returns an empty array `[]` or no database results, YOU MUST inform the user that there are NO results found in the database. Then, YOU MUST provide a professional definition, explanation, and translation of the term based ONLY on your own internal knowledge. Clearly state that this information is from your own knowledge and not the database.
8. COMPOSITION SEARCH FALLBACK: If `search_terms` returns `is_composition_fallback: true` (a multi-word phrase was not found as a whole, but its individual words were), YOU MUST inform the user of this. Then synthesis the combined meaning of the phrase based on the individual word results provided to you.
9. PARTIAL/COMPOUND MATCHES: If the database returns a result that is a compound phrase containing the exact requested term (e.g., user asked for "backend", but database returned "backend processor"), YOU MUST clarify this explicitly! Do NOT state that the translation for "backend processor" is the translation for "backend". Instead, note that the database provided a related compound term, and then deduce the exact translation of the specific requested term using your own knowledge combined with the context.
10. TIE-BREAKER LOGIC (CRITICAL): If you observe from the JSON data that two or more Arabic translations have the EXACT same `resource_count` and `total_count` (a tie), you CANNOT just randomly pick one. YOU MUST explicitly mention that there is a tie between them in the database, and then use your own internal knowledge as an Arabic Computer Science Linguist to decide and declare which one is logically and linguistically the "most appropriate/best" translation. You MUST fully explain the reasoning for your choice in the report.
';

                if ($detailedMode) {
                    $systemContent .= "
MODE: UNIFIED DETAILED REPORT
Follow this EXACT structure for your response (If 0 database results or composition fallback, adapt this structure reasonably while retaining professional formatting):

# تقرير مصطلحي: [English Term]

**إحصائيات:** [IF resource_count > 0: 'تم العثور على هذا المصطلح في [USE `resource_count` FROM DATA] مصادر.' ELSE: 'لـم نجد هـذا المصطلح فـي مصادرنا المعتمدة، ولكن اقترحنا هذه الترجمة بناءً على سياق الكلمة.']
(CRITICAL INSTRUCTION: Look at the top-level `resource_count` field in the JSON data. DO NOT calculate counts yourself. DO NOT mention how many times the term appeared in total, ONLY mention the number of sources/resources! Follow the IF condition above strictly.)
**التعريف:** [Brief definition of the English term in Arabic to set context]

## 1. ملخص الاستعمال الأكثر شيوعاً
[Provide a summary of the most used Arabic term and its acceptance level. Do not mention total frequency numbers, focus on the variety of sources.]

## 2. التحليل التفصيلي حسب المصدر
[List each resource and the term it uses. CRITICAL: You MUST format every page number as a standard markdown clickable link EXACTLY using this format: `[ص. X](/resources/{resource_id}/pdf#page={page_number})`. 
Example of CORRECT syntax: `[ص. 5](/resources/10/pdf#page=5)`
Example of INCORRECT syntax: `(/resources/10/pdf#page=5)[ص. 5]` — NEVER do this!]

## 3. التحليل اللغوي والدلالي (Linguistic and Semantic Analysis)
[Provide a deep linguistic and semantic description for the most used term. Discuss its linguistic roots, morphology (e.g., verb weights, derivation like 'افتعل'), and the semantic nuances that make it an appropriate translation for the English term, similar to how Arabic language academies analyze terms.]

## 4. تقييم وانتقاد الترجمة (Criticism and Evaluation)
[Provide a detailed, objective evaluation and criticism (إنتقاد) of the most used Arabic translation. Discuss its shortcomings, whether it truly captures the technical essence of the English Computer Science term, any potential confusion it might cause, and if there are better or more precise alternatives, even if less commonly used.]

Note: Be professional and comprehensive. Ensure every cited page has a link.";
                } else {
                    $systemContent .= "
MODE: ULTRA-CONCISE SUMMARY
CRITICAL: Output ONLY these 3 lines in ARABIC. No English labels, no tables, and no deep linguistic details. Be extremely brief.

Format:
**المصطلح:** [Most Used Arabic Term] - [IF resource_count > 0: '(موجود في [Use `resource_count` from data] مصادر)' ELSE: '(لـم نجد هـذا المصطلح فـي مصادرنا المعتمدة)']
[Brief description in Arabic in 1 concise sentence. Do not go into deep details.]
**بدائل:** [List 2-3 alternative terms from the data if available, comma separated]";
                }


                $systemMessage = [
                    'role' => 'system', 
                    'content' => $systemContent
                ];

                // Prepend system message to history
                $messages = array_merge([$systemMessage], $userMessages);

                $tools = [
                    [
                        'type' => 'function',
                        'function' => [
                            'name' => 'search_terms',
                            'description' => 'Search for terms in the database. Returns grouped terms with resource information.',
                            'parameters' => [
                                'type' => 'object',
                                'properties' => [
                                    'query' => [
                                        'type' => 'string',
                                        'description' => 'The search query for terms (English or Arabic)',
                                    ],
                                    // Removed exact_match and smart_mode from LLM visibility to enforce default behavior
                                ],
                                'required' => ['query'],
                            ],
                        ],
                    ],
                    [
                        'type' => 'function',
                        'function' => [
                            'name' => 'get_project_info',
                            'description' => 'Get information about the project, what it does, and what tools are available.',
                            'parameters' => [
                                'type' => 'object',
                                'properties' => (object)[],
                            ],
                        ],
                    ],
                    [
                        'type' => 'function',
                        'function' => [
                            'name' => 'list_resources',
                            'description' => 'List all available resources with their status and page counts.',
                            'parameters' => [
                                'type' => 'object',
                                'properties' => (object)[],
                            ],
                        ],
                    ],
                ];

                // First call - check if tools are needed (not streamed yet)
                $response = OpenAI::chat()->create([
                    'model' => env('OPENAI_MODEL', 'deepseek-chat'),
                    'messages' => $messages,
                    'tools' => $tools,
                ]);

                $choice = $response->choices[0];
                $finishReason = $choice->finishReason;

                // If the model wants to call a tool
                if ($finishReason === 'tool_calls' || $choice->message->toolCalls) {
                    // Send a "thinking" chunk to the client
                    echo json_encode(['chunk' => "Thinking...\n"]) . "\n";
                    flush();

                    $toolCalls = $choice->message->toolCalls;
                    
                    // Append the assistant's message with tool calls to history
                    $messages[] = $choice->message->toArray();

                    foreach ($toolCalls as $toolCall) {
                        $functionName = $toolCall->function->name;
                        $arguments = json_decode($toolCall->function->arguments, true);
                        
                        $result = null;

                        try {
                            if ($functionName === 'search_terms') {
                                // COMMAND: ALWAYS USE SMART MODE AND LOOSE MATCH
                                // User requested "keep the main search only the smart one"
                                $result = $this->searchService->searchTerms(
                                    $arguments['query'] ?? '', 
                                    false, // exactMatch = false (loose)
                                    true   // smartMode = true
                                );
                            } elseif ($functionName === 'list_resources') {
                                $result = $this->searchService->listResources();
                            } elseif ($functionName === 'get_project_info') {
                                $result = [
                                    'name' => 'Term Extractor AI',
                                    'description' => 'A system to extract, verify, and search for terminology from PDF resources.',
                                    'capabilities' => [
                                        'Search Terms' => 'Find terms in English or Arabic, with options for exact or partial matching.',
                                        'List Resources' => 'View all PDF resources the terms are extracted from.',
                                        'Detailed Context' => 'See exactly which page number a term appears on in a specific book.',
                                    ]
                                ];
                            } else {
                                $result = ['error' => "Unknown tool: $functionName"];
                            }
                        } catch (\Exception $e) {
                            $result = ['error' => $e->getMessage()];
                        }

                        // Append tool result to messages
                        $messages[] = [
                            'role' => 'tool',
                            'tool_call_id' => $toolCall->id,
                            'content' => json_encode($result),
                        ];
                    }

                    // Streaming the final response
                    $stream = OpenAI::chat()->createStreamed([
                        'model' => env('OPENAI_MODEL', 'deepseek-chat'),
                        'messages' => $messages,
                    ]);

                    foreach ($stream as $response) {
                        if (isset($response->choices[0]->delta->content)) {
                            $content = $response->choices[0]->delta->content;
                            
                            // Aggressively clean ANY tag that looks like internal model instructions
                            $content = preg_replace('/<[\|｜].*?[\|｜]>/su', '', $content);
                            $content = preg_replace('/<dsml>.*?<\/dsml>/si', '', $content);
                            $content = preg_replace('/<think>.*?<\/think>/si', '', $content);
                            
                            if ($content !== '') {
                                echo json_encode(['chunk' => $content]) . "\n";
                                flush();
                            }
                        }
                    }

                } else {
                    // No tool called, just stream the original content
                    $content = $choice->message->content;
                    // Aggressive clean
                    $content = preg_replace('/<[\|｜].*?[\|｜]>/su', '', $content);
                    $content = preg_replace('/<dsml>.*?<\/dsml>/si', '', $content);
                    $content = preg_replace('/<think>.*?<\/think>/si', '', $content);
                    
                    echo json_encode(['chunk' => $content]) . "\n";
                    flush();
                }
            } catch (\Exception $e) {
                Log::error('ChatV2 Stream Error: ' . $e->getMessage());
                echo json_encode(['chunk' => "Error: " . $e->getMessage()]) . "\n";
                flush();
            }

        }, 200, [
            'Content-Type' => 'application/x-ndjson',
            'X-Accel-Buffering' => 'no',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }

    public function downloadPdf(Request $request) {
        $request->validate([
            'content' => 'required|string',
            'query' => 'nullable|string',
        ]);
        
        $content = $request->input('content');
        $query = $request->input('query', 'تقرير مصطلحي');
        
        // Convert Markdown to HTML
        $htmlContent = \Illuminate\Support\Str::markdown($content);
        
        // Basic CSS for nice PDF layout with RTL support
        $css = "
            <style>
                body {
                    font-family: 'Tajawal', sans-serif;
                    direction: rtl;
                    text-align: right;
                    line-height: 1.6;
                    color: #333;
                }
                h1, h2, h3 {
                    color: #1e3a8a; /* Blue-900 */
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 10px;
                    margin-top: 20px;
                }
                h1 { font-size: 24pt; text-align: center; border: none; }
                h2 { font-size: 18pt; }
                ul { margin-right: 20px; }
                li { margin-bottom: 5px; }
                strong { color: #1d4ed8; } /* Blue-700 */
                .header {
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 10pt;
                    color: #888;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                th { background-color: #f1f5f9; }
            </style>
        ";
        
        $html = "
            <html>
            <head>$css</head>
            <body>
                <div class='header'>
                    <h1>مشروع التعريب - تقرير مصطلحي</h1>
                    <p>الموضوع: {$query}</p>
                    <p>التاريخ: " . date('Y-m-d H:i') . "</p>
                </div>
                
                <div class='content'>
                    {$htmlContent}
                    
                    <div style='margin-top: 40px; padding: 15px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 11pt; color: #92400e;'>
                        <strong>تنويه:</strong> المخرجات المعروضة مستخرجة آلياً وقد تتضمن بعض الأخطاء. يُرجى مراجعة المصادر للتأكد. نحن نعمل بشكل مستمر على تدقيق وتنقيح قواعد بياناتنا للوصول إلى أعلى درجات الدقة.
                    </div>
                </div>
                
                <div class='footer'>
                    GENERATED BY MASHROU AL-TAARIB AI | مشروع التعريب الآلي
                </div>
            </body>
            </html>
        ";
        
        // Ensure temp directory exists
        $tempDir = storage_path('app/mpdf_temp');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        // Initialize mPDF with Arabic configuration and explicit writable tempDir
        $defaultConfig = (new \Mpdf\Config\ConfigVariables())->getDefaults();
        $fontDirs = $defaultConfig['fontDir'];

        $defaultFontConfig = (new \Mpdf\Config\FontVariables())->getDefaults();
        $fontData = $defaultFontConfig['fontdata'];

        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'default_font_size' => 12,
            'default_font' => 'tajawal', // Default to Tajawal
            'autoScriptToLang' => true,
            'autoLangToFont' => true,
            'tempDir' => $tempDir,
            'fontDir' => array_merge($fontDirs, [
                storage_path('fonts'), // Path where Tajawal files were downloaded
            ]),
            'fontdata' => $fontData + [
                'tajawal' => [
                    'R' => 'Tajawal-Regular.ttf',
                    'B' => 'Tajawal-Bold.ttf',
                    'useOTL' => 0xFF,
                    'useKashida' => 75,
                ]
            ]
        ]);
        
        $mpdf->SetDirectionality('rtl');
        $mpdf->WriteHTML($html);
        
        return response($mpdf->Output('report.pdf', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="term_report_' . time() . '.pdf"',
        ]);
    }
}
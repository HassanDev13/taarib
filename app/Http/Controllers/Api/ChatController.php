<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function index()
    {
        $sessions = auth()->user()->chatSessions()->orderBy('updated_at', 'desc')->get();
        return inertia('Chat/Index', ['sessions' => $sessions]);
    }

    public function chat(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant',
            'messages.*.content' => 'nullable|string',
        ]);

        $userMessages = $request->input('messages');
        $model = env('OPENAI_MODEL', 'deepseek-chat');
        $maxToolRounds = 2;

        $chatSession = null;
        if (auth()->check()) {
            $sessionId = $request->input('session_id');
            if ($sessionId) {
                $chatSession = ChatSession::where('id', $sessionId)->where('user_id', auth()->id())->first();
            }
            if (!$chatSession) {
                $chatSession = auth()->user()->chatSessions()->create([
                    'title' => $request->input('message', 'محادثة جديدة'),
                    'model' => $model,
                ]);
            }
        }

        if ($chatSession) {
            $chatSession->messages()->create([
                'role' => 'user',
                'content' => $request->input('message', ''),
                'tokens' => 0,
            ]);
        }

        $systemContent = 'You are a Search Engine and Information Analyst specialized in Computer Science terminology. Your goal is to provide detailed and accurate search reports.

OPERATIONAL RULES:
1. RESPONSE FORMAT: Use clear headings (Markdown # and ##), bullet points, and tables.
2. LANGUAGE: Always respond in ARABIC.
3. DATA PRECISION: Always cite the Resource Name and Page Number.
4. TONALITY: Professional, factual. No conversational filler.
5. TOOL:
   - **search_terms(query, exact_match?, limit?)**: بحث في قاعدة بيانات المصطلحات العربية-الإنجليزية. يُرجع المصطلحات مع معلومات المصدر (المرجع والصفحة).

IMPORTANT: ابحث بـ search_terms ثم اكتب ردك مباشرة. لا تطلب أدوات أخرى. لا تكرر الاستدعاء.

CRITICAL FORMATTING RULES:
- markdown: استخدم مسافات بعد ## و ** و * وقبل وبعد | في الجداول
- مثال صحيح: "## نتائج البحث" — خطأ: "##نتائجالبحث"
- مثال صحيح: "| مصطلح | ترجمة |" — خطأ: "|مصطلح|ترجمة|"
- كل كلمة عربية يجب أن تفصل بمسافة';

        $messages = array_merge([['role' => 'system', 'content' => $systemContent]], $userMessages);

        // Context window: keep last 12 + system prompt
        if (count($messages) > 13) {
            $messages = array_merge([$messages[0]], array_slice($messages, -12));
        }

        $tools = $this->getChatTools();
        $fullResponse = '';
        $content = '';

        return response()->stream(function () use ($request, $messages, $tools, $model, $chatSession, &$fullResponse) {
            if (ob_get_level()) ob_end_clean();

            try {
                // First call - check if tools are needed
                $response = OpenAI::chat()->create([
                    'model' => $model,
                    'messages' => $messages,
                    'tools' => $tools,
                ]);

                $choice = $response->choices[0];
                $finishReason = $choice->finishReason;

                if ($finishReason === 'tool_calls' || $choice->message->toolCalls) {
                    echo json_encode(['chunk' => "Thinking...\n"]) . "\n";
                    flush();

                    $toolCalls = $choice->message->toolCalls;
                    $messages[] = $choice->message->toArray();

                    foreach ($toolCalls as $toolCall) {
                        $functionName = $toolCall->function->name;
                        $arguments = json_decode($toolCall->function->arguments, true);

                        $result = $this->executeTool($functionName, $arguments, $arguments['query'] ?? '');
                        $result = $this->truncateResult($result);

                        $messages[] = [
                            'role' => 'tool',
                            'tool_call_id' => $toolCall->id,
                            'content' => json_encode($result),
                        ];
                    }

                    // Streaming the final response
                    $stream = OpenAI::chat()->createStreamed([
                        'model' => $model,
                        'messages' => $messages,
                    ]);

                    foreach ($stream as $response) {
                        if (isset($response->choices[0]->delta->content)) {
                            $content = $response->choices[0]->delta->content;
                            $content = $this->postProcessContent($content);

                            if ($content !== '') {
                                $fullResponse .= $content;
                                echo json_encode(['chunk' => $content]) . "\n";
                                flush();
                            }
                        }
                    }
                } else {
                    // No tool called
                    $content = $this->postProcessContent($choice->message->content ?? '');
                    $fullResponse = $content;

                    echo json_encode(['chunk' => $content]) . "\n";
                    flush();
                }
            } catch (\Exception $e) {
                Log::error('Chat Stream Error: ' . $e->getMessage());
                echo json_encode(['chunk' => "Error: " . $e->getMessage()]) . "\n";
                flush();
            }
        }, 200, [
            'Content-Type' => 'application/x-ndjson',
            'X-Accel-Buffering' => 'no',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);

        if ($chatSession && $fullResponse) {
            $chatSession->messages()->create([
                'role' => 'assistant',
                'content' => $fullResponse,
                'tokens' => $response?->usage?->totalTokens ?? 0,
            ]);
        }
    }

    private function executeTool(string $functionName, array $arguments, string $query): array
    {
        if ($functionName === 'search_terms') {
            $exactMatch = $arguments['exact_match'] ?? false;
            $limit = $arguments['limit'] ?? 5;
            return app(SearchService::class)->searchTerms($query, $exactMatch, $limit) ?? ['results' => [], 'total' => 0];
        }
        return ['error' => "Unknown tool: $functionName"];
    }

    private function getChatTools(): array
    {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'search_terms',
                    'description' => 'البحث في قاعدة بيانات المصطلحات العربية-الإنجليزية',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'query' => ['type' => 'string', 'description' => 'كلمة البحث'],
                            'exact_match' => ['type' => 'boolean', 'description' => 'بحث مطابق', 'default' => false],
                            'limit' => ['type' => 'integer', 'description' => 'عدد النتائج (أقصى 10)', 'default' => 5],
                        ],
                        'required' => ['query'],
                    ],
                ],
            ],
        ];
    }

    private function truncateResult(array $result): array
    {
        $maxLen = 3000;
        $json = json_encode($result, JSON_UNESCAPED_UNICODE);
        if (mb_strlen($json) <= $maxLen) return $result;
        if (isset($result['results']) && is_array($result['results'])) {
            $result['results'] = array_slice($result['results'], 0, 8);
            $result['note'] = '... تم تقليص النتائج';
        }
        $result['_truncated'] = true;
        return $result;
    }

    private function postProcessContent(string $text): string
    {
        return $text;
    }
}

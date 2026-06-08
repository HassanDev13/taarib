<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatSessionController extends Controller
{
    public function index()
    {
        $sessions = ChatSession::where('user_id', auth()->id())
            ->withCount('messages')
            ->recent()
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'model' => $s->model,
                'messages_count' => $s->messages_count,
                'updated_at' => $s->updated_at->diffForHumans(),
                'created_at' => $s->created_at->toIso8601String(),
            ]);

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:50',
        ]);

        $session = ChatSession::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'] ?? null,
            'model' => $validated['model'] ?? 'deepseek-chat',
        ]);

        return response()->json([
            'id' => $session->id,
            'title' => $session->title,
            'model' => $session->model,
            'messages_count' => 0,
            'updated_at' => $session->updated_at->diffForHumans(),
            'created_at' => $session->created_at->toIso8601String(),
        ], 201);
    }

    public function update(Request $request, ChatSession $session)
    {
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $session->update($validated);

        return response()->json(['id' => $session->id, 'title' => $session->title]);
    }

    public function destroy(ChatSession $session)
    {
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $session->delete();
        return response()->json(['message' => 'deleted']);
    }

    public function messages(ChatSession $session)
    {
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $session->messages()
            ->orderBy('created_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'role' => $m->role,
                'content' => $m->content,
                'tool_calls' => $m->tool_calls,
                'created_at' => $m->created_at->toIso8601String(),
            ]);

        return response()->json($messages);
    }

    public function saveMessages(Request $request, ChatSession $session)
    {
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant,system,tool',
            'messages.*.content' => 'nullable|string',
        ]);

        // Replace all messages: delete old, insert new
        $session->messages()->delete();

        foreach ($validated['messages'] as $msg) {
            $session->messages()->create([
                'role' => $msg['role'],
                'content' => $msg['content'] ?? '',
            ]);
        }

        // Auto-generate title from first user message if still default
        if ($session->title === 'محادثة جديدة') {
            $firstUser = collect($validated['messages'])->firstWhere('role', 'user');
            if ($firstUser && !empty($firstUser['content'])) {
                $title = mb_substr($firstUser['content'], 0, 60);
                if (mb_strlen($firstUser['content']) > 60) $title .= '...';
                $session->update(['title' => $title]);
            }
        }

        $session->touch(); // update updated_at

        return response()->json(['message' => 'saved']);
    }
}

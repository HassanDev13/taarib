<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    protected $fillable = [
        'chat_session_id', 'role', 'content',
        'tool_calls', 'tool_result', 'tokens'
    ];

    protected function casts(): array
    {
        return [
            'tool_calls' => 'array',
            'tool_result' => 'array',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class, 'chat_session_id');
    }
}

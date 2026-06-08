<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    protected $fillable = ['user_id', 'title', 'model'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function scopeRecent($q)
    {
        return $q->orderBy('updated_at', 'desc');
    }

    protected static function booted(): void
    {
        static::creating(function ($session) {
            if (!$session->title) {
                $session->title = 'محادثة جديدة';
            }
        });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Term extends Model
{
    use HasFactory;
    protected $fillable = [
        "resource_page_id",
        "term_en",
        "term_ar",
        "confidence_level",
        "corrections",
        "positive_feedback_count",
        "negative_feedback_count",
        "total_feedback_count",
        "x",
        "y",
        "width",
        "height",
        "status",
        "extraction_tool",
        "rejection_reason",
        "source_url",
        "source_type",
    ];

    public function resourcePage()
    {
        return $this->belongsTo(ResourcePage::class);
    }

    /**
     * Get the edit history for this term.
     */
    public function edits()
    {
        return $this->hasMany(TermEdit::class);
    }

    /**
     * Get the feedback for this term.
     */
    public function feedback()
    {
        return $this->hasMany(TermFeedback::class);
    }
}

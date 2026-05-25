<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsPageView extends Model
{
    protected $fillable = [
        'visit_id', 'path', 'title', 'time_on_page',
        'scroll_depth', 'search_query', 'search_results_count', 'search_type', 'viewed_at'
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function visit()
    {
        return $this->belongsTo(AnalyticsVisit::class, 'visit_id');
    }
}

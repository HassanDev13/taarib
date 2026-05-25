<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsSearchQuery extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'query', 'query_normalized', 'results_count',
        'search_type', 'had_results', 'visit_id', 'searched_at'
    ];

    protected $casts = [
        'had_results' => 'boolean',
        'searched_at' => 'datetime',
    ];

    public function visit()
    {
        return $this->belongsTo(AnalyticsVisit::class, 'visit_id');
    }
}

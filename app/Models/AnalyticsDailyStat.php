<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsDailyStat extends Model
{
    protected $fillable = [
        'date', 'visitors', 'page_views', 'searches', 'unique_searches',
        'auth_users', 'avg_time_on_site', 'bounce_rate',
        'top_pages', 'top_queries', 'browsers', 'devices', 'referrers'
    ];

    protected $casts = [
        'date' => 'date',
        'top_pages' => 'array',
        'top_queries' => 'array',
        'browsers' => 'array',
        'devices' => 'array',
        'referrers' => 'array',
    ];

    public static function getLastDays(int $days = 7): array
    {
        return self::where('date', '>=', now()->subDays($days))
            ->orderBy('date', 'asc')
            ->get()
            ->toArray();
    }
}

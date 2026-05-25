<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsVisit extends Model
{
    protected $fillable = [
        'session_id', 'visitor_id', 'ip_hash', 'path', 'referrer',
        'user_agent', 'browser_family', 'os_family', 'device_type',
        'language', 'country_code', 'is_authenticated', 'user_id', 'visited_at'
    ];

    protected $casts = [
        'is_authenticated' => 'boolean',
        'visited_at' => 'datetime',
    ];

    public function pageViews()
    {
        return $this->hasMany(AnalyticsPageView::class, 'visit_id');
    }
}

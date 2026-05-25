<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\AnalyticsService;

class TrackAnalytics
{
    protected AnalyticsService $analytics;

    public function __construct(AnalyticsService $analytics)
    {
        $this->analytics = $analytics;
    }

    public function handle(Request $request, Closure $next)
    {
        // Skip tracking for non-GET requests, static assets, and authenticated API calls
        if (!$request->isMethod('GET') || $request->expectsJson()) {
            return $next($request);
        }

        // Don't track bots/crawlers
        $ua = $request->userAgent();
        if ($ua && preg_match('/bot|crawl|spider|scrape|uptime|ping|monitor/i', $ua)) {
            return $next($request);
        }

        // Track the visit
        $visit = $this->analytics->trackVisit($request);

        // Store visit ID in session for subsequent tracking
        if ($visit) {
            session(['analytics_visit_id' => $visit->id]);
            session(['analytics_visited_at' => now()]);
        }

        return $next($request);
    }
}

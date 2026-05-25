<?php

namespace App\Services;

use App\Models\AnalyticsVisit;
use App\Models\AnalyticsPageView;
use App\Models\AnalyticsSearchQuery;
use App\Models\AnalyticsDailyStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Track a page visit
     */
    public function trackVisit(Request $request): ?AnalyticsVisit
    {
        $ipHash = md5($request->ip() . config('app.key'));
        $userAgent = $request->userAgent();
        $sessionId = $request->session()->getId();

        $parsed = $this->parseUserAgent($userAgent);

        // Rate limiting: skip if same visitor in last 2 seconds
        $recent = AnalyticsVisit::where('ip_hash', $ipHash)
            ->where('visited_at', '>=', now()->subSeconds(2))
            ->exists();

        if ($recent) {
            return null;
        }

        $visit = AnalyticsVisit::create([
            'session_id' => $sessionId,
            'visitor_id' => $ipHash,
            'ip_hash' => $ipHash,
            'path' => $request->path(),
            'referrer' => $request->header('referer'),
            'user_agent' => $userAgent,
            'browser_family' => $parsed['browser'] ?? 'Unknown',
            'os_family' => $parsed['os'] ?? 'Unknown',
            'device_type' => $parsed['device'] ?? 'desktop',
            'language' => substr($request->header('Accept-Language', 'en'), 0, 2),
            'is_authenticated' => auth()->check(),
            'user_id' => auth()->id(),
            'visited_at' => now(),
        ]);

        return $visit;
    }

    /**
     * Track a page view (part of a visit)
     */
    public function trackPageView(AnalyticsVisit $visit, array $data): AnalyticsPageView
    {
        return AnalyticsPageView::create(array_merge([
            'visit_id' => $visit->id,
            'viewed_at' => now(),
        ], $data));
    }

    /**
     * Track a search query
     */
    public function trackSearchQuery(Request $request, string $query, int $resultsCount, string $searchType, bool $hadResults): AnalyticsSearchQuery
    {
        $record = AnalyticsSearchQuery::create([
            'query' => $query,
            'query_normalized' => mb_strtolower(trim($query)),
            'results_count' => $resultsCount,
            'search_type' => $searchType,
            'had_results' => $hadResults,
            'visit_id' => $this->getOrCreateVisit($request)?->id,
            'searched_at' => now(),
        ]);

        return $record;
    }

    /**
     * Generate daily stats (run by cron)
     */
    public function generateDailyStats(): AnalyticsDailyStat
    {
        $today = now()->toDateString();

        $visitors = AnalyticsVisit::whereDate('visited_at', $today)->count();
        $pageViews = AnalyticsPageView::whereDate('viewed_at', $today)->count();
        $searches = AnalyticsSearchQuery::whereDate('searched_at', $today)->count();
        $uniqueSearches = AnalyticsSearchQuery::whereDate('searched_at', $today)
            ->distinct('query_normalized')->count('query_normalized');

        // Top pages
        $topPages = AnalyticsPageView::whereDate('viewed_at', $today)
            ->select('path', DB::raw('COUNT(*) as count'))
            ->groupBy('path')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();

        // Top queries
        $topQueries = AnalyticsSearchQuery::whereDate('searched_at', $today)
            ->select('query_normalized', DB::raw('COUNT(*) as count'), 'search_type')
            ->groupBy('query_normalized', 'search_type')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();

        // Failed searches (queries with no results)
        $failedQueries = AnalyticsSearchQuery::whereDate('searched_at', $today)
            ->where('had_results', false)
            ->select('query_normalized', DB::raw('COUNT(*) as count'))
            ->groupBy('query_normalized')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();

        // Browser stats
        $browsers = AnalyticsVisit::whereDate('visited_at', $today)
            ->select('browser_family', DB::raw('COUNT(*) as count'))
            ->groupBy('browser_family')
            ->orderByDesc('count')
            ->get()
            ->pluck('count', 'browser_family')
            ->toArray();

        // Device stats
        $devices = AnalyticsVisit::whereDate('visited_at', $today)
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get()
            ->pluck('count', 'device_type')
            ->toArray();

        // Referrers
        $referrers = AnalyticsVisit::whereDate('visited_at', $today)
            ->whereNotNull('referrer')
            ->select('referrer', DB::raw('COUNT(*) as count'))
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->pluck('count', 'referrer')
            ->toArray();

        return AnalyticsDailyStat::updateOrCreate(
            ['date' => $today],
            [
                'visitors' => $visitors,
                'page_views' => $pageViews,
                'searches' => $searches,
                'unique_searches' => $uniqueSearches,
                'top_pages' => $topPages,
                'top_queries' => $topQueries,
                'browsers' => $browsers,
                'devices' => $devices,
                'referrers' => $referrers,
            ]
        );
    }

    /**
     * Generate weekly report data
     */
    public function generateWeeklyReport(int $days = 7): array
    {
        $stats = AnalyticsDailyStat::where('date', '>=', now()->subDays($days))
            ->orderBy('date')
            ->get();

        $totals = [
            'period' => now()->subDays($days)->toDateString() . ' → ' . now()->toDateString(),
            'total_visitors' => $stats->sum('visitors'),
            'total_page_views' => $stats->sum('page_views'),
            'total_searches' => $stats->sum('searches'),
            'total_unique_searches' => $stats->sum('unique_searches'),
            'daily_avg' => round($stats->avg('visitors'), 0),
            'avg_time' => round($stats->avg('avg_time_on_site'), 0),
        ];

        // Top queries across entire period
        $topQueriesAll = AnalyticsSearchQuery::where('searched_at', '>=', now()->subDays($days))
            ->select('query_normalized', DB::raw('COUNT(*) as count'))
            ->groupBy('query_normalized')
            ->orderByDesc('count')
            ->limit(20)
            ->get()
            ->toArray();

        // Failed searches (no results)
        $failedQueriesAll = AnalyticsSearchQuery::where('searched_at', '>=', now()->subDays($days))
            ->where('had_results', false)
            ->select('query_normalized', DB::raw('COUNT(*) as count'))
            ->groupBy('query_normalized')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();

        return [
            'totals' => $totals,
            'top_queries' => $topQueriesAll,
            'failed_queries' => $failedQueriesAll,
            'daily_breakdown' => $stats,
        ];
    }

    private function parseUserAgent(?string $ua): array
    {
        if (empty($ua)) {
            return ['browser' => 'Unknown', 'os' => 'Unknown', 'device' => 'desktop'];
        }

        $browser = 'Unknown';
        $os = 'Unknown';
        $device = 'desktop';

        // Browser detection
        if (str_contains($ua, 'Edg/') || str_contains($ua, 'Edge/')) $browser = 'Edge';
        elseif (str_contains($ua, 'Chrome/')) $browser = 'Chrome';
        elseif (str_contains($ua, 'Firefox/')) $browser = 'Firefox';
        elseif (str_contains($ua, 'Safari/')) $browser = 'Safari';
        elseif (str_contains($ua, 'Opera/') || str_contains($ua, 'OPR/')) $browser = 'Opera';
        elseif (str_contains($ua, 'MSIE') || str_contains($ua, 'Trident/')) $browser = 'Internet Explorer';

        // OS detection
        if (str_contains($ua, 'Windows NT')) $os = 'Windows';
        elseif (str_contains($ua, 'Mac OS X')) $os = 'macOS';
        elseif (str_contains($ua, 'Linux') && !str_contains($ua, 'Android')) $os = 'Linux';
        elseif (str_contains($ua, 'Android')) $os = 'Android';
        elseif (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) $os = 'iOS';

        // Device detection
        if (str_contains($ua, 'Mobi') || str_contains($ua, 'Android.*Mobile')) $device = 'mobile';
        elseif (str_contains($ua, 'iPad') || str_contains($ua, 'Tablet')) $device = 'tablet';
        elseif (str_contains($ua, 'bot') || str_contains($ua, 'crawl') || str_contains($ua, 'spider')) $device = 'bot';

        return compact('browser', 'os', 'device');
    }

    private function getOrCreateVisit(Request $request): ?AnalyticsVisit
    {
        $recent = AnalyticsVisit::where('ip_hash', md5($request->ip() . config('app.key')))
            ->where('visited_at', '>=', now()->subMinutes(5))
            ->latest()
            ->first();

        if ($recent) {
            return $recent;
        }

        return $this->trackVisit($request);
    }
}

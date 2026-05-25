<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use App\Models\AnalyticsSearchQuery;
use App\Models\AnalyticsDailyStat;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    private function checkToken(Request $request): bool
    {
        $token = $request->query('token', $request->header('X-Analytics-Token'));
        return $token === env('APP_ANALYTICS_TOKEN');
    }

    private function unauthorized()
    {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function report(Request $request, AnalyticsService $analytics)
    {
        if (!$this->checkToken($request)) {
            return $this->unauthorized();
        }

        $days = (int) $request->query('days', 7);
        $report = $analytics->generateWeeklyReport($days);
        
        // Add failed queries
        $report['failed_queries'] = AnalyticsSearchQuery::where('searched_at', '>=', now()->subDays($days))
            ->where('had_results', false)
            ->selectRaw('query_normalized, COUNT(*) as count')
            ->groupBy('query_normalized')
            ->orderByDesc('count')
            ->limit(20)
            ->get()
            ->toArray();

        return response()->json($report);
    }

    public function failedQueries(Request $request)
    {
        if (!$this->checkToken($request)) {
            return $this->unauthorized();
        }

        $days = (int) $request->query('days', 30);
        
        $queries = AnalyticsSearchQuery::where('searched_at', '>=', now()->subDays($days))
            ->where('had_results', false)
            ->selectRaw('query_normalized, COUNT(*) as count')
            ->groupBy('query_normalized')
            ->orderByDesc('count')
            ->limit(50)
            ->get();

        return response()->json([
            'total' => $queries->count(),
            'queries' => $queries
        ]);
    }
}

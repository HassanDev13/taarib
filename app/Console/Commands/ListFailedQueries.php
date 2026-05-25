<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AnalyticsSearchQuery;
use App\Models\Term;

class ListFailedQueries extends Command
{
    protected $signature = 'analytics:failed-queries {--days=30}';

    protected $description = 'Show queries that returned no results (add these to DB!)';

    public function handle()
    {
        $days = (int) $this->option('days');

        $queries = AnalyticsSearchQuery::where('searched_at', '>=', now()->subDays($days))
            ->where('had_results', false)
            ->selectRaw('query_normalized, COUNT(*) as count')
            ->groupBy('query_normalized')
            ->orderByDesc('count')
            ->limit(20)
            ->get();

        if ($queries->isEmpty()) {
            $this->info('🎉 No failed queries found! All terms are covered.');
            return 0;
        }

        $this->newLine();
        $this->line(' ╔══════════════════════════════════════════╗');
        $this->line(' ║  ⚠️  QUERIES WITHOUT TRANSLATIONS        ║');
        $this->line(' ║  → Add these to the DB!                  ║');
        $this->line(' ╚══════════════════════════════════════════╝');
        $this->newLine();
        $this->line('  Term                  Failed Searches');
        $this->line(' ─────────────────────────────────────────');
        
        foreach ($queries as $q) {
            $exists = Term::whereRaw('LOWER(term_en) = ? OR LOWER(term_ar) = ?', 
                [strtolower($q->query_normalized), strtolower($q->query_normalized)])->exists();
            $tag = $exists ? '✅ in DB' : '❌ MISSING';
            $this->line(sprintf('  %-22s %3d %s', $q->query_normalized, $q->count, $tag));
        }
        
        $this->newLine();
        return 0;
    }
}

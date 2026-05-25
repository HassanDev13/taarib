<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AnalyticsService;

class GenerateAnalyticsReport extends Command
{
    protected $signature = 'analytics:report 
        {--days=7 : Number of days to analyze}
        {--json : Output as JSON}
        {--save : Also save as daily stats}';
    
    protected $description = 'Generate and display analytics report for Taarib';

    protected AnalyticsService $analytics;

    public function __construct(AnalyticsService $analytics)
    {
        parent::__construct();
        $this->analytics = $analytics;
    }

    public function handle()
    {
        $days = (int) $this->option('days');

        if ($this->option('save')) {
            $this->analytics->generateDailyStats();
            $this->info('✅ Daily stats saved');
        }

        $report = $this->analytics->generateWeeklyReport($days);

        if ($this->option('json')) {
            $this->line(json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            return 0;
        }

        $totals = $report['totals'];

        $this->newLine();
        $this->line('==============================================');
        $this->line(' 🧿 TAARIB — ANALYTICS REPORT');
        $this->line('==============================================');
        $this->line(" 📅 Period: {$totals['period']}");
        $this->newLine();
        $this->line(' ┌─────────────────────┬───────────┐');
        $this->line(sprintf(' │ 👥 Total visitors     │ %9d │', $totals['total_visitors']));
        $this->line(sprintf(' │ 📄 Total page views   │ %9d │', $totals['total_page_views']));
        $this->line(sprintf(' │ 🔍 Total searches     │ %9d │', $totals['total_searches']));
        $this->line(sprintf(' │ ✨ Unique searches    │ %9d │', $totals['total_unique_searches']));
        $this->line(sprintf(' │ 📊 Daily avg visitors │ %9d │', $totals['daily_avg']));
        $this->line(' └─────────────────────┴───────────┘');
        $this->newLine();

        if (!empty($report['top_queries'])) {
            $this->line(' ╔══════════════════════════════════════╗');
            $this->line(' ║   🔍  TOP SEARCHES                  ║');
            $this->line(' ╚══════════════════════════════════════╝');
            $this->line(str_pad('', 5) . str_pad('Query', 30) . str_pad('Count', 8));
            $this->line(str_repeat('─', 45));
            foreach (array_slice($report['top_queries'], 0, 10) as $q) {
                $this->line(str_pad('', 5) . str_pad(mb_substr($q['query_normalized'], 0, 28), 30) . str_pad($q['count'], 8));
            }
        }

        if (!empty($report['failed_queries'])) {
            $this->newLine();
            $this->line(' ╔══════════════════════════════════════╗');
            $this->line(' ║   ⚠️  MISSING TRANSLATIONS           ║');
            $this->line(' ╚══════════════════════════════════════╝');
            foreach ($report['failed_queries'] as $q) {
                $this->line("   ⚠️  \"{$q['query_normalized']}\" — {$q['count']} failed searches");
            }
            $this->line('   → These are opportunities to add new terms!');
        }

        $this->newLine();
        return 0;
    }
}

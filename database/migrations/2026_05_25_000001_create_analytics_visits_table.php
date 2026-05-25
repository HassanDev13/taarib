<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_visits', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64)->index();
            $table->string('visitor_id', 64)->nullable()->index();
            $table->string('ip_hash', 32)->nullable()->index();
            $table->string('path', 500)->index();
            $table->string('referrer', 500)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('browser_family', 50)->nullable();
            $table->string('os_family', 50)->nullable();
            $table->string('device_type', 20)->nullable(); // desktop, tablet, mobile
            $table->string('language', 10)->nullable();
            $table->string('country_code', 2)->nullable();
            $table->boolean('is_authenticated')->default(false);
            $table->foreignId('user_id')->nullable()->constrained();
            $table->timestamp('visited_at')->useCurrent()->index();
            $table->timestamps();

        });

        Schema::create('analytics_page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('analytics_visits')->onDelete('cascade');
            $table->string('path', 500);
            $table->string('title', 500)->nullable();
            $table->integer('time_on_page')->nullable(); // seconds
            $table->integer('scroll_depth')->nullable(); // percentage
            $table->text('search_query')->nullable();
            $table->integer('search_results_count')->nullable();
            $table->string('search_type', 20)->nullable(); // semantic, exact, partial
            $table->timestamp('viewed_at')->useCurrent();
            $table->index(["viewed_at", "path"]);
        });

        Schema::create('analytics_search_queries', function (Blueprint $table) {
            $table->id();
            $table->string('query', 500);
            $table->string('query_normalized', 500)->index();
            $table->integer('results_count')->default(0);
            $table->string('search_type', 20)->nullable();
            $table->boolean('had_results')->default(true);
            $table->foreignId('visit_id')->nullable()->constrained('analytics_visits')->onDelete('set null');
            $table->timestamp('searched_at')->useCurrent()->index();
        });

        Schema::create('analytics_daily_stats', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique()->index();
            $table->integer('visitors')->default(0);
            $table->integer('page_views')->default(0);
            $table->integer('searches')->default(0);
            $table->integer('unique_searches')->default(0);
            $table->integer('auth_users')->default(0);
            $table->float('avg_time_on_site')->default(0);
            $table->float('bounce_rate')->default(0);
            $table->json('top_pages')->nullable();
            $table->json('top_queries')->nullable();
            $table->json('browsers')->nullable();
            $table->json('devices')->nullable();
            $table->json('referrers')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_daily_stats');
        Schema::dropIfExists('analytics_search_queries');
        Schema::dropIfExists('analytics_page_views');
        Schema::dropIfExists('analytics_visits');
    }
};

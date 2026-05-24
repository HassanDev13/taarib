<?php

namespace Tests\Feature;

use Tests\TestCase;

class SearchApiRateLimitTest extends TestCase
{
    /**
     * Test search API structure and results.
     */
    public function test_search_api_returns_correct_response_structure(): void
    {
        $response = $this->getJson('/api/v1/search?q=algorithm');

        // It should return 200 (even if database is empty, it returns empty data with 200 OK)
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'count',
        ]);
    }

    /**
     * Test search API rate limit.
     */
    public function test_search_api_enforces_rate_limiting(): void
    {
        // Hit the endpoint 60 times (the configured limit)
        for ($i = 0; $i < 60; $i++) {
            $this->getJson('/api/v1/search?q=algorithm')->assertStatus(200);
        }

        // The 61st request must be rate limited
        $response = $this->getJson('/api/v1/search?q=algorithm');
        $response->assertStatus(429);
        
        // Assert rate limit headers are present in the response
        $response->assertHeader('X-RateLimit-Limit');
        $response->assertHeader('X-RateLimit-Remaining');
    }
}

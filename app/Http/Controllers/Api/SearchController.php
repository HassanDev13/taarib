<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Search for terms and return grouped results.
     */
    public function search(Request $request): JsonResponse
    {
        $search = $request->input('q', $request->input('search', ''));
        
        if (empty($search)) {
            return response()->json([
                'data' => [],
                'message' => 'Please provide a search query using ?q= param.'
            ]);
        }

        $result = $this->searchService->searchTerms($search, false, true);

        return response()->json([
            'data' => $result,
            'count' => count($result)
        ]);
    }

    /**
     * List all resources.
     */
    public function resources(): JsonResponse
    {
        $resources = $this->searchService->listResources();

        return response()->json([
            'data' => $resources,
            'count' => count($resources)
        ]);
    }
}

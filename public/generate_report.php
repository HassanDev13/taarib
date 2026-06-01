<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$resources = [
    [
        'name' => 'Source 1 (المعجم الموحد لمصطلحات المعلوماتية - مغرب - 2000)',
        'id' => 5,
        'ranges' => [[89, 100], [109, 114]]
    ],
    [
        'name' => 'Source 2 (معجم الحاسبات، مجمع اللغة العربية بالقاهرة طبعة 4 - مصر - 2012)',
        'id' => 4,
        'ranges' => [[1, 10]]
    ],
    [
        'name' => 'Source 3 (المجلس الأعلى للغة العربية - الجزائر - 2011)',
        'id' => 6,
        'ranges' => [[20, 30]]
    ]
];

$graphData = [
    'labels' => [],
    'tesseractCounts' => [],
    'visionCounts' => [],
    'tesseractHighConf' => [],
    'visionHighConf' => [],
    'tesseractArLength' => [],
    'visionArLength' => [],
];

$sectionsHtml = '';

foreach ($resources as $resource) {
    $shortName = substr($resource['name'], 0, 8); // e.g. "Source 1"
    $graphData['labels'][] = $shortName;

    $resTCount = 0;
    $resVCount = 0;
    $resTHighConf = 0;
    $resVHighConf = 0;
    $resTArLenSum = 0;
    $resVArLenSum = 0;

    $sectionsHtml .= '<h2 class="text-3xl font-bold mt-12 mb-6 text-gray-800 border-b pb-2">' . htmlspecialchars($resource['name']) . '</h2>';

    foreach ($resource['ranges'] as $range) {
        $startPage = $range[0];
        $endPage = $range[1];

        $pageIds = DB::table('resource_pages')
            ->where('resource_id', $resource['id'])
            ->whereBetween('page_number', [$startPage, $endPage])
            ->pluck('id');

        // Fetch terms
        $tesseractTerms = DB::table('terms')
            ->whereIn('resource_page_id', $pageIds)
            ->where(function($q) {
                $q->whereNull('extraction_tool')
                  ->orWhere('extraction_tool', 'tesseract')
                  ->orWhere('extraction_tool', '!=', 'google_vision');
            })
            ->get();

        $visionTerms = DB::table('terms')
            ->whereIn('resource_page_id', $pageIds)
            ->where('extraction_tool', 'google_vision')
            ->get();

        $tCount = $tesseractTerms->count();
        $vCount = $visionTerms->count();
        
        $resTCount += $tCount;
        $resVCount += $vCount;
        
        // Count high confidence terms (>= 9)
        $tHigh = $tesseractTerms->where('confidence_level', '>=', 9)->count();
        $vHigh = $visionTerms->where('confidence_level', '>=', 9)->count();
        $resTHighConf += $tHigh;
        $resVHighConf += $vHigh;

        // Calculate Arabic string lengths to detect fragmentation
        foreach ($tesseractTerms as $t) {
            $resTArLenSum += mb_strlen(trim($t->term_ar));
        }
        foreach ($visionTerms as $v) {
            $resVArLenSum += mb_strlen(trim($v->term_ar));
        }

        $sectionsHtml .= '<div class="bg-white rounded-lg shadow-md mb-8 overflow-hidden">';
        $sectionsHtml .= '<div class="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">';
        $sectionsHtml .= '<h3 class="text-xl font-semibold">Pages: ' . $startPage . ' to ' . $endPage . '</h3>';
        $sectionsHtml .= '<div class="flex space-x-8">';
        
        // Tesseract Stats
        $sectionsHtml .= '<div class="text-center"><span class="block text-sm text-gray-500 uppercase tracking-wide">Tesseract Terms</span><span class="block text-2xl font-bold text-red-600">' . $tCount . '</span></div>';
        
        // Vision Stats
        $sectionsHtml .= '<div class="text-center"><span class="block text-sm text-gray-500 uppercase tracking-wide">Google Vision Terms</span><span class="block text-2xl font-bold text-green-600">' . $vCount . '</span></div>';
        
        $sectionsHtml .= '</div></div>';

        // Table
        $sectionsHtml .= '<div class="flex flex-col md:flex-row">';
        
        // Tesseract Column
        $sectionsHtml .= '<div class="w-full md:w-1/2 border-r p-4 bg-red-50/30">';
        $sectionsHtml .= '<h4 class="font-semibold text-red-800 mb-4 flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Tesseract Extraction</h4>';
        $sectionsHtml .= '<div class="max-h-96 overflow-y-auto space-y-2">';
        foreach ($tesseractTerms->take(30) as $t) {
            $sectionsHtml .= '<div class="p-3 bg-white border border-red-100 rounded shadow-sm flex justify-between items-start term-row">';
            $sectionsHtml .= '<div><div class="font-mono text-sm text-blue-800">' . htmlspecialchars($t->term_en) . '</div><div class="text-gray-800 font-arabic text-lg mt-1" dir="rtl">' . htmlspecialchars($t->term_ar) . '</div></div>';
            $sectionsHtml .= '<span class="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">Conf: ' . $t->confidence_level . '</span>';
            $sectionsHtml .= '</div>';
        }
        if ($tCount > 30) $sectionsHtml .= '<div class="text-center text-sm text-gray-500 italic mt-2">... and ' . ($tCount - 30) . ' more terms</div>';
        if ($tCount == 0) $sectionsHtml .= '<div class="text-center text-gray-500 italic py-8">No terms extracted</div>';
        $sectionsHtml .= '</div></div>';

        // Vision Column
        $sectionsHtml .= '<div class="w-full md:w-1/2 p-4 bg-green-50/30">';
        $sectionsHtml .= '<h4 class="font-semibold text-green-800 mb-4 flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Google Vision Extraction</h4>';
        $sectionsHtml .= '<div class="max-h-96 overflow-y-auto space-y-2">';
        foreach ($visionTerms->take(30) as $v) {
            $sectionsHtml .= '<div class="p-3 bg-white border border-green-100 rounded shadow-sm flex justify-between items-start term-row">';
            $sectionsHtml .= '<div><div class="font-mono text-sm text-blue-800">' . htmlspecialchars($v->term_en) . '</div><div class="text-gray-800 font-arabic text-lg mt-1" dir="rtl">' . htmlspecialchars($v->term_ar) . '</div></div>';
            $sectionsHtml .= '<span class="px-2 py-1 bg-green-100 text-xs rounded text-green-800">Conf: ' . $v->confidence_level . '</span>';
            $sectionsHtml .= '</div>';
        }
        if ($vCount > 30) $sectionsHtml .= '<div class="text-center text-sm text-gray-500 italic mt-2">... and ' . ($vCount - 30) . ' more terms</div>';
        if ($vCount == 0) $sectionsHtml .= '<div class="text-center text-gray-500 italic py-8">No terms extracted</div>';
        $sectionsHtml .= '</div></div>';

        $sectionsHtml .= '</div></div>';
    }

    $graphData['tesseractCounts'][] = $resTCount;
    $graphData['visionCounts'][] = $resVCount;
    
    // Percentage of High Confidence Terms (>= 9)
    $graphData['tesseractHighConf'][] = $resTCount > 0 ? round(($resTHighConf / $resTCount) * 100) : 0;
    $graphData['visionHighConf'][] = $resVCount > 0 ? round(($resVHighConf / $resVCount) * 100) : 0;

    // Average Arabic Word Length (longer usually means less fragmentation)
    $graphData['tesseractArLength'][] = $resTCount > 0 ? round($resTArLenSum / $resTCount, 1) : 0;
    $graphData['visionArLength'][] = $resVCount > 0 ? round($resVArLenSum / $resVCount, 1) : 0;
}

$graphJson = json_encode($graphData);

$html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR Accuracy Report: Tesseract vs Google Vision</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; }
        .term-row { transition: all 0.2s; }
        .term-row:hover { background-color: #f1f5f9; }
    </style>
</head>
<body class="p-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-2 text-center text-blue-900">OCR Extraction Comparison</h1>
        <p class="text-center text-gray-600 mb-8">Tesseract OCR vs Google Cloud Vision OCR</p>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">Why Average Confidence is Misleading</h2>
            <p class="mb-4 text-gray-700">The AI model often assigns similar confidence scores (like 8) to both Tesseract and Google Vision because it evaluates <strong>its own ability to match the English word to its Arabic translation</strong>, not the raw OCR quality. If Tesseract gives the AI a corrupted word like <code class="bg-gray-100 px-1 rounded">ا ل ح ا س و ب</code> and the AI successfully figures out it means <code class="bg-gray-100 px-1 rounded">الحاسوب</code>, the AI will still assign it a high confidence score because the semantic match is correct.</p>
            <p class="mb-4 text-gray-700">Therefore, to truly compare the OCR engines, we must look at: <strong>Total Extraction Volume</strong> (Google Vision gives cleaner text, allowing the AI to find more terms), <strong>Percentage of Perfect (9-10) Confidence Matches</strong> (where the AI didn\'t have to guess at all), and <strong>Arabic Character Length</strong> (Tesseract often drops or breaks Arabic words).</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-sm uppercase font-bold text-center mb-2 text-gray-500">Total Terms Extracted</h3>
                <canvas id="countChart" height="250"></canvas>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-sm uppercase font-bold text-center mb-2 text-gray-500">% of Perfect Confidence (9-10)</h3>
                <canvas id="confChart" height="250"></canvas>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-sm uppercase font-bold text-center mb-2 text-gray-500">Average Arabic Term Length</h3>
                <canvas id="lenChart" height="250"></canvas>
            </div>
        </div>

        ' . $sectionsHtml . '

        <div class="text-center text-sm text-gray-500 mt-12 pb-8">
            Generated by Taarib System Analysis
        </div>
    </div>

    <script>
        const data = ' . $graphJson . ';

        const commonOptions = {
            responsive: true,
            plugins: { legend: { position: "bottom" } }
        };

        new Chart(document.getElementById("countChart"), {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [
                    { label: "Tesseract", backgroundColor: "rgba(239, 68, 68, 0.8)", data: data.tesseractCounts },
                    { label: "Google Vision", backgroundColor: "rgba(34, 197, 94, 0.8)", data: data.visionCounts }
                ]
            },
            options: { ...commonOptions, scales: { y: { title: { display: true, text: "Total Volume" } } } }
        });

        new Chart(document.getElementById("confChart"), {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [
                    { label: "Tesseract", backgroundColor: "rgba(239, 68, 68, 0.8)", data: data.tesseractHighConf },
                    { label: "Google Vision", backgroundColor: "rgba(34, 197, 94, 0.8)", data: data.visionHighConf }
                ]
            },
            options: { ...commonOptions, scales: { y: { max: 100, title: { display: true, text: "Percentage (%)" } } } }
        });

        new Chart(document.getElementById("lenChart"), {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [
                    { label: "Tesseract", backgroundColor: "rgba(239, 68, 68, 0.8)", data: data.tesseractArLength },
                    { label: "Google Vision", backgroundColor: "rgba(34, 197, 94, 0.8)", data: data.visionArLength }
                ]
            },
            options: { ...commonOptions, scales: { y: { title: { display: true, text: "Characters" } } } }
        });
    </script>
</body>
</html>';

file_put_contents(__DIR__ . '/ocr_comparison_report.html', $html);
echo "Report with advanced graphs generated at public/ocr_comparison_report.html\n";

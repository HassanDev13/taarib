<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TermController;

use App\Http\Controllers\Api\ChatV2Controller;
Route::get("/", [ChatV2Controller::class, "index"])->name("home");
Route::get("/paper", function () {
    return inertia("ChatV2/Paper");
})->name("paper");

// Route::get("/award", function () {
//     return inertia("ChatV2/Award");
// })->name("award");



Route::get("/developers", function () {
    return inertia("ChatV2/Developers");
})->name("developers");


Route::get("/search", [ChatV2Controller::class, "search"])->name("search.results");

Route::get("/contact", function () {
    return inertia("ChatV2/ContactAcademies");
})->name("contact");

Route::get("/thanks", function () {
    return inertia("Thanks");
})->name("thanks");

Route::get("/contribute", function () {
    return inertia("Contribute");
})->name("contribute");

Route::get("/classic", [TermController::class, "index"])->name("terms.index");

// Redirect old /terms route to root for backward compatibility
Route::redirect("/terms", "/", 301);

// Authentication routes
use App\Http\Controllers\AuthController;

Route::get("/login", [AuthController::class, "showLogin"])->name("login");
Route::post("/login", [AuthController::class, "login"]);
Route::get("/register", [AuthController::class, "showRegister"])->name("register");
Route::post("/register", [AuthController::class, "register"]);
Route::post("/logout", [AuthController::class, "logout"])->name("logout");

// Waiting approval route
Route::get("/waiting-approval", function (\Illuminate\Http\Request $request) {
    if ($request->user() && ($request->user()->status === 'approved' || $request->user()->is_admin)) {
        return redirect('/');
    }
    return inertia("Auth/Waiting");
})->middleware('auth')->name('waiting');

// Locale switching route
Route::post("/locale/{locale}", function ($locale) {
    if (in_array($locale, ["en", "ar"])) {
        session(["locale" => $locale]);
    }
    return redirect()->back();
})->name("locale.switch");

use App\Http\Controllers\VerificationController;

// Verification view routes - accessible to all users (read-only for guests)
Route::get("/terms/{term}/verify", [
    VerificationController::class,
    "verifyTerm",
])->name("terms.verify");
Route::get("/pages/{page}/verify", [
    VerificationController::class,
    "verifyPage",
])->name("pages.verify");
Route::get("/resources/{resource}/pdf", [
    VerificationController::class,
    "servePdf",
])->name("resources.pdf");
Route::get("/pages/{page}/image", [
    VerificationController::class,
    "serveImage",
])->name("pages.image");

// Leaderboard route - accessible to all users
use App\Http\Controllers\LeaderboardController;
Route::get("/leaderboard", [LeaderboardController::class, "index"])->name(
    "leaderboard",
);

// Upload route - accessible to all users
Route::get("/upload", function () {
    return inertia("Upload");
})->name("upload");

// Check routes - accessible to all users for feedback
use App\Http\Controllers\CheckController;
Route::get("/check", [CheckController::class, "random"])->name("check.random");
Route::get("/check/{term}", [CheckController::class, "show"])->name(
    "check.term",
);
Route::post("/check/{term}/feedback", [
    CheckController::class,
    "storeFeedback",
])->name("check.feedback");
Route::get("/check/{term}/stats", [CheckController::class, "getStats"])->name(
    "check.stats",
);

// Verification mutation routes - require authentication
Route::middleware("auth")->group(function () {
    Route::put("/terms/{term}", [
        VerificationController::class,
        "updateTerm",
    ])->name("terms.update");
    Route::put("/terms/{term}/status", [
        VerificationController::class,
        "updateTermStatus",
    ])->name("terms.update-status");
});

use App\Http\Controllers\Api\ChatController;
Route::get("/chat", [ChatController::class, "index"])->name("chat.index");


// Chat V2 Routes (protected by session auth)
Route::post('/api/chat_v2', [ChatV2Controller::class, 'chat'])->middleware(['auth', 'approved'])->name('chat.v2');
Route::post('/api/chat_v2/export_pdf', [ChatV2Controller::class, 'downloadPdf'])->middleware(['auth', 'approved'])->name('chat.v2.pdf');

use App\Http\Controllers\TermSearchFeedbackController;
Route::post('/api/chat_v2/feedback', [TermSearchFeedbackController::class, 'store'])->middleware(['auth', 'approved'])->name('chat.v2.feedback');

use App\Http\Controllers\ContactController;
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

use App\Http\Controllers\UserSettingsController;
Route::middleware(['auth'])->group(function () {
    Route::get('/settings', [UserSettingsController::class, 'edit'])->name('settings.edit');
    Route::put('/settings', [UserSettingsController::class, 'update'])->name('settings.update');
    Route::delete('/settings', [UserSettingsController::class, 'destroy'])->name('settings.destroy');
});

// Analytics Dashboard (admin only)
Route::middleware(['auth', 'approved'])->prefix('analytics')->group(function () {
    Route::get('/', function () {
        return inertia('Analytics/Index', [
            'stats' => app(\App\Services\AnalyticsService::class)->generateWeeklyReport(7)
        ]);
    })->name('analytics.index');
});

// Analytics JSON API for automated reporting (Naruto reads this)
use App\Http\Controllers\AnalyticsController;
Route::get('/analytics-report/{days?}', [AnalyticsController::class, 'report'])->name('analytics.api');

// Analytics ping (time on page, scroll depth from sendBeacon)
use Illuminate\Http\Request;
Route::post('/analytics-ping', function (Request $request) {
    try {
        $data = json_decode($request->getContent(), true);
        if (!$data || empty($data['path'])) {
            return response('', 204);
        }
        
        $visitId = session('analytics_visit_id');
        if (!$visitId) return response('', 204);
        
        $visit = \App\Models\AnalyticsVisit::find($visitId);
        if (!$visit) return response('', 204);
        
        \App\Models\AnalyticsPageView::create([
            'visit_id' => $visit->id,
            'path' => $data['path'],
            'title' => $data['title'] ?? '',
            'time_on_page' => min($data['time_on_page'] ?? 0, 3600), // max 1 hour
            'scroll_depth' => min($data['scroll_depth'] ?? 0, 100),
            'viewed_at' => now(),
        ]);
    } catch (\Exception $e) {
        // Silent fail - don't break the user experience
    }
    return response('', 204);
})->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

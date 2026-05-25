<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

         <!-- Ziggy routes -->
        @routes
    </head>
    <body class="font-sans antialiased">
        @inertia
        
        {{-- Taarib Analytics Tracking --}}
        <script>
        (function() {
            const pageLoadTime = Date.now();
            let maxScroll = 0;
            
            // Track scroll depth
            window.addEventListener('scroll', function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight > 0) {
                    maxScroll = Math.max(maxScroll, Math.round((scrollTop / docHeight) * 100));
                }
            }, { passive: true });
            
            // Track time on page when leaving
            window.addEventListener('beforeunload', function() {
                const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
                const data = {
                    path: window.location.pathname + window.location.search,
                    title: document.title,
                    time_on_page: timeOnPage,
                    scroll_depth: maxScroll
                };
                
                // Send via beacon (doesn't block page unload)
                if (navigator.sendBeacon) {
                    navigator.sendBeacon('/analytics-ping', JSON.stringify(data));
                }
            });
        })();
        </script>
    </body>
</html>

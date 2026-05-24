import { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    Search, ArrowLeft, BookOpen, Settings, Zap, Home, Mail, AlertCircle, FileText
} from "lucide-react";

export default function Results({ q, results }) {
    const [query, setQuery] = useState(q || "");
    const { auth } = usePage().props;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        router.get(`/search`, { q: query }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title={`${q ? `نتائج البحث عن ${q}` : 'بحث'} - تعريب`} />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 pb-20" dir="rtl">
                
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4">
                        
                        {/* Right: Home & Back */}
                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            <Link href="/" className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title="العودة للرئيسية">
                                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
                            </Link>
                            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-xl shadow-lg shadow-blue-900/10">
                                    <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                                </div>
                                <span className="hidden lg:block text-sm font-black text-slate-800 tracking-tight">تعريب</span>
                            </Link>
                        </div>

                        {/* Center: Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative flex items-center gap-2 group mx-2">
                            <div className="relative flex-1">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="ابحث عن المصطلح (مثلاً: array, cloud, algorithm)..."
                                    className="w-full h-10 md:h-11 pr-10 md:pr-11 pl-4 bg-slate-100 border-none rounded-2xl text-[16px] md:text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:font-medium"
                                    dir="rtl"
                                />
                                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                            </div>
                            <Button 
                                type="submit" 
                                className="h-10 md:h-11 px-4 md:px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 font-bold text-sm shrink-0 transition-all hover:scale-105 active:scale-95 hidden sm:flex"
                            >
                                بحث
                            </Button>
                        </form>
                    </div>
                </nav>

                <main className="max-w-4xl mx-auto px-4 py-6 md:py-12">
                    {/* Information Note */}
                    <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                            ملاحظة: قد تظهر بعض الأخطاء الطفيفة الناتجة عن عملية الاستخراج الآلي للنصوص من المصادر الأصلية. سيتم معالجة هذه الأخطاء وتحسين الجودة في الإصدار الثاني، ولهذا ننصح بمراجعة الصفحات في الوقت الحالي.
                        </p>
                    </div>

                     {/* Search Results */}
                     <div className="space-y-6">
                        {results && results.length > 0 ? (
                            results.map((group, gIdx) => (
                                <div key={gIdx} className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                                    
                                    {/* Accent background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />

                                    {/* English Term Header */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 relative z-10">
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight font-sans" dir="ltr">
                                                {group.display_term_en}
                                            </h2>
                                            <p className="text-slate-400 text-xs font-semibold mt-1">
                                                إجمالي التكرار: {group.total_count} • مصادر مستقلة: {group.resource_count}
                                            </p>
                                        </div>
                                        <FileText className="h-5 w-5 text-slate-400" />
                                    </div>

                                    {/* Arabic Translations List */}
                                    <div className="space-y-6 relative z-10">
                                        {group.global_stats.map((stat, sIdx) => {
                                            // Find resources that contain this translation
                                            const matchingResources = group.resources.filter(res => 
                                                res.arabic_term_details.some(det => det.arabic_term === stat.term)
                                            );
                                            
                                            return (
                                                <div key={sIdx} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 md:p-5">
                                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                        <span className="text-base md:text-lg font-black text-blue-700 bg-blue-50 px-3.5 py-1 rounded-xl border border-blue-100">
                                                            {stat.term}
                                                        </span>
                                                        <span className="text-slate-400 text-xs font-bold">
                                                            (وردت في {stat.resource_count} {stat.resource_count > 1 ? 'مصادر' : 'مصدر'})
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Source References */}
                                                    <div className="space-y-3 mr-2 border-r-2 border-slate-100 pr-4">
                                                        {matchingResources.map((res, rIdx) => {
                                                            const detail = res.arabic_term_details.find(det => det.arabic_term === stat.term);
                                                            if (!detail) return null;
                                                            
                                                            return (
                                                                <div key={rIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                                        <span className="font-extrabold text-slate-700 leading-relaxed">{res.resource_name}</span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1.5 sm:justify-end items-center mr-6 sm:mr-0">
                                                                        {detail.pages.map((page, pIdx) => (
                                                                            <a 
                                                                                key={pIdx}
                                                                                href={`/pages/${page.id}/image`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="px-2.5 py-0.5 text-xs font-bold bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-600 rounded-lg border border-slate-200 transition-all active:scale-95 shadow-sm"
                                                                            >
                                                                                ص. {page.page_number}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <AlertCircle className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-black text-slate-700 mb-2">لم نعثر على نتائج</h3>
                                <p className="text-slate-400 text-sm font-medium max-w-md mx-auto leading-relaxed">
                                    لم نجد مصطلحًا مطابقًا تمامًا لـ "{q || '...'}" في المعاجم المعتمدة حاليًا. جرب البحث عن مصطلحات تقنية أخرى مثل algorithm, database, automation.
                                </p>
                            </div>
                        )}
                     </div>

                     {/* Footer Links */}
                     <footer className="mt-20 pb-8 flex flex-col items-center justify-center gap-6">
                        <div className="flex flex-wrap items-center justify-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full py-2 px-6">
                            <Link href="/" className="h-8 px-3 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all group">
                                <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                <span>الرئيسية</span>
                            </Link>

                            <div className="w-px h-4 bg-slate-200"></div>
                            <a href="/#contact" className="h-8 px-3 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all group">
                                <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                <span>تواصل معنا</span>
                            </a>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                             <span>تعريب © 2026</span>
                             <span>•</span>
                             <span>جميع الحقوق محفوظة</span>
                        </div>
                     </footer>
                </main>
            </div>
        </>
    );
}

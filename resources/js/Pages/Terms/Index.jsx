import { useState, useEffect } from "react";
import { Head, router, Link, usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Search,
    FileText,
    BookOpen,
    Trophy,
    Star,
    Upload,
    Eye,
    Layers,
    User,
    Settings,
    LogOut,
    ArrowLeft,
    Database,
    Sparkles,
} from "lucide-react";
import { useLanguage } from "@/Contexts/LanguageContext";
import TermStatsModal from "@/Components/TermStatsModal";

export default function Index({ groupedTerms = [], filters }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState(filters.search || "");
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { auth } = usePage().props;

    // Debounced search live update
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                "/classic",
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleTermClick = (termGroup) => {
        setSelectedTerm(termGroup);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title="البحث التقليدي | تعريب" />

            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 pb-20 overflow-x-hidden" dir="rtl">
                
                {/* Fixed Header / Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                        
                        {/* Logo and Back Link */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link href="/" className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title="العودة للرئيسية">
                                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
                            </Link>
                            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                                    <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                                </div>
                                <span className="text-sm font-black text-slate-800 tracking-tight">تعريب</span>
                            </Link>
                            <span className="hidden sm:inline bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-200">
                                البحث التقليدي
                            </span>
                        </div>

                        {/* Middle: Stats / Navigation Links */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/leaderboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Trophy className="h-3.5 w-3.5" />
                                <span>لوحة المساهمين</span>
                            </Link>
                            <Link href="/check" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Eye className="h-3.5 w-3.5" />
                                <span>تدقيق المصطلحات</span>
                            </Link>
                            <Link href="/upload" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Upload className="h-3.5 w-3.5" />
                                <span>رفع المستندات</span>
                            </Link>
                        </div>

                        {/* Left: User Profile & Settings */}
                        <div className="flex items-center gap-2.5">
                            {auth.user ? (
                                <>
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                        <div className="bg-blue-600 text-white rounded-lg p-0.5">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span className="text-blue-700 text-xs font-bold">{auth.user.name}</span>
                                    </div>
                                    <Link href={route('settings.edit')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="الإعدادات">
                                        <Settings className="h-4 w-4" />
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="تسجيل الخروج">
                                        <LogOut className="h-4 w-4" />
                                    </Link>
                                </>
                            ) : (
                                <Link href="/" className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200">
                                    <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                                    <span>جرب البحث بالذكاء</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header Details */}
                    <div className="mb-8 text-right">
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                            البحث المعجمي التقليدي
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base font-medium">
                            ابحث مباشرة في قاعدة بيانات المعاجم والكتب المعتمدة دون تدخل الذكاء الاصطناعي.
                        </p>
                    </div>

                    {/* Search Input Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xl shadow-slate-900/5 mb-8">
                        <div className="relative max-w-2xl">
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-350 h-5 w-5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="ابحث عن مصطلح بالإنجليزية أو العربية (مثلاً: compiler, array)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 pr-12 pl-4 bg-slate-50 border border-slate-200 rounded-2xl text-[16px] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                dir="rtl"
                            />
                        </div>
                        {search && (
                            <p className="mt-3 text-xs font-bold text-slate-400">
                                تم العثور على {groupedTerms.length} مصطلح فريد مطابق
                            </p>
                        )}
                    </div>

                    {/* Results Section */}
                    {!search ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
                            <Database className="mx-auto h-16 w-16 text-blue-100 mb-4 stroke-[1.5]" />
                            <h3 className="text-lg font-bold text-slate-700 mb-1">ابدأ البحث الآن</h3>
                            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                                اكتب المصطلح الذي تبحث عنه في المربع أعلاه لعرض الترجمات والكتب التي ورد فيها.
                            </p>
                        </div>
                    ) : groupedTerms.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
                            <FileText className="mx-auto h-16 w-16 text-slate-200 mb-4 stroke-[1.5]" />
                            <h3 className="text-lg font-bold text-slate-700 mb-1">لم نجد نتائج مطابقة</h3>
                            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                                تأكد من كتابة المصطلح بشكل صحيح أو جرب البحث عن كلمة أخرى.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {groupedTerms.map((termGroup, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-250/70 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
                                    onClick={() => handleTermClick(termGroup)}
                                >
                                    <div>
                                        {/* Term english name */}
                                        <div className="flex items-start justify-between gap-2 mb-2.5">
                                            <span className="font-mono font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                                                {termGroup.display_term_en || "N/A"}
                                            </span>
                                        </div>
                                        {/* Arabic translation */}
                                        <div className="text-xl font-black text-slate-900 font-arabic mb-4 text-right" dir="rtl">
                                            {termGroup.display_term_ar || "N/A"}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        {/* Badges row */}
                                        <div className="flex flex-wrap gap-1.5">
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
                                                <Layers className="h-3 w-3 ml-1 text-blue-500" />
                                                <span>{termGroup.total_count} تكرار</span>
                                            </Badge>
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
                                                <BookOpen className="h-3 w-3 ml-1 text-indigo-500" />
                                                <span>{termGroup.resource_count} كتب</span>
                                            </Badge>
                                            {termGroup.variations.length > 1 && (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
                                                    <span>{termGroup.variations.length} تنوعات</span>
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Top Resources Details */}
                                        <div className="text-xs text-slate-500 space-y-1">
                                            <div className="font-bold text-slate-400 mb-1 text-[11px] uppercase tracking-wider">
                                                أهم الكتب والمصادر:
                                            </div>
                                            {termGroup.resources.slice(0, 2).map((res, ridx) => (
                                                <div key={ridx} className="flex justify-between items-center text-slate-600 font-medium">
                                                    <span className="truncate max-w-[180px]">{res.resource_name}</span>
                                                    <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                                        {res.count}x
                                                    </span>
                                                </div>
                                            ))}
                                            {termGroup.resources.length > 2 && (
                                                <div className="text-slate-400 font-bold text-[10px] italic">
                                                    + {termGroup.resources.length - 2} مصادر أخرى
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end text-xs font-bold text-blue-600 pt-2 border-t border-slate-50/50 group-hover:translate-x-[-4px] transition-transform">
                                            <span>تفاصيل ومواقع الكلمة</span>
                                            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Term Statistics Modal */}
            <TermStatsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                termGroup={selectedTerm}
            />
        </>
    );
}

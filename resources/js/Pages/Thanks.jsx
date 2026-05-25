import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Heart, Star, User } from "lucide-react";

export default function Thanks() {
    // Placeholder data - The user can easily edit these arrays or provide the names
    const sponsors = [
        "اسم الراعي أو المؤسسة 1",
        "اسم الراعي أو المؤسسة 2",
        "اسم الراعي أو المؤسسة 3",
    ];

    const contributors = [
        "أحمد محمد",
        "سارة عبدالله",
        "خالد حسن",
        "فاطمة علي",
        "عمر محمود",
        "مريم يوسف",
    ];

    return (
        <>
            <Head title="شكر وتقدير | تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 pb-20" dir="rtl">
                
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
                    <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                                <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight">تعريب</span>
                        </Link>
                        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                            <span>العودة للرئيسية</span>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </div>
                </nav>

                <main className="pt-32 pb-24 px-4">
                    <div className="container mx-auto max-w-4xl space-y-12">
                        
                        {/* Header Section */}
                        <div className="text-center space-y-6 max-w-2xl mx-auto">
                            <div className="flex justify-center">
                                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-3xl shadow-xl shadow-rose-500/20">
                                    <Heart className="h-8 w-8 text-white fill-white/20" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                شكر و<span className="text-rose-600">تقدير</span>
                            </h1>
                            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                                لم يكن لهذا المشروع أن يرى النور ويستمر لولا فضل الله أولاً، ثم دعمكم السخي. لا يسعنا إتمام هذه المسيرة بدون مساندتكم، فشكراً من القلب لكل من ساهم بالدعم المادي، المعنوي، أو بوقته وجهده.
                            </p>
                        </div>

                        {/* Sponsors Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-50/80 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                                        <Star className="h-6 w-6 fill-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800">الرعاة والداعمون</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sponsors.map((name, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center text-center hover:bg-white hover:border-amber-200 hover:shadow-md transition-all">
                                            <span className="font-bold text-slate-700">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contributors Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/80 blur-[80px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800">المساهمون والأصدقاء</h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {contributors.map((name, idx) => (
                                        <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-xl py-3 px-4 text-center hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                            <span className="font-bold text-slate-600 text-sm md:text-base">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}

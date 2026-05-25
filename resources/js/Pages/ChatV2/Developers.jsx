import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Check, Mail } from "lucide-react";

export default function Developers() {
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [copiedJs, setCopiedJs] = useState(false);
    const [apiUrl, setApiUrl] = useState("https://taarib.org/api/v1/search");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiUrl(`${window.location.origin}/api/v1/search`);
        }
    }, []);

    const handleCopy = (text, setCopied) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const curlCode = `curl -X GET "${apiUrl}?q=algorithm" -H "Accept: application/json"`;
    const jsCode = `fetch("${apiUrl}?q=algorithm", {
  headers: { 'Accept': 'application/json' }
})
.then(res => res.json())
.then(data => console.log(data));`;

    const responseCode = `{
  "data": [
    {
      "display_term_en": "algorithm",
      "display_term_ar": "خوارزمية",
      "normalized_term_en": "algorithm",
      "normalized_term_ar": "خوارزمية",
      "total_count": 5,
      "resource_count": 2,
      "global_stats": [
        {
          "term": "خوارزمية",
          "total_count": 5,
          "resource_count": 2
        }
      ]
    }
  ],
  "count": 1
}`;

    return (
        <>
            <Head title="بوابة المطورين (API) | تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900" dir="rtl">
                
                {/* Fixed Header Navbar (Consistent with Changelog & Landing) */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
                    <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg px-4 h-14 flex items-center justify-between pointer-events-auto">
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
                    <div className="container mx-auto max-w-3xl space-y-8">
                        
                        {/* Title Header */}
                        <div className="text-right mb-10 space-y-2" dir="rtl">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                واجهة البرمجة <span className="text-blue-600">المفتوحة</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-medium">
                                واجهة API مجانية للبحث في المعجم التقني الموحد دون الحاجة لمصادقة أو مفتاح مرور.
                            </p>
                        </div>

                        {/* Main Cards Content */}
                        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-sm space-y-8 text-right" dir="rtl">
                            
                            {/* Endpoint */}
                            <div className="space-y-3">
                                <h2 className="text-base font-bold text-slate-800">نقطة النهاية (Endpoint)</h2>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 font-mono text-xs select-all" dir="ltr">
                                    <div className="flex items-center gap-2 overflow-x-auto text-slate-700 py-1 flex-1 scrollbar-none text-left">
                                        <span className="text-emerald-600 font-bold">GET</span>
                                        <span>{apiUrl}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(`${apiUrl}?q=algorithm`, setCopiedUrl)}
                                        className={`p-2 rounded-xl border transition-all shrink-0 ${
                                            copiedUrl 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                                : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200 shadow-sm'
                                        }`}
                                    >
                                        {copiedUrl ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Parameters */}
                            <div className="space-y-3">
                                <h2 className="text-base font-bold text-slate-800">المعاملات (Parameters)</h2>
                                <div className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs sm:text-sm">
                                    <div className="bg-slate-50 p-4 sm:px-6 border-b border-slate-200 grid grid-cols-5 gap-4 font-bold text-slate-700">
                                        <div>المعامل</div>
                                        <div>النوع</div>
                                        <div>الحالة</div>
                                        <div className="col-span-2">الوصف</div>
                                    </div>
                                    <div className="p-4 sm:px-6 grid grid-cols-5 gap-4 items-center">
                                        <div className="font-mono font-bold text-blue-600">q</div>
                                        <div className="font-mono text-slate-500">string</div>
                                        <div className="text-amber-600 font-bold">مطلوب</div>
                                        <div className="col-span-2 text-slate-600 font-medium leading-relaxed">الكلمة أو العبارة (إنجليزية أو عربية) المراد البحث عنها.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Examples */}
                            <div className="space-y-6">
                                <h2 className="text-base font-bold text-slate-800">أمثلة برمجية (Examples)</h2>

                                {/* cURL */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                        <span>مثال cURL</span>
                                        <button onClick={() => handleCopy(curlCode, setCopiedCurl)} className="hover:text-slate-800 flex items-center gap-1.5 font-medium transition-colors">
                                            {copiedCurl ? <><Check className="h-3.5 w-3.5 text-emerald-600" /> تم النسخ</> : <><Copy className="h-3.5 w-3.5" /> نسخ</>}
                                        </button>
                                    </div>
                                    <pre dir="ltr" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-[11px] text-left text-slate-700 overflow-x-auto select-text leading-relaxed">
                                        {curlCode}
                                    </pre>
                                </div>

                                {/* JS */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                        <span>مثال JavaScript (Fetch)</span>
                                        <button onClick={() => handleCopy(jsCode, setCopiedJs)} className="hover:text-slate-800 flex items-center gap-1.5 font-medium transition-colors">
                                            {copiedJs ? <><Check className="h-3.5 w-3.5 text-emerald-600" /> تم النسخ</> : <><Copy className="h-3.5 w-3.5" /> نسخ</>}
                                        </button>
                                    </div>
                                    <pre dir="ltr" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-[11px] text-left text-slate-700 overflow-x-auto select-text leading-relaxed">
                                        {jsCode}
                                    </pre>
                                </div>

                                {/* Response */}
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500">مثال الاستجابة (JSON Response)</div>
                                    <pre dir="ltr" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-[11px] text-left text-slate-700 overflow-x-auto select-text leading-relaxed">
                                        {responseCode}
                                    </pre>
                                </div>
                            </div>

                            {/* Additional Specs */}
                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500 font-medium leading-relaxed">
                                <div>• **الحد الأقصى للاستعمال (Rate Limit):** 60 طلباً في الدقيقة لكل عنوان IP.</div>
                                <div>• **مشاركة الموارد (CORS):** مفعل ومتاح لجميع النطاقات عبر الويب.</div>
                            </div>

                        </div>

                    </div>
                </main>

                {/* Footer Section */}
                <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/50 relative overflow-hidden" dir="rtl">
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2 mix-blend-screen" />

                    <div className="container mx-auto px-6 py-16 md:py-20 max-w-6xl relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 bg-transparent">
                            
                            {/* Brand Column */}
                            <div className="md:col-span-5 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20 ring-1 ring-white/10">
                                        <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain brightness-0 invert" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-white tracking-tight">تعريب</h3>
                                        <p className="text-[11px] text-blue-400 font-bold tracking-widest uppercase opacity-90 text-right">مبادرة لتوحيد المصطلحات</p>
                                    </div>
                                </div>
                                <p className="text-slate-400/90 text-base leading-relaxed font-medium max-w-md">
                                    مشروع بحثي مفتوح المصدر يسعى لسد الفجوة بين التوحيد المصطلحي والقبولية الاستعمالية في حقل المعلوماتية العربية.
                                </p>
                            </div>

                            {/* Links Column */}
                            <div className="md:col-span-3 md:col-start-7 space-y-6">
                                <h4 className="font-bold text-white text-lg">روابط سريعة</h4>
                                <ul className="space-y-3">
                                    {[
                                        { label: "الأسئلة الشائعة", href: "/#faq" },
                                        { label: "بوابة المطورين", href: route('developers'), isRoute: true },
                                        { label: "تواصل معنا", href: "/#contact" },
                                    ].map((link, i) => (
                                        <li key={i}>
                                            {link.isRoute ? (
                                                <Link href={link.href} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                                                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                                </Link>
                                            ) : (
                                                <a href={link.href} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                                                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="md:col-span-3 space-y-4">
                                <h4 className="font-bold text-white text-lg">تواصل معنا</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    نسعد باستقبال استفساراتكم ومقترحاتكم لتطوير هذا المشروع.
                                </p>
                                <a href="/#contact" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors border border-slate-700 w-full sm:w-auto">
                                    <Mail className="w-4 h-4" />
                                    اتصل بنا
                                </a>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-10 opacity-70" />

                        {/* Bottom Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                            <p className="flex items-center gap-1.5">
                                <span>© 2026 تعريب.</span>
                                <span className="hidden sm:inline text-slate-700">|</span>
                                <span>جميع الحقوق محفوظة.</span>
                            </p>
                            <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                                <span>صُنع بـ</span>
                                <span className="text-red-500 animate-pulse">❤️</span>
                                <span>من أجل اللغة العربية</span>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}

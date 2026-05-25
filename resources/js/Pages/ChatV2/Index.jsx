import { useState, useRef, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { 
    Send, Bot, User, Loader2, Search,
    FileText, ArrowLeft, Database,
    BarChart3, Zap, LogOut, TrendingUp, BookOpen, CheckCircle2,
    AlertTriangle, Mail, ShieldAlert, Quote, ExternalLink, Play, Users,
    Rocket, Target, Calendar, Building2, Settings
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ContactForm from "@/Components/ContactForm";

const SHOWCASE = [
    {
        en: "query",
        short: "\u0627\u0633\u062a\u0639\u0644\u0627\u0645",
        full: `\u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0628\u062d\u062b\u060c \u0627\u0644\u0645\u0635\u0637\u0644\u062d \u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0633\u062a\u0639\u0645\u0627\u0644\u0627\u064b \u0644\u0640 "query" \u0647\u0648 **\u0627\u0633\u062a\u0639\u0644\u0627\u0645** — \u0638\u0647\u0631 3 \u0645\u0631\u0627\u062a \u0645\u0646 \u0623\u0635\u0644 4 \u0641\u064a \u0645\u0635\u062f\u0631\u064a\u0646 (\u0627\u0644\u062c\u0632\u0627\u0626\u0631 \u0648\u0627\u0644\u0645\u063a\u0631\u0628). \u0627\u0644\u0628\u062f\u064a\u0644: **\u0627\u0633\u062a\u0641\u0633\u0627\u0631** (\u0633\u0648\u0631\u064a\u0627 \u2014 \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629).`
    },
    {
        en: "automation",
        short: "\u0623\u062a\u0645\u062a\u0629",
        full: `**\u0623\u062a\u0645\u062a\u0629** \u0647\u0648 \u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0633\u062a\u0639\u0645\u0627\u0644\u0627\u064b \u2014 4 \u0645\u0631\u0627\u062a \u0641\u064a 3 \u0645\u0635\u0627\u062f\u0631 (\u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629\u060c \u0633\u0648\u0631\u064a\u0627). \u0627\u0644\u0628\u062f\u064a\u0644: **\u062a\u0634\u063a\u064a\u0644 \u0623\u0648\u062a\u0648\u0645\u0627\u062a\u064a (\u0623\u0648\u062a\u0645\u0629)** \u2014 \u0645\u0635\u0631 2012 \u0641\u0642\u0637.`
    },
    {
        en: "per default",
        short: "\u0644\u0645 \u064a\u062c\u062f",
        full: `\u0644\u0645 \u064a\u064f\u0639\u062b\u0631 \u0639\u0644\u0649 \u0623\u064a \u0646\u062a\u064a\u062c\u0629 \u0645\u0637\u0627\u0628\u0642\u0629 \u062a\u0645\u0627\u0645\u0627\u064b \u0644\u0640 "per default" \u0641\u064a \u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a. \u0627\u0644\u062a\u0639\u0628\u064a\u0631\u0627\u062a \u0627\u0644\u0645\u062d\u062a\u0645\u0644\u0629: **\u0628\u0634\u0643\u0644 \u0627\u0641\u062a\u0631\u0627\u0636\u064a** \u00b7 **\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0627\u064b** \u00b7 **\u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b**.`
    },
    {
        en: "client",
        short: "\u0632\u0628\u0648\u0646",
        full: `**\u0632\u0628\u0648\u0646** \u0647\u0648 \u0627\u0644\u062a\u0631\u062c\u0645\u0629 \u0627\u0644\u0648\u062d\u064a\u062f\u0629 \u0641\u064a \u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u2014 \u0638\u0647\u0631 5 \u0645\u0631\u0627\u062a \u0641\u064a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0633\u0648\u0631\u064a\u0629 2017 \u0641\u064a \u0633\u064a\u0627\u0642\u0627\u062a \u0645\u062e\u062a\u0644\u0641\u0629 (BitTorrent client\u060c chat client\u060c client application...).`
    },
    {
        en: "code",
        short: "\u0634\u0641\u0631\u0629",
        full: `\u062a\u0639\u0627\u062f\u0644 \u062b\u0644\u0627\u062b\u0629 \u0645\u0635\u0637\u0644\u062d\u0627\u062a: **\u0634\u0641\u0631\u0629** (\u0633\u0648\u0631\u064a\u0627 2017) \u00b7 **\u0631\u0645\u0632** (\u0645\u0635\u0631 2012) \u00b7 **\u0643\u0648\u062f** (\u0645\u0635\u0631 2012). \u0627\u0644\u062a\u0648\u0635\u064a\u0629: **\u0634\u0641\u0631\u0629** \u0644\u0643\u0648\u0646\u0647\u0627 \u0639\u0631\u0628\u064a\u0629 \u0623\u0635\u064a\u0644\u0629 \u0648\u0645\u0633\u062a\u062e\u062f\u0645\u0629 \u0641\u064a \u0645\u0635\u062f\u0631 \u062d\u062f\u064a\u062b (2017) \u0628\u062a\u0643\u0631\u0627\u0631 \u0623\u0639\u0644\u0649.`
    },
    {
        en: "configuration",
        short: "\u062a\u0634\u0643\u064a\u0644",
        full: `\u062a\u0646\u0648\u0639 \u0643\u0628\u064a\u0631 \u0628\u064a\u0646 \u0627\u0644\u062f\u0648\u0644: **\u062a\u0634\u0643\u064a\u0644** (\u0633\u0648\u0631\u064a\u0627) \u00b7 **\u062a\u0634\u0643\u064a\u0644\u0629** (\u0627\u0644\u062c\u0632\u0627\u0626\u0631) \u00b7 **\u062a\u0631\u0643\u064a\u0628\u0629 \u0627\u0644\u062d\u0627\u0633\u0648\u0628** (\u0645\u0635\u0631) \u00b7 **\u062a\u0647\u064a\u0626\u0629** (\u0627\u0644\u0645\u063a\u0631\u0628). \u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0633\u062a\u0639\u0645\u0627\u0644\u0627\u064b: **\u062a\u0634\u0643\u064a\u0644** (\u0628\u0635\u064a\u063a\u062a\u064a\u0647 \u0645\u0639\u0627\u064b).`
    },
    {
        en: "font",
        short: "\u062e\u0637",
        full: `**\u062e\u0637** \u0647\u0648 \u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0646\u062a\u0634\u0627\u0631\u0627\u064b \u2014 \u0638\u0647\u0631 \u0641\u064a 3 \u0645\u0635\u0627\u062f\u0631 (\u0633\u0648\u0631\u064a\u0627 2017\u060c \u0645\u0635\u0631 2012\u060c \u0627\u0644\u0645\u063a\u0631\u0628 2000). \u0627\u0644\u0628\u062f\u0627\u0626\u0644: \u0645\u062d\u0631\u0641 \u00b7 \u0646\u0645\u0637 \u062e\u0637 \u00b7 \u0646\u0645\u0637 \u0637\u0628\u0627\u0639\u064a (كلها \u0641\u064a \u0627\u0644\u0645\u0635\u062f\u0631 \u0627\u0644\u0645\u0635\u0631\u064a \u0641\u0642\u0637).`
    },
    {
        en: "file",
        short: "\u0645\u0644\u0641",
        full: `**\u0645\u0644\u0641** \u0645\u062a\u0641\u0642 \u0639\u0644\u064a\u0647 \u0641\u064a 3 \u0645\u0635\u0627\u062f\u0631 (\u0633\u0648\u0631\u064a\u0627\u060c \u0645\u0635\u0631\u060c \u0627\u0644\u0645\u063a\u0631\u0628). \u0627\u0644\u0628\u062f\u0627\u0626\u0644 \u0641\u064a \u0627\u0644\u0645\u0635\u062f\u0631 \u0627\u0644\u0645\u0635\u0631\u064a: \u0645\u0633\u062a\u0646\u062f \u00b7 \u0633\u062c\u0644 \u00b7 \u0645\u062c\u0644\u062f \u00b7 \u0645\u0636\u0628\u0637\u0629.`
    },
    {
        en: "tester",
        short: "\u0645\u062e\u062a\u0628\u0631",
        full: `**\u0645\u062e\u062a\u0628\u0631** \u0638\u0647\u0631 \u0641\u064a \u0645\u0635\u062f\u0631\u064a\u0646 (\u0633\u0648\u0631\u064a\u0627 2017\u060c \u0645\u0635\u0631 2012). \u0627\u0644\u0645\u0635\u0637\u0644\u062d\u0627\u062a \u0627\u0644\u0645\u0631\u0643\u0628\u0629 \u0643\u0644\u0647\u0627 \u0645\u0634\u062a\u0642\u0629 \u0645\u0646\u0647 (\u0645\u062e\u062a\u0628\u0631 \u0628\u0631\u0645\u062c\u064a\u0627\u062a\u060c \u0645\u062e\u062a\u0628\u0631 \u0623\u0645\u0646...).`
    },
    {
        en: "array",
        short: "\u0645\u0635\u0641\u0648\u0641\u0629",
        full: `**\u0645\u0635\u0641\u0648\u0641\u0629** \u0647\u0648 \u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0646\u062a\u0634\u0627\u0631\u0627\u064b \u2014 3 \u0645\u0635\u0627\u062f\u0631 (\u0633\u0648\u0631\u064a\u0627\u060c \u0645\u0635\u0631\u060c \u0627\u0644\u0645\u063a\u0631\u0628). \u0627\u0644\u0628\u062f\u0627\u0626\u0644 \u0641\u064a \u0627\u0644\u0645\u0635\u062f\u0631 \u0627\u0644\u0645\u0635\u0631\u064a: \u062c\u062f\u0648\u0644 \u00b7 \u0645\u062c\u0645\u0648\u0639\u0629 \u00b7 \u062a\u0631\u062a\u064a\u0628 \u00b7 \u0635\u0641\u064a\u0641.`
    },
];

function ShowcaseTable() {
    const [open, setOpen] = useState(null);
    return (
        <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_auto_auto] bg-slate-50 border-b border-slate-100 px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>المصطلح الإنجليزي</span>
                <span className="text-center px-6">بإختصار</span>
                <span className="w-8" />
            </div>
            {SHOWCASE.map((row, i) => (
                <div key={i} className="border-b border-slate-100 last:border-0">
                    {/* Clickable row */}
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full grid grid-cols-[1fr_auto_auto] items-center px-5 py-4 bg-white hover:bg-blue-50/40 transition-colors text-right group"
                    >
                        <span className="font-mono font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">{row.en}</span>
                        <span className="px-6">
                            <span className="bg-blue-50 text-blue-700 font-black text-sm px-3 py-1 rounded-full border border-blue-100">{row.short}</span>
                        </span>
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${open === i ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </button>
                    {/* Expanded full answer */}
                    {open === i && (
                        <div className="px-5 pb-5 bg-slate-50 border-t border-slate-100">
                            <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-5 text-sm text-slate-600 leading-relaxed font-medium prose prose-sm prose-slate max-w-none text-right" dir="rtl">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}
                                    components={{
                                        strong: ({node, ...props}) => <strong className="text-blue-700 font-black" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-0" {...props} />,
                                    }}
                                >{row.full}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function FAQAccordion() {
    const [open, setOpen] = useState(null);
    const faqs = [
        {
            q: "ما هي المراجع أو الكتب المعتمدة في قاعدة البيانات؟",
            a: "بما أننا في المرحلة الأولى من المشروع، ولضمان أقصى درجات الدقة والموثوقية لقاعدة البيانات، فإننا نعتمد حالياً فقط على المعاجم المعتمدة والصادرة عن مجامع اللغة العربية والجهات الرسمية.\n\nيمكنك الاطلاع على القائمة الكاملة للمراجع المستخدمة وتحميلها عبر مستودعنا المفتوح على منصة جيت هاب من خلال هذا الرابط:\n [مستودع المراجع (HassanDev13/terminology-books)](https://github.com/HassanDev13/terminology-books)."
        },
        {
            q: "لماذا يقتصر نطاق المشروع حالياً على مجال المعلوماتية والتقنية؟",
            a: "في هذه المرحلة التأسيسية للمشروع، اخترنا التركيز بشكل كامل على حقل المعلوماتية نظراً للتسارع الهائل في إنتاج التقنية، والحاجة الماسة لتوحيد وضبط المصطلحات البرمجية والتقنية المعاصرة. نحن نعمل على إرساء نموذج صلب وخوارزميات دقيقة في هذا التخصص ليكون نواة أساسية، وبحول الله تعالى سنعمل مستقبلاً على التوسع وضم مجالات وتخصصات علمية وطبية وهندسية أخرى لتكوين مرجعية معجمية عربية شاملة."
        },
        {
            q: "كيف يتم تحديد 'المصطلح الأكثر استعمالاً'؟",
            a: "يقوم نظامنا بإحصاء تكرار كل ترجمة عبر المراجع المعتمدة، ويُرجِّح المصطلح الذي ورد في أكبر عدد من المصادر المستقلة (وليس عدد مرات التكرار الكلي)، مما يعطي مؤشراً حقيقياً حول الإجماع الفعلي على المصطلح بدلاً من تنظير فردي أو مؤسساتي.\n\nتعتمد هذه المنهجية المتقدمة في تحديد المقبولية والاستعمال على نماذج الذكاء الاصطناعي، وهي أدوات متاحة حالياً بشكل حصري لمجامع اللغة العربية والباحثين الأكاديميين."
        },
        {
            q: "هل نتائج البحث دقيقة وموثوقة بنسبة 100%؟",
            a: "يتم استخراج النتائج آلياً من المراجع المعتمدة. ورغم الدقة العالية التي يوفرها النظام، فإننا ننوه دائماً باحتمالية وجود أخطاء في الاستخراج الآلي أو انحرافات بسبب سياق الكلمة، وندعو لمراجعة الصفحة وتدقيق المصدر الموثق في حال الشك."
        },
        {
            q: "كيف يمكنني المساهمة في تطوير هذا المشروع؟",
            a: "نرحب دوماً بمساهمات المجتمع اللغوي والتقني! يمكنك مشاركة اقتراحاتك حول مصطلحات جديدة، أو الإبلاغ عن أخطاء عبر نموذج التواصل أسفله. كما يمكنك زيارة المستودع والمساهمة في إضافة مراجع تقنية معتمدة جديدة ليتم ضمها لقاعدة البيانات."
        }
    ];

    return (
        <div className="space-y-4 font-arabic" dir="rtl">
            {faqs.map((faq, i) => (
                <div key={i} className={`bg-white rounded-2xl border ${open === i ? 'border-blue-200 shadow-md ring-2 ring-blue-50' : 'border-slate-100 shadow-sm'} overflow-hidden hover:border-blue-200 transition-all duration-300`}>
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full text-right px-6 py-5 flex items-center justify-between gap-4 group"
                    >
                        <h4 className={`font-bold transition-colors ${open === i ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'}`}>{faq.q}</h4>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${open === i ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </button>
                    {open === i && (
                        <div className="px-6 pb-6 text-slate-600 text-sm md:text-base leading-loose border-t border-slate-50/70 pt-4 prose prose-sm prose-slate max-w-none text-right animate-in fade-in slide-in-from-top-2 duration-300">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({node, ...props}) => <a className="text-blue-600 font-bold hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                    p: ({node, ...props}) => <p className="mb-0 leading-relaxed" {...props} />
                                }}
                            >{faq.a}</ReactMarkdown>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function LandingSearchPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth, stats } = usePage().props;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
        script.async = true;
        
        script.onload = () => {
            if (window.kofiWidgetOverlay) {
                window.kofiWidgetOverlay.draw('hacene', {
                    'type': 'floating-chat',
                    'floating-chat.donateButton.text': 'ادعمنا',
                    'floating-chat.donateButton.background-color': '#4f46e5', // Matches the theme perfectly
                    'floating-chat.donateButton.text-color': '#fff'
                });
            }
        };

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            const kofiElements = document.querySelectorAll('iframe[src*="ko-fi"], [id^="kofi-"]');
            kofiElements.forEach(el => el.remove());
        };
    }, []);

    const handleSearch = (e, customQuery = null) => {
        if (e) e.preventDefault();
        
        const textToSearch = customQuery || query;
        if (!textToSearch.trim()) return;

        setLoading(true);
        router.visit(route('search.results', { q: textToSearch }));
    };



    return (
        <>
            <Head title="تعريب | توحيد المصطلحات المعلوماتية" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden" dir="rtl">
                
                {/* Fixed Header */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
                    <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-900/5 px-4 h-14 flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                                <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight">تعريب</span>
                        </div>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-1">
                            {auth?.user && (
                                <Link href={route('chat.index')} className="relative px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors rounded-xl bg-blue-50/50 hover:bg-blue-100 border border-blue-100">
                                    بحث بالذكاء الاصطناعي
                                </Link>
                            )}
                            <a href="#faq" className="relative px-4 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50">
                                الأسئلة الشائعة
                            </a>
                            <Link href={route('developers')} className="relative px-4 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50">
                                للمطورين
                            </Link>
                            <Link href={route('contact')} className="relative px-4 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50">
                                للمجامع اللغوية
                            </Link>
                            <a href="#contact" className="relative px-4 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50">
                                تواصل معنا
                            </a>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(o => !o)}
                            className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors gap-1.5"
                            aria-label="القائمة"
                        >
                            <span className={`block w-4.5 h-0.5 bg-slate-600 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{width:'18px'}} />
                            <span className={`block h-0.5 bg-slate-600 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} style={{width:'14px'}} />
                            <span className={`block h-0.5 bg-slate-600 rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{width:'18px'}} />
                        </button>
                    </div>

                    {/* Mobile dropdown */}
                    {mobileMenuOpen && (
                        <div className="absolute top-[72px] left-4 right-4 max-w-4xl mx-auto bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden">
                            <div className="p-2 space-y-0.5">
                                {auth?.user && (
                                    <Link
                                        href={route('chat.index')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-700 bg-blue-50/50 font-bold text-sm hover:bg-blue-100 hover:text-blue-800 transition-colors border border-blue-100"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        بحث بالذكاء الاصطناعي
                                    </Link>
                                )}
                                <a
                                    href="#faq"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    الأسئلة الشائعة
                                </a>
                                <Link
                                    href={route('developers')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    للمطورين
                                </Link>
                                <Link
                                    href={route('contact')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    للمجامع اللغوية
                                </Link>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    تواصل معنا
                                </a>

                                {/* <Link
                                    href={route('award')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-sm hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    جائزة يوغرطة
                                </Link> */}

                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <header className="relative pt-28 md:pt-40 pb-10 md:pb-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-100/50 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-50/50 blur-[100px] rounded-full" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="space-y-5 mb-8">
                            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.2] md:leading-[1.1]">
                                توحيد المصطلحات <br />
                                <span className="text-blue-600">بمنهجية الأكثر استعمالاً</span>
                            </h2>
                            <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-2">
                                معجم عربي ذكي يقوم على قياس المقبولية والاستعمال الواقعي، بدلاً من التوحيد النظري الجامد.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSearch} className="relative">
                                {/* Mobile: stacked layout */}
                                <div className="flex flex-col sm:hidden gap-2">
                                    <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-xl">
                                        <Search className="h-5 w-5 text-slate-300 shrink-0 ml-2" />
                                        <input
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="ابحث عن مصطلح..."
                                            className="flex-1 bg-transparent border-none outline-none text-base py-1 px-2 text-right font-arabic placeholder:text-slate-300"
                                            dir="rtl"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={!query.trim() || loading}
                                        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-black text-base"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "بحث"}
                                    </Button>
                                </div>
                                {/* Desktop: inline layout */}
                                <div className="hidden sm:flex items-center bg-white rounded-[2.5rem] border border-slate-200 p-2.5 shadow-2xl shadow-blue-900/5 ring-1 ring-slate-100">
                                    <div className="pr-5 text-slate-300">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="ابحث عن المصطلح (مثلاً: array, cloud, algorithm)..."
                                        className="flex-1 bg-transparent border-none outline-none text-lg py-3.5 px-3 text-right font-arabic placeholder:text-slate-300"
                                        dir="rtl"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!query.trim() || loading}
                                        className="h-14 px-7 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white shadow-xl font-black text-base"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "بحث"}
                                    </Button>
                                </div>
                            </form>

                            {/* Tags Section */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-2.5 max-w-2xl mx-auto">
                                <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest shrink-0 ml-1 w-full sm:w-auto text-center sm:text-right mb-1 sm:mb-0">مصطلحات شائعة:</span>
                                {[
                                    "algorithm", "array", "automation", "backend", "cache", "client", "cloud", "code", "compiler", 
                                    "configuration", "database", "debugging", "encryption", "file", "font", "frontend", "hardware", 
                                    "iteration", "kernel", "logic", "malware", "network", "node", "per default", "query", "router", 
                                    "server", "syntax", "tester", "variable"
                                ].map((tag, index) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleSearch(null, tag)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all active:scale-95
                                            ${index % 4 === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-300' :
                                              index % 4 === 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300' :
                                              index % 4 === 2 ? 'bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 hover:border-violet-300' :
                                              'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'}
                                        `}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Statistics Section */}
                {stats && (
                    <section className="py-12 px-8 bg-white relative z-20 -mt-10 mx-4 md:mx-auto max-w-4xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100/80 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4 backdrop-blur-xl">
                        <div className="flex flex-col items-center gap-2.5 text-center group">
                            <span className="text-4xl md:text-5xl font-black text-blue-600 tracking-tighter transition-transform group-hover:scale-110">
                                {stats.terms_count > 0 ? '+' : ''}{stats.terms_count.toLocaleString('en-US')}
                            </span>
                            <span className="text-sm md:text-base font-extrabold text-slate-500">مصطلح فريد مدمج</span>
                        </div>
                        <div className="w-full md:w-px h-px md:h-20 bg-slate-100"></div>
                        <div className="flex flex-col items-center gap-2.5 text-center group">
                            <span className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tighter transition-transform group-hover:scale-110">
                                {stats.resources_count > 0 ? '+' : ''}{stats.resources_count.toLocaleString('en-US')}
                            </span>
                            <span className="text-sm md:text-base font-extrabold text-slate-500">مصدر مرجعي معتمد</span>
                        </div>
                    </section>
                )}




                {/* FAQ Section */}
                <section id="faq" className="py-20 px-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="container mx-auto max-w-3xl">
                        <div className="text-center mb-14 space-y-3">
                            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                                الأسئلة <span className="text-blue-600">الشائعة</span>
                            </h3>
                            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
                                إجابات على أبرز التساؤلات حول مشروع تعريب والمراجع المعتمدة فيه.
                            </p>
                        </div>
                        <FAQAccordion />
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="py-20 px-4 bg-slate-50 border-b border-slate-100 overflow-hidden">
                    <div className="container mx-auto max-w-5xl">

                        {/* Header */}
                        <div className="text-center mb-14 space-y-3">
                            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                                ماذا قالوا عن <span className="text-blue-600">المشروع؟</span>
                            </h3>
                            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
                                آراء متخصصين في اللغة العربية حول هذه المبادرة.
                            </p>
                        </div>

                        {/* Card — editorial layout */}
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-[340px_1fr]">

                                {/* Left — big image panel */}
                                <div className="relative min-h-[320px] md:min-h-0">
                                    <img
                                        src="/images/mokhtar.jpg"
                                        alt="د.مختار الغوث"
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    {/* Name on image */}
                                    <div className="absolute bottom-0 right-0 left-0 p-6 text-white" dir="rtl">
                                        <p className="font-black text-xl leading-tight drop-shadow">د. مختار الغوث</p>
                                        <p className="text-white/70 text-xs font-medium mt-1">لغوي موريتاني · بروفيسور في جامعة طيبة</p>
                                        <a
                                            href="https://ar.wikipedia.org/wiki/%D9%85%D8%AE%D8%AA%D8%A7%D8%B1_%D8%A7%D9%84%D8%BA%D9%88%D8%AB"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-white/60 hover:text-white transition-colors"
                                        >
                                            <ExternalLink className="h-2.5 w-2.5" />
                                            ويكيبيديا
                                        </a>
                                    </div>
                                </div>

                                {/* Right — quote + videos */}
                                <div className="p-8 md:p-10 flex flex-col gap-8 justify-between">

                                    {/* Quote */}
                                    <div className="relative" dir="rtl">
                                        <span className="block text-[90px] leading-none text-blue-100 font-serif select-none -mb-6 -mr-2">"</span>
                                        <blockquote className="text-slate-700 text-base md:text-lg leading-loose font-medium">
                                            قرأت الأوراق وسررت بها كثيرًا، وأرجو الله أن يكتب لك التوفيق والنجاح.{" "}
                                            <mark className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md font-bold not-italic">فكرتها جميلة</mark>
                                            ، ولكنها تحتاج إلى فريق جاد ومخلص ومصابر، وإذا كتب له النجاح، فسوف تكون فيه{" "}
                                            <mark className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-bold not-italic">خدمة جليلة للعربية</mark>.
                                        </blockquote>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-100" />

                                    {/* Videos */}
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-right" dir="rtl">محاضرات مختارة</p>
                                        <div className="space-y-2">
                                            {[
                                                { title: "العودة إلى الهوية العربية", url: "https://youtu.be/MwqxPOtJJ7k" },
                                                { title: "ماذا لو ماتت اللغة العربية؟", url: "https://www.youtube.com/watch?v=PK_Ukr7ul20" },
                                                { title: "الحرب الباردة على الكينونة العربية: اللغة هوية", url: "https://www.youtube.com/watch?v=pA2nCFF5Lqc" },
                                            ].map((v, i) => (
                                                <a
                                                    key={i}
                                                    href={v.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-all group"
                                                >
                                                    <div className="bg-red-500 text-white rounded-lg p-1.5 shrink-0 group-hover:scale-110 transition-transform">
                                                        <Play className="h-3 w-3 fill-white" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors text-right flex-1" dir="rtl">{v.title}</span>
                                                    <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-red-400 transition-colors shrink-0" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Support Project - Ko-Fi Section */}
                <section id="community" className="py-20 px-4 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                    <div className="container mx-auto max-w-5xl relative z-10 text-center">
                        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-blue-900/20 overflow-hidden relative border border-white/10">
                            {/* Decorative blobs */}
                            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-400/20 blur-[60px] rounded-full mix-blend-screen pointer-events-none translate-x-1/2 translate-y-1/2" />
                            
                            <div className="relative z-10 space-y-6">
                                
                                
                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                    ادعم مشروع التعريب 
                                </h3>
                                
                                <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                                    يهدف هذا المشروع إلى سد الفجوة بين المصطلحات العلمية وقبولها الفعلي. 
                                    مساهمتك تساعدنا في تغطية تكاليف الخوادم وتطوير قواعد بيانات أوسع لحماية الهوية اللغوية في عصر التقنية.
                                </p>
                                
                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a 
                                        href="https://ko-fi.com/hacene" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-white text-slate-800 px-8 py-4 rounded-full font-black hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg w-full sm:w-auto justify-center group"
                                    >
                                        <svg className="w-6 h-6 text-[#FF5E5B] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.061-4.3-.037-.046-.045-.086-.045-.086-.154-.487-.09-1.261.343-1.611l.092-.064c.334-.207 1.055-.224 1.454.004l.033.024c.319.263 1.636 1.54 1.954 1.83.21-.212 1.604-1.503 1.928-1.78l.068-.052c.451-.274 1.258-.292 1.631-.05l.078.06c.404.372.502 1.155.305 1.625l-.039.083c-.092.148-.27.279-.27.279v-.006zm7.842 2.059c-1.077 1.07-2.736.8-2.736.8v-3.829c.854 0 2.613-.23 3.321.465.748.747.491 2.476-.585 2.564z" />
                                        </svg>
                                        <span>ادعمنا</span>
                                    </a>
                                </div>
                                <p className="text-white/70 text-sm font-medium mt-4">ندعم جميع بطاقات الدفع عبر منصة Ko-fi الآمنة</p>
                            </div>
                        </div>
                    </div>
                </section>                {/* Contact Section - Modernized & Moved */}
                <section id="contact" className="py-24 relative overflow-hidden bg-slate-50/50">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            
                            {/* Text Content */}
                            <div className="space-y-8 text-right">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        تواصل معنا
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                        لديك استفسار أو
                                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-violet-600">فكرة مميزة؟</span>
                                    </h2>
                                    <p className="text-slate-500 text-lg leading-relaxed max-w-md ml-auto">
                                        نحن هنا للاستماع. سواء كان سؤالاً حول المشروع، اقتراحاً للتحسين، أو رغبة في المساهمة، لا تتردد في مراسلتنا.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Form Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                                <div className="relative z-10">
                                    <ContactForm />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

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
                                        { label: "الأسئلة الشائعة", href: "#faq" },
                                        { label: "بوابة المطورين", href: route('developers'), isRoute: true },
                                        { label: "تواصل معنا", href: "#contact" },
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



                <style dangerouslySetInnerHTML={{ __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
                    
                    html {
                        scroll-behavior: smooth;
                    }

                    body {
                        font-family: 'Tajawal', sans-serif;
                        background-color: #f8fafc;
                    }
                    
                    .font-arabic {
                        font-family: 'Tajawal', sans-serif;
                    }

                    .prose {
                        --tw-prose-body: #475569;
                        --tw-prose-headings: #0f172a;
                    }

                    ::-webkit-scrollbar {
                        width: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #f8fafc;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                        border: 2px solid #f8fafc;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }

                    ::selection {
                        background-color: #dbeafe;
                        color: #1e40af;
                    }

                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }

                    .float-animation {
                        animation: float 4s ease-in-out infinite;
                    }
                `}} />
            </div>
        </>
    );
}

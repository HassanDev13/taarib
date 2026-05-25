
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Trophy, Heart, Target, Lightbulb, UserPlus, FileText, Gift, Share2, ExternalLink, Play, Mail, ArrowRight } from "lucide-react";

export default function Award() {
    return (
        <>
            <Head title="جائزة يوغرطة | تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden" dir="rtl">
                
                {/* Header */}
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 shadow-sm">
                    <div className="container mx-auto px-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                                <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black text-slate-800 leading-tight">تعريب</h1>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">العودة للرئيسية</p>
                            </div>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 hover:bg-slate-100 text-slate-600" onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'جائزة يوغرطة للغة العربية والحوسبة',
                                        text: 'تخليدُ أثرٍ… وبناءُ مستقبل',
                                        url: window.location.href,
                                    })
                                }
                            }}>
                                <Share2 className="h-4 w-4" /> مشاركة
                            </Button>
                            <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200" asChild>
                                <a href="#contribute">
                                    <Heart className="h-4 w-4 text-red-200" /> ادعم الصندوق
                                </a>
                            </Button>
                        </div>
                    </div>
                </nav>

                <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
                    
                    {/* Hero Section - Blue Theme */}
                    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden mb-16">
                         {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2 mix-blend-screen" />
                        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.03] bg-repeat pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 backdrop-blur-md rounded-full text-blue-100 text-xs font-bold uppercase tracking-widest shadow-inner">
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span>مبادرة مجتمعية رائدة</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                                    جائزة يوغرطة <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">للحوسبة العربية</span>
                                </h1>
                                <p className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed max-w-lg border-r-4 border-blue-400/50 pr-6 mr-1">
                                    تخليدُ أثرٍ… وبناءُ مستقبل.
                                    <br/>
                                    مبادرة تُعنى بدعم المشاريع التي تخدم اللغة العربية في مجال الحوسبة بإتقان وإحسان.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                     <Button size="lg" className="rounded-full bg-white hover:bg-blue-50 text-blue-900 font-bold px-8 h-14 text-lg shadow-xl shadow-white/5 transition-all hover:scale-105 active:scale-95" asChild>
                                        <a href="#contribute">ساهم في الجائزة</a>
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full border-blue-400/30 bg-blue-900/20 backdrop-blur-sm text-blue-100 hover:bg-blue-800/40 hover:text-white px-8 h-14 gap-2 border-2 transition-all" asChild>
                                        <a href="https://walid.dev/blog/djug/" target="_blank" rel="noopener noreferrer">
                                            من هو يوغرطة؟ <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="relative lg:h-full min-h-[300px] flex items-center justify-center lg:justify-end">
                                <div className="relative w-72 h-72 md:w-96 md:h-96 group">
                                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-700" />
                                     <div className="absolute inset-4 bg-slate-900 rounded-full z-0" />
                                    <img 
                                        src="/images/yougharta.jpg" 
                                        alt="الراحل يوغرطة بن علي" 
                                        className="w-full h-full object-cover rounded-full border-[12px] border-slate-900/80 shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute -bottom-6 -right-6 z-20 bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-xl max-w-[220px]">
                                        <p className="text-xs text-blue-200 font-bold mb-1 uppercase tracking-wider">الراحل</p>
                                        <p className="text-xl font-black text-white">يوغرطة بن علي</p>
                                        <p className="text-[10px] text-blue-100/80 mt-1 font-medium line-clamp-2">أيقونة تقنية جزائرية آمنت بالمصدر المفتوح.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                        
                        {/* About Section - Spans 8 cols */}
                        <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
                           <div className="flex items-center gap-4 mb-8">
                                <div className="bg-blue-100 p-3 rounded-2xl">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">عن الجائزة</h2>
                           </div>
                           <div className="prose prose-lg prose-slate max-w-none font-arabic leading-loose text-slate-600">
                                <p>
                                    تحمل الجائزة اسم الراحل <strong className="text-blue-700">يوغرطة بن علي</strong>، أحد أبرز الأصوات التقنية الجزائرية التي آمنت بالمحتوى الدسم، والانضباط المعرفي، واحترام اللغة العربية، والانفتاح على المصادر المفتوحة.
                                </p>
                                <blockquote className="border-r-4 border-blue-500 pr-4 my-6 bg-blue-50/50 py-4 rounded-l-xl font-bold text-slate-800 not-italic">
                                    "لا نهضة تقنية بلا لغة قوية، ولا لغة حية بلا محتوى عميق وأدوات فعالة."
                                </blockquote>
                                <p>
                                    جائزة يوغرطة ليست مجرد اسم... بل امتداد لفكرة آمنت بأن المحتوى مسؤولية، وأن التقنية رسالة، وأن اللغة هوية. لسنا بصدد إنشاء مسابقة عابرة، بل نسعى إلى بناء تقليد سنوي يُكرّم من يخدم العربية بإخلاص، ويضع معياراً للجودة في المجال التقني.
                                </p>
                           </div>
                        </div>

                        {/* Pre-funding Section - Spans 4 cols - Blue Theme */}
                         <div className="lg:col-span-4 bg-gradient-to-b from-blue-900 to-indigo-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/10 text-white flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/pattern.svg')] opacity-[0.05] pointer-events-none" />
                            
                            <h3 className="text-2xl font-black text-white mb-6 relative z-10">لماذا التمويل المسبق؟</h3>
                            <ul className="space-y-5 relative z-10 flex-1">
                                <li className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">1</div>
                                    <p className="text-blue-100 font-medium leading-snug">نواةٌ لصندوق الجائزة التأسيسي.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">2</div>
                                    <p className="text-blue-100 font-medium leading-snug">دليلٌ عملي على التزام المجتمع التقني بدعم المبادرات الجادة.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">3</div>
                                    <p className="text-blue-100 font-medium leading-snug">خطوة أولى نحو استدامة سنوية للمسابقة.</p>
                                </li>
                            </ul>
                            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                                <p className="text-sm text-blue-200 font-bold italic text-center">
                                    "نؤمن أن الجائزة لا تُبنى بالتمويل فقط، بل بالمجتمع الذي يؤمن بفكرتها."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Objectives Section */}
                    <div className="mb-24">
                         <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">أهداف الجائزة</h2>
                            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">نسعى لخلق بيئة تنافسية إيجابية تُعلي من قيمة الجودة والدقة في المحتوى العربي.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: <Target className="h-6 w-6 text-emerald-600" />, bg: "bg-emerald-50", border: "hover:border-emerald-200", title: "دعم المشاريع", desc: "دعم المشاريع التقنية التي تخدم اللغة العربية (تعريب، معالجة لغة، أدوات، منصات...)." },
                                { icon: <Share2 className="h-6 w-6 text-blue-600" />, bg: "bg-blue-50", border: "hover:border-blue-200", title: "المصادر المفتوحة", desc: "تشجيع تطوير برمجيات مفتوحة المصدر ذات أثر مستدام وجودة عالية." },
                                { icon: <FileText className="h-6 w-6 text-indigo-600" />, bg: "bg-indigo-50", border: "hover:border-indigo-200", title: "جودة المحتوى", desc: "تحفيز إنتاج محتوى تقني عربي رصين وعالي الجودة بعيداً عن السطحية." },
                                { icon: <Trophy className="h-6 w-6 text-amber-600" />, bg: "bg-amber-50", border: "hover:border-amber-200", title: "بيئة تنافسية", desc: "خلق منافسة شريفة ترفع من معايير الإنتاج التقني العربي." },
                            ].map((item, i) => (
                                <div key={i} className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ${item.border} hover:shadow-xl transition-all group`}>
                                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-3">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Categories Section - Blue Theme */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3rem] p-8 md:p-16 mb-24 relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/pattern.svg')] bg-repeat opacity-[0.1]" />
                         <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-10 flex flex-col md:flex-row md:items-center gap-4">
                                <span className="flex items-center gap-3">
                                    <Trophy className="text-yellow-300 h-8 w-8" /> 
                                    مجالات التكريم
                                </span>
                                <span className="text-sm font-bold text-blue-100 bg-white/20 px-4 py-1.5 rounded-full border border-white/20 w-fit">مبدئياً</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    "أفضل مشروع برمجي يخدم اللغة العربية.",
                                    "أفضل مبادرة تعريب مفتوحة المصدر.",
                                    "أفضل أداة تدعم الكتابة أو المعالجة اللغوية.",
                                    "أفضل محتوى تقني عربي عميق."
                                ].map((cat, i) => (
                                    <div key={i} className="bg-white/10 border border-white/10 p-6 rounded-3xl flex items-center gap-5 hover:bg-white/20 transition-colors group cursor-default">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold shrink-0 group-hover:scale-110 transition-transform">
                                            {i + 1}
                                        </div>
                                        <span className="font-bold text-white text-lg">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contribute Section */}
                    <div id="contribute" className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">كيف يمكنك المساهمة؟</h2>
                        <p className="text-slate-500 text-lg font-medium mb-12">يمكنك أن تكون جزءاً من هذا الأثر وتساهم في تخليد ذكرى يوغرطة وخدمة العربية.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-right">
                             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-300 hover:shadow-lg transition-all group">
                                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Gift className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg mb-1">مساهمة مالية</h4>
                                    <p className="text-sm text-slate-500 font-medium">مساهمة مالية رمزية لدعم صندوق الجائزة التأسيسي.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-indigo-300 hover:shadow-lg transition-all group">
                                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Share2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg mb-1">نشر المبادرة</h4>
                                    <p className="text-sm text-slate-500 font-medium">التعريف بالجائزة ورسالتها في أوساطك التقنية.</p>
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-violet-300 hover:shadow-lg transition-all group">
                                <div className="bg-violet-50 p-3 rounded-2xl text-violet-600 shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg mb-1">تطوع أو شراكة</h4>
                                    <p className="text-sm text-slate-500 font-medium">التطوع في التنظيم والتحكيم أو اقتراح شركاء داعمين.</p>
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-emerald-300 hover:shadow-lg transition-all group">
                                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Lightbulb className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg mb-1">أفكار ومقترحات</h4>
                                    <p className="text-sm text-slate-500 font-medium">شاركنا أفكارك لتطوير الجائزة وضمان استدامتها.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col items-center gap-4">
                             <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-12 h-16 text-lg shadow-2xl shadow-slate-900/20 hover:scale-105 transition-transform" asChild>
                                <a href="mailto:contact@تعريب.com">
                                    <Mail className="ml-2 h-5 w-5" /> تواصل معنا للمساهمة
                                </a>
                            </Button>
                        </div>
                    </div>

                </main>

                {/* Footer Section - Consistent with Landing Page */}
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
                                    مشروع بحثي مفتوح المصدر يسعى لسد الفجوة بين التوحيد المصطلحي والقبولية الاستعمالية في حقل المعلوماتية العربية، مدعوم بالذكاء الاصطناعي.
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
             <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
                
                body {
                    font-family: 'Tajawal', sans-serif;
                }
            `}} />
        </>
    );
}


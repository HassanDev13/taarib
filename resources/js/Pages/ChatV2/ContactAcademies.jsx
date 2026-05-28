import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Send, CheckCircle2, Building2, User, Mail, Phone, FileText, Zap } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function ContactAcademies() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const repName = e.target.name.value;
        const academyName = e.target.academy_name.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const userMessage = e.target.message.value;

        // Validation helper
        const newErrors = {};
        if (!repName.trim()) newErrors.name = ["الاسم مطلوب"];
        if (!academyName.trim()) newErrors.academy_name = ["اسم الجهة مطلوب"];
        if (!email.trim()) newErrors.email = ["البريد الإلكتروني مطلوب"];
        if (!userMessage.trim()) newErrors.message = ["الرسالة مطلوبة"];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', `${repName} (${academyName})`);
        formData.append('email', email);
        formData.append('subject', 'طلب تعاون واستخدام أدوات الذكاء الاصطناعي - مجمع لغوي / هيئة أكاديمية');
        formData.append('message', `اسم المؤسسة: ${academyName}\nرقم الهاتف/الواتساب: ${phone}\n\nالرسالة:\n${userMessage}`);

        try {
            const getCsrfToken = () => {
                return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            };

            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (response.ok) {
                setSuccess(true);
                e.target.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    setErrors(data.errors);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="بوابة التواصل لمجامع اللغة العربية والهيئات الأكاديمية - تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900" dir="rtl">
                
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

                <main className="pt-24 pb-12 px-4 relative overflow-hidden min-h-screen flex items-center">
                    {/* Global decorative background elements */}
                    <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4" />

                    <div className="container mx-auto max-w-6xl relative z-10 w-full mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                            
                            {/* Information Side - Right (RTL) */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="space-y-3">
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
                                        نظام ذكاء <br />
                                        اصطناعي <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-600">متكامل</span>
                                    </h1>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">
                                        لأتمتة صناعة المعاجم وتوفير أدوات بحثية متطورة للمجامع اللغوية والهيئات الأكاديمية تختصر سنوات من العمل التقليدي.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            title: "الاستخراج المصطلحي الذكي",
                                            desc: "استخراج المصطلحات الجديدة وسياقاتها من الكتب والملفات آلياً بدقة متناهية.",
                                            icon: <Zap className="h-4 w-4 text-blue-500" />
                                        },
                                        {
                                            title: "دراسة المقبولية والاستعمال",
                                            desc: "أدوات إحصائية تقيس انتشار المصطلح وقبوله الحقيقي في الأوساط التقنية.",
                                            icon: <FileText className="h-4 w-4 text-indigo-500" />
                                        },
                                        {
                                            title: "إدارة وتوحيد المعاجم",
                                            desc: "منصة سحابية متكاملة لربط فرق العمل الأكاديمية وتسهيل الاعتماد.",
                                            icon: <Building2 className="h-4 w-4 text-green-500" />
                                        }
                                    ].map((feat, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 group cursor-default">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                                {feat.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                                                    {feat.title}
                                                </h4>
                                                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                                                    {feat.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Side - Left (RTL) */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
                                    {/* Subtle internal gradient */}
                                    <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-blue-500 via-indigo-500 to-purple-500" />
                                    
                                    <div className="mb-5">
                                        <h3 className="text-xl font-black text-slate-900 mb-1">تقديم طلب التفعيل</h3>
                                        <p className="text-slate-500 text-xs font-medium">املأ النموذج أدناه وسيقوم فريقنا بالتواصل معكم في أقرب وقت.</p>
                                    </div>

                                    {success ? (
                                        <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2 relative">
                                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                                                <CheckCircle2 className="h-10 w-10 text-green-600 relative z-10" />
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-800">تم إرسال طلبكم بنجاح!</h4>
                                            <p className="text-slate-500 font-medium max-w-md leading-relaxed text-sm">
                                                نشكركم على اهتمامكم. سيقوم فريقنا بدراسة الطلب والتواصل معكم قريباً لبدء التعاون وتفعيل الخدمات.
                                            </p>
                                            <Button variant="outline" onClick={() => setSuccess(false)} className="mt-4 h-10 px-6 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700">
                                                إرسال طلب آخر
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label htmlFor="name" className="text-[11px] font-bold text-slate-600 px-1 flex items-center gap-1.5">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span>اسم الممثل</span>
                                                    </label>
                                                    <input
                                                        type="text" name="name" id="name" required
                                                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
                                                        placeholder="الاسم الكامل"
                                                    />
                                                    {errors.name && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.name[0]}</p>}
                                                </div>

                                                <div className="space-y-1">
                                                    <label htmlFor="academy_name" className="text-[11px] font-bold text-slate-600 px-1 flex items-center gap-1.5">
                                                        <Building2 className="h-3 w-3 text-slate-400" />
                                                        <span>المجمع / الأكاديمية</span>
                                                    </label>
                                                    <input
                                                        type="text" name="academy_name" id="academy_name" required
                                                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
                                                        placeholder="مجمع اللغة..."
                                                    />
                                                    {errors.academy_name && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.academy_name[0]}</p>}
                                                </div>

                                                <div className="space-y-1">
                                                    <label htmlFor="email" className="text-[11px] font-bold text-slate-600 px-1 flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        <span>البريد الإلكتروني</span>
                                                    </label>
                                                    <input
                                                        type="email" name="email" id="email" required dir="ltr"
                                                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
                                                        placeholder="email@example.com"
                                                    />
                                                    {errors.email && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.email[0]}</p>}
                                                </div>

                                                <div className="space-y-1">
                                                    <label htmlFor="phone" className="text-[11px] font-bold text-slate-600 px-1 flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3 text-slate-400" />
                                                        <span>رقم الهاتف</span>
                                                    </label>
                                                    <input
                                                        type="text" name="phone" id="phone" dir="ltr"
                                                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
                                                        placeholder="+000 000 000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="message" className="text-[11px] font-bold text-slate-600 px-1 flex items-center gap-1.5">
                                                    <FileText className="h-3 w-3 text-slate-400" />
                                                    <span>رسالتك</span>
                                                </label>
                                                <textarea
                                                    name="message" id="message" required rows={4}
                                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-bold text-slate-700 resize-none placeholder:text-slate-400 leading-relaxed"
                                                    placeholder="يرجى كتابة تفاصيل الطلب والغرض من الاستخدام..."
                                                />
                                                {errors.message && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.message[0]}</p>}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-12 rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-900/20 font-black text-sm gap-2 transition-all duration-300 hover:-translate-y-0.5"
                                            >
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-1" />}
                                                {loading ? 'جاري الإرسال...' : 'إرسال طلب التفعيل'}
                                            </Button>
                                        </form>
                                    )}
                                </div>
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

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
                    <div className="container mx-auto max-w-5xl space-y-12">
                        
                        {/* Title Header */}
                        <div className="text-right space-y-2">
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                                بوابة التواصل <span className="text-blue-600">الأكاديمي والمجامع</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                تعرف على حلول التعريب الذكية المخصصة للمؤسسات وقدم طلب تفعيل الخدمة لجهتكم الأكاديمية.
                            </p>
                        </div>

                        {/* Academies AI Solutions Banner (Consistent Premium UI) */}
                        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-right relative overflow-hidden text-slate-800" dir="rtl">
                            
                            {/* Visual decorative circles */}
                            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-50/80 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-50/80 blur-[60px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-blue-600 text-xs font-bold">
                                        <Zap className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                                        <span>خاص بمجامع اللغة العربية والهيئات الأكاديمية</span>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-slate-900">
                                        نظام ذكاء اصطناعي متكامل <br />
                                        <span className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent">لأتمتة صناعة المعاجم</span>
                                    </h3>
                                    <p className="text-slate-600 text-sm md:text-base leading-loose font-medium">
                                        نوفر للمجامع اللغوية والهيئات الأكاديمية أدوات بحثية متطورة تعتمد على نماذج ذكاء اصطناعي مدربة خصيصاً على معالجة المصطلحات العلمية والتقنية، مما يختصر سنوات من العمل التقليدي في جمع وتصنيف وتدقيق المصطلحات.
                                    </p>
                                </div>
                                <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                                    {[
                                        {
                                            title: "الاستخراج المصطلحي الذكي",
                                            desc: "استخراج المصطلحات الجديدة وسياقاتها من الكتب والملفات آلياً بدقة متناهية."
                                        },
                                        {
                                            title: "دراسة المقبولية والاستعمال",
                                            desc: "أدوات إحصائية تقيس انتشار المصطلح وقبوله الحقيقي في الأوساط التقنية والبرمجية."
                                        },
                                        {
                                            title: "إدارة وتوحيد المعاجم",
                                            desc: "منصة سحابية متكاملة لربط فرق العمل الأكاديمية وتسهيل عمليات المراجعة والاعتماد المشترك."
                                        }
                                    ].map((feat, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-100 hover:border-slate-200 transition-all shadow-sm">
                                            <h4 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                {feat.title}
                                            </h4>
                                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                                                {feat.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Card */}
                        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-sm text-right">
                            {success ? (
                                <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="h-10 w-10 text-green-600 animate-bounce" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-800">تم إرسال طلبكم بنجاح!</h4>
                                    <p className="text-slate-500 font-medium max-w-md leading-relaxed">
                                        نشكركم على اهتمامكم بمبادرة تعريب. سيقوم فريقنا اللغوي والتقني بدراسة الطلب والتواصل معكم عبر البريد الإلكتروني أو رقم الهاتف المدخل في أقرب وقت ممكن لبدء التعاون وتفعيل الأدوات.
                                    </p>
                                    <Button variant="outline" onClick={() => setSuccess(false)} className="mt-6 rounded-xl font-bold">
                                        إرسال طلب آخر
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        {/* Representative Name */}
                                        <div className="space-y-1">
                                            <label htmlFor="name" className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5 mb-1.5">
                                                <User className="h-3.5 w-3.5 text-slate-400" />
                                                <span>اسم ممثل الجهة</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                                className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                                                placeholder="الاسم الكامل للممثل الأكاديمي"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.name[0]}</p>}
                                        </div>

                                        {/* Academy Name */}
                                        <div className="space-y-1">
                                            <label htmlFor="academy_name" className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5 mb-1.5">
                                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                <span>اسم المجمع أو المؤسسة الأكاديمية</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="academy_name"
                                                id="academy_name"
                                                required
                                                className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                                                placeholder="مثال: مجمع اللغة العربية بدمشق"
                                            />
                                            {errors.academy_name && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.academy_name[0]}</p>}
                                        </div>

                                        {/* Professional Email */}
                                        <div className="space-y-1">
                                            <label htmlFor="email" className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5 mb-1.5">
                                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                <span>البريد الإلكتروني المهني</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                                                placeholder="representative@academy.org"
                                                dir="ltr"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.email[0]}</p>}
                                        </div>

                                        {/* Phone/WhatsApp */}
                                        <div className="space-y-1">
                                            <label htmlFor="phone" className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5 mb-1.5">
                                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                <span>رقم الهاتف / الواتساب</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                                                placeholder="+966 50 000 0000"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    {/* Message details */}
                                    <div className="space-y-1">
                                        <label htmlFor="message" className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5 mb-1.5">
                                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                                            <span>تفاصيل طلب التعاون أو الاستخدام</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            required
                                            rows={6}
                                            className="w-full p-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700 resize-none placeholder:text-slate-300 leading-relaxed"
                                            placeholder="يرجى كتابة نبذة عن غرض الاستخدام، المعاجم المراد أتمتتها، وكيف يمكننا مساعدتكم..."
                                        />
                                        {errors.message && <p className="text-red-500 text-xs px-1 font-bold mt-1">{errors.message[0]}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/10 font-black text-sm gap-2"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-1" />}
                                        {loading ? 'جاري إرسال الطلب...' : 'إرسال طلب التفعيل والمناقشة'}
                                    </Button>
                                </form>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}

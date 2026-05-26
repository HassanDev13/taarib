import { useState, useRef, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    BookOpen, Upload, ArrowLeft, 
    X, Loader2, CheckCircle2, AlertTriangle, Search, Info
} from "lucide-react";

export default function LibraryUpload({ categories, flash, errors: pageErrors }) {
    const [showThanks, setShowThanks] = useState(false);
    
    // File upload form state
    const { data, setData, post, processing, progress, errors, reset } = useForm({
        title: "",
        author: "",
        book_category_id: categories.length > 0 ? categories[0].id : "",
        file: null,
    });

    // Show thanks message if flash success
    useEffect(() => {
        if (flash?.success === 'thank_you') {
            setShowThanks(true);
        }
    }, [flash]);

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type !== "application/pdf") {
            alert("فقط ملفات PDF مسموحة");
            return;
        }
        if (file.size > 100 * 1024 * 1024) {
            alert("حجم الملف يجب أن لا يتجاوز 100 ميغابايت");
            return;
        }
        
        if (!data.title) {
            setData({
                ...data,
                file: file,
                title: file.name.replace(/\.[^/.]+$/, "")
            });
        } else {
            setData("file", file);
        }
    };

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('library.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="رفع كتاب جديد | تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 flex flex-col" dir="rtl">
                
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4 pointer-events-none">
                    <div className="w-full max-w-6xl bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg px-4 h-14 flex items-center justify-between pointer-events-auto">
                        <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                                <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight">تعريب</span>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            <Link href={route('library.index')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                                <span>العودة للمكتبة</span>
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content Split Layout */}
                <main className="flex-1 pt-32 pb-24 px-4 flex items-center justify-center">
                    <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-8 xl:gap-12">
                        
                        {/* Right Column: Instructions and Rules */}
                        <div className="lg:w-5/12 flex flex-col justify-center space-y-6 lg:py-8">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                        <Upload className="w-7 h-7" />
                                    </div>
                                    المساهمة بكتاب
                                </h1>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    شكراً لرغبتك في إثراء المحتوى العربي. عبر رفعك للكتب المتخصصة، أنت تساهم في بناء أضخم قاعدة بيانات للمصطلحات والمعاجم الرقمية.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-3xl flex items-start gap-4 transition-all hover:bg-amber-100/50">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-bold text-amber-900 leading-relaxed pt-0.5">
                                        <span className="block mb-1 font-black text-base">تنبيه هام جداً:</span>
                                        نقبل فقط الكتب المتعلقة بـ <span className="bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950">المعجم</span> و <span className="bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950">المصطلحات (Terminology)</span>. سيتم رفض وحذف أي كتاب خارج هذا النطاق تلقائياً بواسطة فريق المراجعة.
                                    </div>
                                </div>
                                
                                <div className="p-5 bg-blue-50/80 border border-blue-200/60 rounded-3xl flex items-start gap-4 transition-all hover:bg-blue-50">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-bold text-blue-900 leading-relaxed pt-0.5">
                                        <span className="block mb-1 font-black text-base">كيف نستفيد من مساهمتك؟</span>
                                        سيتم إجراء مسح رقمي ضوئي (Scan) للكتب المقبولة لاستخراج محتواها ومصطلحاتها، وإتاحتها ضمن محرك البحث الذكي الخاص بالمنصة لتعميم الفائدة وتسهيل البحث للباحثين والمترجمين.
                                    </div>
                                </div>
                                
                                <div className="p-5 bg-slate-100 border border-slate-200/60 rounded-3xl flex items-start gap-4 transition-all hover:bg-slate-200/50">
                                    <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 leading-relaxed pt-0.5">
                                        <span className="block mb-1 font-black text-base">شروط الرفع:</span>
                                        • الملف يجب أن يكون بصيغة PDF.<br/>
                                        • الحد الأقصى لحجم الملف هو 100 ميغابايت.<br/>
                                        • سيظهر الكتاب في المكتبة بعد مراجعته من الإدارة.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Left Column: Upload Form */}
                        <div className="lg:w-7/12 w-full">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden relative">
                                
                                {showThanks ? (
                                    <div className="p-16 text-center flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
                                        <div className="w-28 h-28 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                                            <CheckCircle2 className="w-14 h-14" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-800 mb-4">تم الاستلام بنجاح!</h2>
                                        <p className="text-slate-500 font-medium text-lg mb-10 max-w-md leading-relaxed">
                                            شكراً لمساهمتك القيمة! الكتاب الآن قيد المراجعة. سيتم إدراجه في المكتبة وفي محرك البحث الذكي فور التأكد من مطابقته لشروط المحتوى.
                                        </p>
                                        <div className="flex gap-4">
                                            <Button 
                                                onClick={() => setShowThanks(false)}
                                                className="h-14 px-8 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-black"
                                            >
                                                رفع كتاب آخر
                                            </Button>
                                            <Link href={route('library.index')}>
                                                <Button 
                                                    className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black"
                                                >
                                                    العودة للمكتبة
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={submitUpload} className="p-8 sm:p-10 lg:p-12 animate-in fade-in">
                                        
                                        <div className="space-y-6">
                                            
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الكتاب <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                                    placeholder="سيتم استخراجه تلقائياً عند رفع الملف، أو يمكنك كتابته يدوياً"
                                                    required
                                                />
                                                {errors.title && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.title}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">المؤلف</label>
                                                    <input 
                                                        type="text" 
                                                        value={data.author}
                                                        onChange={e => setData('author', e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                                        placeholder="اسم المؤلف (اختياري)"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف <span className="text-red-500">*</span></label>
                                                    {categories.length === 0 ? (
                                                        <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm">
                                                            لا توجد تصنيفات حالياً
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <select 
                                                                value={data.book_category_id}
                                                                onChange={e => setData('book_category_id', e.target.value)}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none shadow-sm cursor-pointer"
                                                            >
                                                                {categories.map(cat => (
                                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-400">
                                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">ملف الكتاب (PDF) <span className="text-red-500">*</span></label>
                                                
                                                <div 
                                                    className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <input 
                                                        ref={fileInputRef}
                                                        type="file" 
                                                        accept="application/pdf"
                                                        onChange={handleChange}
                                                        className="hidden" 
                                                    />
                                                    
                                                    {data.file ? (
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                                <CheckCircle2 className="w-8 h-8" />
                                                            </div>
                                                            <span className="text-base font-black text-slate-700 truncate max-w-full px-4">{data.file.name}</span>
                                                            <span className="text-sm font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{(data.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-16 h-16 bg-white text-blue-500 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
                                                                <Upload className="w-7 h-7" />
                                                            </div>
                                                            <div className="text-base text-slate-500 font-medium leading-relaxed">
                                                                <span className="text-blue-600 font-black">اضغط لاختيار ملف PDF</span><br/>أو اسحب الملف وأفلته هنا
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.file && <p className="text-red-500 text-xs mt-2 font-bold">{errors.file}</p>}
                                                {pageErrors?.file && <p className="text-red-500 text-xs mt-2 font-bold">{pageErrors.file}</p>}
                                            </div>
                                            
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col gap-4">
                                            {progress && progress.percentage && (
                                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex-shrink-0 animate-in fade-in duration-300">
                                                    <div 
                                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden" 
                                                        style={{ width: `${progress.percentage}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)' , backgroundSize: '1rem 1rem' }}></div>
                                                    </div>
                                                </div>
                                            )}
                                            <Button 
                                                type="submit" 
                                                disabled={processing || !data.file || !data.title || !categories || categories.length === 0}
                                                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-black transition-all relative overflow-hidden shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center justify-center gap-3 w-full">
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                        {progress && progress.percentage ? `جاري رفع الكتاب... ${progress.percentage}%` : 'جاري التحضير...'}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Upload className="w-5 h-5" />
                                                        رفع الكتاب للمراجعة
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}

import { useState, useRef, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    Upload, ArrowLeft, X, Loader2, CheckCircle2, AlertTriangle, Search, Info, User, Award
} from "lucide-react";

export default function LibraryUpload({ categories, flash, errors: pageErrors }) {
    const [showThanks, setShowThanks] = useState(false);
    
    const { data, setData, post, processing, progress, errors, reset } = useForm({
        title: "",
        author: "",
        uploader_name: "",
        category_ids: [],
        file: null,
    });

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
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 flex flex-col relative overflow-hidden" dir="rtl">
                
                {/* Background Decor */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

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

                <main className="flex-1 pt-32 pb-24 px-4 flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner mx-auto mb-6 transform rotate-3">
                            <Upload className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            المساهمة بكتاب
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            شكراً لرغبتك في إثراء المحتوى العربي. عبر رفعك للكتب المتخصصة، أنت تساهم في بناء أضخم قاعدة بيانات للمصطلحات الرقمية.
                        </p>
                    </div>

                    {/* Info Banners Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
                        <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xl shadow-amber-900/5 flex flex-col items-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-all">
                            <div className="absolute top-0 right-0 w-full h-1 bg-amber-400" />
                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block font-black text-amber-900 mb-1">نطاق المحتوى</span>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                    نقبل فقط الكتب المتعلقة بـ <span className="text-amber-700">المعجم</span> و <span className="text-amber-700">المصطلحات</span>. سيتم رفض ما دون ذلك.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col items-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-all">
                            <div className="absolute top-0 right-0 w-full h-1 bg-blue-500" />
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Search className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block font-black text-blue-900 mb-1">الاستخراج الذكي</span>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                    سيتم إجراء مسح ضوئي للكتاب لاستخراج مصطلحاته وإتاحتها في محرك البحث الذكي.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-all">
                            <div className="absolute top-0 right-0 w-full h-1 bg-slate-400" />
                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block font-black text-slate-800 mb-1">شروط الرفع</span>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                    صيغة PDF فقط، وبحجم لا يتجاوز 100MB. وسيتم النشر بعد المراجعة.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        {showThanks ? (
                            <div className="p-16 text-center flex flex-col items-center justify-center min-h-[500px]">
                                <div className="w-28 h-28 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                                    <CheckCircle2 className="w-14 h-14" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-800 mb-4">تم الاستلام بنجاح!</h2>
                                <p className="text-slate-500 font-medium text-lg mb-10 max-w-md leading-relaxed mx-auto">
                                    شكراً لمساهمتك القيمة! الكتاب الآن قيد المراجعة. سيتم إدراجه في المكتبة فور التأكد من مطابقته.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button 
                                        onClick={() => setShowThanks(false)}
                                        className="h-14 px-8 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-black"
                                    >
                                        رفع كتاب آخر
                                    </Button>
                                    <Link href={route('library.index')}>
                                        <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black">
                                            العودة للمكتبة
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={submitUpload} className="p-6 md:p-10 lg:p-12">
                                <div className="space-y-8">
                                    
                                    {/* Title Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-black text-slate-800">عنوان الكتاب <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                            placeholder="سيتم استخراجه تلقائياً عند رفع الملف، أو يمكنك كتابته يدوياً"
                                            required
                                        />
                                        {errors.title && <p className="text-red-500 text-xs font-bold">{errors.title}</p>}
                                    </div>

                                    {/* Author and Uploader Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-black text-slate-800">المؤلف</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={data.author}
                                                    onChange={e => setData('author', e.target.value)}
                                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pr-12 pl-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                                    placeholder="اسم المؤلف (اختياري)"
                                                />
                                            </div>
                                            {errors.author && <p className="text-red-500 text-xs font-bold">{errors.author}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-black text-slate-800">اسمك (المساهم)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={data.uploader_name}
                                                    onChange={e => setData('uploader_name', e.target.value)}
                                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pr-12 pl-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                                    placeholder="سيظهر في صفحة الكتاب كمساهم (اختياري)"
                                                />
                                            </div>
                                            {errors.uploader_name && <p className="text-red-500 text-xs font-bold">{errors.uploader_name}</p>}
                                        </div>
                                    </div>
                                    
                                    {/* Beautiful inline contributor note */}
                                    <div className="bg-gradient-to-l from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100 flex items-start gap-4 shadow-sm">
                                        <div className="bg-blue-100/80 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div className="pt-0.5">
                                            <h4 className="text-blue-900 font-black text-sm mb-1">مساهمتك محل تقدير عالٍ</h4>
                                            <p className="text-blue-700/80 text-xs font-bold leading-relaxed">
                                                يسعدنا تسجيل اسمك كمساهم في إثراء المحتوى العربي، وسيتم عرض اسمك كمساهم رئيسي في صفحة الكتاب بعد اعتماده لنشر الفائدة.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-slate-800">التصنيفات <span className="text-red-500">*</span></label>
                                        {categories.length === 0 ? (
                                            <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm">
                                                لا توجد تصنيفات حالياً
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50/50 border border-slate-200 p-6 rounded-3xl shadow-sm">
                                                <div className="flex flex-wrap gap-2.5">
                                                    {categories.map(category => {
                                                        const isSelected = data.category_ids.includes(category.id);
                                                        return (
                                                            <button
                                                                key={category.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (isSelected) {
                                                                        setData('category_ids', data.category_ids.filter(id => id !== category.id));
                                                                    } else {
                                                                        setData('category_ids', [...data.category_ids, category.id]);
                                                                    }
                                                                }}
                                                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-all border-2 ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:border-blue-700 hover:-translate-y-0.5' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5'}`}
                                                            >
                                                                {category.name}
                                                                {isSelected && <X className="w-4 h-4 mr-1.5 opacity-75 hover:opacity-100" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {data.category_ids.length === 0 && (
                                                    <p className="text-slate-400 text-sm font-bold mt-5 text-center">يرجى اختيار تصنيف واحد على الأقل</p>
                                                )}
                                            </div>
                                        )}
                                        {errors.category_ids && <p className="text-red-500 text-xs font-bold">{errors.category_ids}</p>}
                                    </div>
                                    
                                    {/* Dropzone */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-black text-slate-800">ملف الكتاب (PDF) <span className="text-red-500">*</span></label>
                                        <div 
                                            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-blue-300'}`}
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
                                                <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                        <CheckCircle2 className="w-8 h-8" />
                                                    </div>
                                                    <span className="text-lg font-black text-slate-800 truncate max-w-full px-4">{data.file.name}</span>
                                                    <span className="text-sm font-bold text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">{(data.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-20 h-20 bg-white text-blue-500 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                                        <Upload className="w-8 h-8" />
                                                    </div>
                                                    <div className="text-base text-slate-500 font-medium leading-relaxed">
                                                        <span className="text-blue-600 font-black">اضغط لاختيار ملف PDF</span><br/>أو اسحب الملف وأفلته هنا
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.file && <p className="text-red-500 text-xs font-bold">{errors.file}</p>}
                                        {pageErrors?.file && <p className="text-red-500 text-xs font-bold">{pageErrors.file}</p>}
                                    </div>
                                    
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-4">
                                    {progress && progress.percentage && (
                                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex-shrink-0 animate-in fade-in duration-300 shadow-inner">
                                            <div 
                                                className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out relative overflow-hidden" 
                                                style={{ width: `${progress.percentage}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)' , backgroundSize: '1rem 1rem' }}></div>
                                            </div>
                                        </div>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !data.file || !data.title || data.category_ids.length === 0}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-black transition-all relative overflow-hidden shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-3 w-full">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                {progress && progress.percentage ? `جاري الرفع... ${progress.percentage}%` : 'جاري التحضير...'}
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
                </main>
            </div>
        </>
    );
}

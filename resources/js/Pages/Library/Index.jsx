import { useState, useRef, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    BookOpen, Upload, Download, Search, ArrowLeft, 
    FileText, User, ChevronDown, ChevronUp, Eye, X
} from "lucide-react";

export default function LibraryIndex({ books, categories, currentCategoryId, currentSearch }) {
    const [searchQuery, setSearchQuery] = useState(currentSearch || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('library.index'), {
            category_id: currentCategoryId,
            search: searchQuery
        }, { preserveState: true, preserveScroll: true });
    };

    const handleCategoryClick = (categoryId) => {
        router.get(route('library.index'), {
            category_id: categoryId,
            search: searchQuery
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <Head title="المكتبة | تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900" dir="rtl">
                
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
                            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                                <span>العودة للرئيسية</span>
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="pt-32 pb-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <BookOpen className="w-10 h-10 text-blue-600" />
                                    المكتبة المفتوحة
                                </h1>
                                <p className="text-slate-500 text-lg font-medium max-w-2xl">
                                    تصفح وحمل الكتب المتعلقة بالمعاجم والمصطلحات. يمكنك أيضاً المساهمة برفع كتب جديدة ليتم مراجعتها ونشرها.
                                </p>
                            </div>
                            
                            <Link 
                                href={route('library.create')}
                                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl font-black shrink-0 flex items-center gap-2 transition-all hover:scale-105"
                            >
                                <Upload className="w-5 h-5" />
                                رفع كتاب جديد
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            
                            {/* Sidebar Filters */}
                            <div className="lg:w-80 xl:w-96 shrink-0 space-y-6">
                                {/* Search */}
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <Search className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-3.5 pr-12 pl-4 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                        placeholder="البحث بعنوان الكتاب أو المؤلف..."
                                    />
                                </form>

                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-6 sticky top-28">
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6">التصنيفات</h3>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleCategoryClick(null)}
                                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-base font-black transition-colors ${!currentCategoryId ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'}`}
                                        >
                                            الكل
                                        </button>
                                        
                                        <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent space-y-3">
                                            {categories.map(category => {
                                                const isSelected = currentCategoryId == category.id;
                                                return (
                                                    <button 
                                                        key={category.id}
                                                        onClick={() => handleCategoryClick(category.id)}
                                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-base font-black transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'}`}
                                                    >
                                                        <span className="truncate flex-1 text-right">{category.name}</span>
                                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                            {category.books_count || 0}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Books Grid */}
                            <div className="flex-1">
                                {books.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-700 mb-2">لا توجد كتب</h3>
                                        <p className="text-slate-500 font-medium max-w-xs">
                                            لم يتم العثور على كتب تطابق بحثك حالياً.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {books.map(book => (
                                            <div key={book.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-900/5 p-6 flex flex-col hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex items-start justify-between gap-4 mb-5">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 justify-end">
                                                        {book.categories && book.categories.length > 0 ? (
                                                            book.categories.slice(0, 2).map(cat => (
                                                                <span key={cat.id} className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100 truncate max-w-[100px]">
                                                                    {cat.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100">
                                                                بدون تصنيف
                                                            </span>
                                                        )}
                                                        {book.categories && book.categories.length > 2 && (
                                                            <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-1.5 py-1 rounded-md border border-slate-100">
                                                                +{book.categories.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                                                    {book.title}
                                                </h3>
                                                
                                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-6 mt-auto">
                                                    <User className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">{book.author || 'غير معروف'}</span>
                                                </div>
                                                
                                                <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
                                                    <a 
                                                        href={route('library.view', book.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl font-bold transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        عرض
                                                    </a>
                                                    <a 
                                                        href={route('library.download', book.id)}
                                                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl font-bold transition-colors group-hover:bg-blue-600 group-hover:text-white"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        تحميل
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

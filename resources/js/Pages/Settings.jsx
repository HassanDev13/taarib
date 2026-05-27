import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Mail, Shield, Save, ArrowLeft, User, Briefcase, Trash2, Key, Info, CheckCircle2, AlertTriangle, Linkedin } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Settings({ specialities }) {
    const { auth } = usePage().props;
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    
    // Manage profile data
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        linkedin_url: auth.user.linkedin_url || '',
        speciality_id: auth.user.speciality_id || '',
        years_of_experience: auth.user.years_of_experience || '',
        about_me: auth.user.about_me || '',
        subscribed_to_announcements: auth.user.subscribed_to_announcements ?? true,
        preferred_search_mode: auth.user.preferred_search_mode || 'detailed',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('settings.update'), {
            preserveScroll: true,
        });
    };

    const deleteUser = () => {
        router.delete(route('settings.destroy'), {
            preserveScroll: true,
            onFinish: () => setConfirmingUserDeletion(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden" dir="rtl">
            <Head title="إعدادات الحساب - تعريب" />
            
            {/* Nav Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
                <div className="w-full max-w-3xl bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-900/5 px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                            <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-sm font-black text-slate-800 tracking-tight">تعريب</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl">
                        العودة للرئيسية
                        <ArrowLeft className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 sm:px-6">
                <div className="mb-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">إعدادات <span className="text-blue-600">الحساب</span></h1>
                    <p className="text-slate-500 text-base font-medium">إدارة معلوماتك الشخصية وتفضيلات البريد الإلكتروني.</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    <div className="p-6 md:p-10">
                        <form onSubmit={submit} className="space-y-10">
                            
                            {/* Personal Info Section */}
                            <div>
                                <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                    <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><User className="w-5 h-5" /></div>
                                    المعلومات الشخصية
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-bold text-slate-700">الاسم الكامل</label>
                                        <input
                                            id="name"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500 font-bold">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                                        <div className="relative">
                                            <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                dir="ltr"
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 pb-3 pt-3 pr-10 text-sm font-medium transition-all text-left"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.email && <p className="text-sm text-red-500 font-bold">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="linkedin_url" className="text-sm font-bold text-slate-700">رابط لينكد إن</label>
                                        <div className="relative">
                                            <Linkedin className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                            <input
                                                id="linkedin_url"
                                                type="url"
                                                dir="ltr"
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 pr-10 text-sm font-medium transition-all text-left"
                                                value={data.linkedin_url}
                                                onChange={e => setData('linkedin_url', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.linkedin_url && <p className="text-sm text-red-500 font-bold">{errors.linkedin_url}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="years_of_experience" className="text-sm font-bold text-slate-700">سنوات الخبرة</label>
                                        <input
                                            id="years_of_experience"
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                                            value={data.years_of_experience}
                                            onChange={e => setData('years_of_experience', e.target.value)}
                                            required
                                        />
                                        {errors.years_of_experience && <p className="text-sm text-red-500 font-bold">{errors.years_of_experience}</p>}
                                    </div>
                                    
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="speciality_id" className="text-sm font-bold text-slate-700">التخصص / المجال</label>
                                        <select
                                            id="speciality_id"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                                            value={data.speciality_id}
                                            onChange={e => setData('speciality_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- اختر التخصص --</option>
                                            {specialities && specialities.map((cat) => (
                                                cat.children?.length > 0 ? (
                                                    <optgroup key={cat.id} label={cat.name}>
                                                        {cat.children.map((sub) => (
                                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                        ))}
                                                    </optgroup>
                                                ) : (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                )
                                            ))}
                                        </select>
                                        {errors.speciality_id && <p className="text-sm text-red-500 font-bold">{errors.speciality_id}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="about_me" className="text-sm font-bold text-slate-700">نبذة عنك</label>
                                        <textarea
                                            id="about_me"
                                            rows="4"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                                            value={data.about_me}
                                            onChange={e => setData('about_me', e.target.value)}
                                            required
                                        />
                                        {errors.about_me && <p className="text-sm text-red-500 font-bold">{errors.about_me}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-slate-100" />
                            
                            {/* Preferences Section */}
                            <div>
                                <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                    <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg"><Mail className="w-5 h-5" /></div>
                                    الإشعارات والتفضيلات
                                </h2>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                                            <label htmlFor="preferred_search_mode" className="text-base font-bold text-slate-800 block">
                                                نمط عرض نتائج البحث الافتراضي
                                            </label>
                                            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-3">
                                                اختر كيف تفضل أن تظهر نتائج البحث بشكل افتراضي.
                                            </p>
                                            <select
                                                id="preferred_search_mode"
                                                className="w-full sm:w-1/2 bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                                                value={data.preferred_search_mode}
                                                onChange={e => setData('preferred_search_mode', e.target.value)}
                                                required
                                            >
                                                <option value="detailed">النمط المفصل (إحصائيات ورسوم بيانية)</option>
                                                <option value="simple">النمط البسيط (نتائج مباشرة)</option>
                                            </select>
                                            {errors.preferred_search_mode && <p className="text-sm text-red-500 font-bold mt-1">{errors.preferred_search_mode}</p>}
                                        </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-6 mt-0.5">
                                            <input
                                                id="promotions"
                                                type="checkbox"
                                                className="w-5 h-5 bg-white border-slate-300 rounded focus:ring-blue-500 text-blue-600 transition-colors"
                                                checked={data.subscribed_to_announcements}
                                                onChange={(e) => setData('subscribed_to_announcements', e.target.checked)}
                                                disabled={processing}
                                            />
                                        </div>
                                        <div className="mr-3 text-sm">
                                            <label htmlFor="promotions" className="font-bold text-slate-800 cursor-pointer text-base">
                                                تلقي رسائل الإعلانات والميزات الجديدة
                                            </label>
                                            <p className="text-slate-500 mt-1.5 leading-relaxed font-medium">
                                                سنقوم بإعلامك عند إطلاق ميزات جديدة، أو تحديثات مهمة في النظام. يمكنك إيقاف هذا الخيار في أي وقت للحفاظ على خصوصيتك.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.subscribed_to_announcements && (
                                        <p className="mt-2 text-sm text-red-500 font-bold">{errors.subscribed_to_announcements}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Area */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                {recentlySuccessful ? (
                                    <div className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                        <CheckCircle2 className="w-4 h-4 ml-1.5" />
                                        تم الحفظ بنجاح
                                    </div>
                                ) : (
                                    <div /> 
                                )}
                                
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 text-base font-black rounded-2xl"
                                >
                                    <Save className="w-5 h-5 ml-2" />
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-12 bg-red-50/50 rounded-[2rem] border border-red-100 overflow-hidden relative p-6 md:p-10">
                    <h2 className="text-xl font-black mb-4 text-red-600 flex items-center gap-2">
                        <div className="bg-red-100 p-1.5 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
                        منطقة الخطر
                    </h2>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                        بمجرد حذف حسابك، سيتم مسح جميع بياناتك والمعلومات المرتبطة به بشكل دائم. ولا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
                    </p>
                    
                    {!confirmingUserDeletion ? (
                        <Button 
                            variant="destructive" 
                            className="bg-red-500 hover:bg-red-600 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-red-500/20"
                            onClick={() => setConfirmingUserDeletion(true)}
                        >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف الحساب نهائياً
                        </Button>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-xl shadow-red-900/5 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-black text-slate-800 mb-2">هل أنت متأكد تماماً؟</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6">يرجى تأكيد رغبتك في الحذف النهائي وتدمير جميع معلومات حسابك.</p>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="h-12 px-6 rounded-xl font-bold bg-white"
                                    onClick={() => setConfirmingUserDeletion(false)}
                                >
                                    تراجع وألغِ الأمر
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="h-12 px-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-md"
                                    onClick={deleteUser}
                                >
                                    <Trash2 className="w-4 h-4 ml-2" />
                                    نعم، احذف الحساب
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
                .font-arabic { font-family: 'Tajawal', sans-serif; }
            `}} />
        </div>
    );
}

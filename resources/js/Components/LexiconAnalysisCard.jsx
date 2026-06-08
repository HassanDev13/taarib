import React, { useState, useEffect } from 'react';

export default function LexiconAnalysisCard({ word, onAnalyzeComplete }) {
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);

    const analyzeWord = async () => {
        if (!word) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/lexicon-analyze?word=${encodeURIComponent(word)}`);
            const data = await res.json();
            if (data.success) {
                setAnalysisData(data.data);
                if (onAnalyzeComplete) onAnalyzeComplete(data.data);
            } else {
                setError('Failed to analyze the word.');
            }
        } catch (err) {
            setError('An error occurred while analyzing the word.');
        } finally {
            setLoading(false);
        }
    };

    // Reset analysis when the searched word changes
    useEffect(() => {
        setAnalysisData(null);
        setError(null);
        setLoading(false);
    }, [word]);

    if (!word) return null;

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6 transition-all duration-300 hover:shadow-md">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        التحليل المعجمي لكلمة <span className="text-primary font-black ml-1">"{word}"</span>
                    </h3>
                </div>
                {!analysisData && !loading && (
                    <button 
                        onClick={analyzeWord}
                        className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-blue-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-md hover:shadow-lg hover:shadow-violet-500/25 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="relative z-10 tracking-wide">تحليل ذكي</span>
                    </button>
                )}
            </div>

            {loading && (
                <div className="p-8 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    <p className="text-gray-500 text-sm animate-pulse">جاري استخراج البيانات المعجمية...</p>
                </div>
            )}

            {error && (
                <div className="p-5 text-red-500 bg-red-50 dark:bg-red-900/20 text-center text-sm border-t border-red-100 dark:border-red-900/30">
                    {error}
                </div>
            )}

            {analysisData && !loading && Array.isArray(analysisData) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl" dir="rtl">
                    {analysisData.map((data, sectionIdx) => (
                        <div key={sectionIdx} className={`p-5 md:p-6 space-y-6 ${sectionIdx !== 0 ? 'border-t-2 border-slate-100 dark:border-slate-700/50' : ''}`}>
                            {analysisData.length > 1 && (
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    تحليل كلمة: <span className="text-primary">{data.word}</span>
                                </h3>
                            )}
                            
                            {/* Root & Core Concept Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        الجذر
                                    </h4>
                                    <p className="text-2xl font-black text-gray-800 dark:text-gray-100">
                                        {data.root || 'غير متوفر'}
                                    </p>
                                </div>

                                {data.core_concept && (
                                    <div className="md:col-span-2 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/50">
                                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex justify-between items-center">
                                            <span>المعنى المحوري للأصل</span>
                                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-800/50 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300">{data.core_concept.source}</span>
                                        </h4>
                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {data.core_concept.text}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Timeline of Meanings Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.classical_meaning && (
                                    <div className="relative p-5 rounded-xl border border-amber-200/60 dark:border-amber-700/30 bg-amber-50/30 dark:bg-amber-900/10">
                                        <div className="absolute top-0 right-0 -mt-2.5 mr-4 px-2 bg-white dark:bg-gray-800">
                                            <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                                المعنى التراثي
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-medium text-amber-500 mb-2 block">{data.classical_meaning.source}</span>
                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-4 hover:line-clamp-none transition-all">
                                            {data.classical_meaning.text}
                                        </p>
                                    </div>
                                )}

                                {data.modern_meaning && (
                                    <div className="relative p-5 rounded-xl border border-indigo-200/60 dark:border-indigo-700/30 bg-indigo-50/30 dark:bg-indigo-900/10">
                                        <div className="absolute top-0 right-0 -mt-2.5 mr-4 px-2 bg-white dark:bg-gray-800">
                                            <h4 className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                                المعنى المعاصر
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-medium text-indigo-500 mb-2 block">{data.modern_meaning.source}</span>
                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-4 hover:line-clamp-none transition-all">
                                            {data.modern_meaning.text}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* English Translation */}
                            {data.english_translation && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center" dir="ltr">
                                        <span>English Context</span>
                                        <span className="text-[10px] font-medium bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{data.english_translation.source}</span>
                                    </h4>
                                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-serif" dir="ltr">
                                        {data.english_translation.text}
                                    </p>
                                </div>
                            )}

                            {/* Word Family (Derivations) */}
                            {data.word_family && data.word_family.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                        عائلة الكلمة (المشتقات من نفس الجذر)
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.word_family.map((relatedWord, rIdx) => (
                                            <span 
                                                key={rIdx} 
                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary hover:text-white transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
                                            >
                                                {relatedWord}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

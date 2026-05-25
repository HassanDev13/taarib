import React from 'react';
import { Head } from '@inertiajs/react';

export default function AnalyticsIndex({ stats }) {
    const { totals, top_queries, failed_queries, daily_breakdown } = stats;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="تحليلات الموقع" />
            <div className="py-8 px-4 max-w-6xl mx-auto" dir="rtl">
                <h1 className="text-2xl font-bold mb-6">📊 تحليلات الموقع</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600">{totals.total_visitors}</div>
                        <div className="text-sm text-gray-500 mt-1">إجمالي الزوار</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-green-600">{totals.total_searches}</div>
                        <div className="text-sm text-gray-500 mt-1">إجمالي البحوث</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600">{totals.total_unique_searches}</div>
                        <div className="text-sm text-gray-500 mt-1">بحوث فريدة</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-orange-600">{totals.total_page_views}</div>
                        <div className="text-sm text-gray-500 mt-1">مشاهدات الصفحات</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-red-600">{totals.daily_avg}</div>
                        <div className="text-sm text-gray-500 mt-1">متوسط الزوار/يوم</div>
                    </div>
                </div>

                {/* Top Searches */}
                {top_queries && top_queries.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">🔍 أشهر المصطلحات المبحوثة</h2>
                        <div className="space-y-2">
                            {top_queries.map((q, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-gray-800">{q.query_normalized}</span>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {q.count} مرة
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Failed Queries */}
                {failed_queries && failed_queries.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8 border-r-4 border-red-500">
                        <h2 className="text-xl font-semibold mb-4 text-red-700">⚠️ مصطلحات بدون ترجمة</h2>
                        <p className="text-sm text-gray-500 mb-3">هذه المصطلحات بحث عنها المستخدمون لكن لم توجد لها ترجمة — فرصة لإضافتها!</p>
                        <div className="space-y-2">
                            {failed_queries.map((q, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-red-50 rounded">
                                    <span className="text-gray-800">{q.query_normalized}</span>
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                        {q.count} ×
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Daily Breakdown */}
                {daily_breakdown && daily_breakdown.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">📅 تفصيل يومي</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-3">التاريخ</th>
                                        <th className="py-2 px-3">الزوار</th>
                                        <th className="py-2 px-3">البحوث</th>
                                        <th className="py-2 px-3">بحوث فريدة</th>
                                        <th className="py-2 px-3">متوسط الوقت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daily_breakdown.map((day, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-3">{new Date(day.date).toLocaleDateString('ar')}</td>
                                            <td className="py-2 px-3">{day.visitors}</td>
                                            <td className="py-2 px-3">{day.searches}</td>
                                            <td className="py-2 px-3">{day.unique_searches}</td>
                                            <td className="py-2 px-3">{day.avg_time_on_site}s</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

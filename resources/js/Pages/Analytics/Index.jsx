import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AnalyticsIndex({ stats }) {
    const { totals, top_queries, failed_queries, daily_breakdown } = stats;

    return (
        <AuthenticatedLayout>
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
                        <div className="text-3xl font-bold text-green-600">{totals.total_page_views}</div>
                        <div className="text-sm text-gray-500 mt-1">مشاهدات الصفحات</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600">{totals.total_searches}</div>
                        <div className="text-sm text-gray-500 mt-1">إجمالي البحوث</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-orange-600">{totals.total_unique_searches}</div>
                        <div className="text-sm text-gray-500 mt-1">بحوث فريدة</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-3xl font-bold text-gray-700">{totals.daily_avg}</div>
                        <div className="text-sm text-gray-500 mt-1">متوسط يومي</div>
                    </div>
                </div>

                {/* Breakdown per day */}
                {daily_breakdown && daily_breakdown.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mb-8">
                        <h2 className="text-lg font-semibold mb-3">📅 تفاصيل الأيام</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-right p-2">التاريخ</th>
                                        <th className="text-right p-2">الزوار</th>
                                        <th className="text-right p-2">مشاهدات</th>
                                        <th className="text-right p-2">بحوث</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daily_breakdown.map((day, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{day.date}</td>
                                            <td className="p-2">{day.visitors}</td>
                                            <td className="p-2">{day.page_views}</td>
                                            <td className="p-2">{day.searches}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Top Queries */}
                {top_queries && top_queries.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mb-8">
                        <h2 className="text-lg font-semibold mb-3">🔍 أكثر المصطلحات بحثاً</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-right p-2">#</th>
                                        <th className="text-right p-2">المصطلح</th>
                                        <th className="text-right p-2">عدد المرات</th>
                                        <th className="text-right p-2">نوع البحث</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top_queries.slice(0, 15).map((q, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{i + 1}</td>
                                            <td className="p-2 font-medium">{q.query_normalized}</td>
                                            <td className="p-2">{q.count}</td>
                                            <td className="p-2">
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                                    {q.search_type || 'semantic'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Failed Queries */}
                {failed_queries && failed_queries.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 border-r-4 border-yellow-400">
                        <h2 className="text-lg font-semibold mb-3 text-yellow-700">⚠️ مصطلحات ليس لها ترجمة بعد (فرصة للإضافة)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-right p-2">#</th>
                                        <th className="text-right p-2">المصطلح</th>
                                        <th className="text-right p-2">عدد محاولات البحث</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {failed_queries.map((q, i) => (
                                        <tr key={i} className="border-b hover:bg-yellow-50">
                                            <td className="p-2">{i + 1}</td>
                                            <td className="p-2 font-medium">{q.query_normalized}</td>
                                            <td className="p-2">{q.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

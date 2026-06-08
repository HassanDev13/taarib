import { useState, useEffect, useCallback } from "react";
import { router } from "@inertiajs/react";
import {
    MessageSquare, Plus, Trash2, Clock, Loader2, ChevronLeft,
    ChevronRight, PanelLeftClose, PanelLeft, Edit2, Check, X
} from "lucide-react";

export default function ChatHistorySidebar({ currentSessionId, onSessionSelect, open, onToggle }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/chat-sessions", {
                headers: { "Accept": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (e) {
            console.error("Failed to fetch sessions", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions, currentSessionId]);

    const createNew = async () => {
        try {
            const res = await fetch("/api/chat-sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
                },
                body: JSON.stringify({ title: "محادثة جديدة" }),
            });
            if (res.ok) {
                const session = await res.json();
                fetchSessions();
                if (onSessionSelect) onSessionSelect(session);
            }
        } catch (e) {
            console.error("Failed to create session", e);
        }
    };

    const deleteSession = async (id, e) => {
        e.stopPropagation();
        if (!confirm("حذف هذه المحادثة وجميع رسائلها؟")) return;
        try {
            const res = await fetch(`/api/chat-sessions/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
                },
            });
            if (res.ok) {
                setSessions(prev => prev.filter(s => s.id !== id));
                if (currentSessionId === id && onSessionSelect) onSessionSelect(null);
            }
        } catch (e) {
            console.error("Failed to delete session", e);
        }
    };

    const startEdit = (session, e) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const saveTitle = async (id) => {
        if (!editTitle.trim()) return setEditingId(null);
        try {
            const res = await fetch(`/api/chat-sessions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
                },
                body: JSON.stringify({ title: editTitle.trim() }),
            });
            if (res.ok) {
                setSessions(prev => prev.map(s => s.id === id ? { ...s, title: editTitle.trim() } : s));
            }
        } catch (e) {
            console.error("Failed to update title", e);
        }
        setEditingId(null);
    };

    const loadSession = (session) => {
        if (onSessionSelect) onSessionSelect(session);
        if (onToggle) onToggle(); // close sidebar on mobile feel
    };

    return (
        <>
            {/* Toggle button (when closed) */}
            {!open && (
                <button
                    onClick={onToggle}
                    className="fixed top-20 right-2 z-50 h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all"
                    title="فتح سجل المحادثات"
                >
                    <PanelLeft className="h-4 w-4" />
                </button>
            )}

            {/* Overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 right-0 h-full z-40 bg-white border-l border-slate-200 shadow-2xl shadow-slate-900/10 transition-all duration-300 flex flex-col ${
                    open ? "translate-x-0 w-[300px] md:w-[320px]" : "translate-x-full w-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0 min-h-[56px]">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-bold text-slate-800">المحادثات</span>
                    </div>
                    <button
                        onClick={onToggle}
                        className="h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="px-3 py-2 shrink-0">
                    <button
                        onClick={createNew}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        محادثة جديدة
                    </button>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <MessageSquare className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm text-slate-400">لا توجد محادثات سابقة</p>
                        </div>
                    ) : (
                        <div className="space-y-1 mt-2">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => loadSession(session)}
                                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                        currentSessionId === session.id
                                            ? "bg-blue-50 border border-blue-100"
                                            : "hover:bg-slate-50 border border-transparent"
                                    }`}
                                >
                                    <MessageSquare className={`h-4 w-4 shrink-0 ${
                                        currentSessionId === session.id
                                            ? "text-blue-600"
                                            : "text-slate-400"
                                    }`} />
                                    
                                    <div className="flex-1 min-w-0">
                                        {editingId === session.id ? (
                                            <div className="flex items-center gap-1">
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="flex-1 text-xs px-2 py-1 rounded-lg border border-blue-300 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                                                    autoFocus
                                                    dir="rtl"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") saveTitle(session.id);
                                                        if (e.key === "Escape") setEditingId(null);
                                                    }}
                                                />
                                                <button onClick={() => saveTitle(session.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="h-3 w-3" /></button>
                                                <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X className="h-3 w-3" /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className={`text-xs font-bold truncate ${
                                                    currentSessionId === session.id
                                                        ? "text-blue-800"
                                                        : "text-slate-700"
                                                }`}>
                                                    {session.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] text-slate-400">
                                                        {session.messages_count || 0} رسالة • {session.updated_at}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => startEdit(session, e)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={(e) => deleteSession(session.id, e)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

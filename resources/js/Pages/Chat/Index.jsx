import { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Send, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatIndex() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "مرحباً! أنا هنا لمساعدتك في البحث عن المصطلحات والموارد. عما تبحث اليوم؟",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userContent = input;
        setInput("");
        setLoading(true);

        const newMessages = [
            ...messages,
            { role: "user", content: userContent },
            { role: "assistant", content: "" }, 
        ];
        setMessages(newMessages);

        // Prepare context: previous messages + new user message
        const contextMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        contextMessages.push({ role: "user", content: userContent });

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/x-ndjson",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ messages: contextMessages }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                const lines = text.split("\n");

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        if (json.chunk) {
                            accumulatedContent += json.chunk;
                            
                            // Filter logic: Hide content if it's purely <think>... or internal model markers
                            let displayContent = accumulatedContent;
                            
                            // Remove complete <think> blocks
                            displayContent = displayContent.replace(/<think>[\s\S]*?<\/think>/gi, "");
                            
                            // Remove <|DSML|...> or variations with unicode pipes
                            displayContent = displayContent.replace(/<[\|｜][\s\S]*?[\|｜]>/gu, "");
                            
                            // Remove <dsml>...</dsml>
                            displayContent = displayContent.replace(/<dsml>[\s\S]*?<\/dsml>/gi, "");

                            // Check for incomplete <think> block at start
                            if (displayContent.match(/^<think>/i)) {
                                displayContent = ""; // Still thinking, show placeholder
                            }
                            
                            // Also remove literal "Thinking..." if it appears at start
                            displayContent = displayContent.replace(/^Thinking\.\.\.\s*/i, "");
                            displayContent = displayContent.trim();

                            setMessages((prev) => {
                                const updated = [...prev];
                                updated[updated.length - 1] = {
                                    role: "assistant",
                                    content: displayContent,
                                };
                                return updated;
                            });
                        }
                    } catch (e) {
                        console.error("Error parsing JSON chunk", e);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg.role === "assistant" && !lastMsg.content) {
                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.\n" + error.message,
                        isError: true,
                    };
                }
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="المساعد الذكي | تعريب" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-arabic selection:bg-blue-100 selection:text-blue-900 flex flex-col" dir="rtl">
                
                {/* Floating Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
                    <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-900/5 px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-sm">
                                <img src="/images/logo.png" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight">تعريب - المساعد الذكي</span>
                        </Link>
                        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                            <span className="hidden sm:inline">العودة للرئيسية</span>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </div>
                </nav>
                
                <main className="flex-1 container mx-auto p-4 flex flex-col max-w-4xl w-full mt-24">
                    <div className="flex-1 space-y-6 mb-4 overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex w-full ${
                                    msg.role === "user" ? "justify-start" : "justify-end"
                                }`}
                            >
                                <div className={`flex gap-3 max-w-[95%] sm:max-w-[85%] ${
                                    msg.role === "user" ? "flex-row" : "flex-row-reverse"
                                }`}>
                                    {/* Avatar */}
                                    <div
                                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                                            msg.role === "user"
                                                ? "bg-slate-200"
                                                : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm"
                                        }`}
                                    >
                                        {msg.role === "user" ? (
                                            <User className="h-5 w-5 text-slate-600" />
                                        ) : (
                                            <img src="/images/logo.png" alt="Logo" className="h-4 w-4 object-contain brightness-0 invert" />
                                        )}
                                    </div>
                                    
                                    {/* Message Bubble */}
                                    <div
                                        className={`relative rounded-2xl p-5 text-sm sm:text-base shadow-sm ${
                                            msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-white border border-slate-200/60 rounded-tl-none"
                                        }`}
                                    >
                                        <div 
                                            className="leading-relaxed text-right" 
                                            dir="rtl"
                                        >
                                            {msg.content ? (
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({node, ...props}) => <h1 className={`text-2xl md:text-3xl font-black border-b-2 pb-3 mb-6 mt-8 ${msg.role === 'assistant' ? 'text-blue-900 border-blue-100' : 'text-white border-blue-400/50'}`} {...props} />,
                                                        h2: ({node, ...props}) => <h2 className={`text-xl md:text-2xl font-bold mb-5 mt-10 flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-6 before:rounded-full ${msg.role === 'assistant' ? 'text-slate-800 before:bg-blue-500' : 'text-white before:bg-white'}`} {...props} />,
                                                        h3: ({node, ...props}) => <h3 className={`text-lg font-bold mb-4 mt-8 ${msg.role === 'assistant' ? 'text-slate-700' : 'text-white'}`} {...props} />,
                                                        ul: ({node, ...props}) => <ul className={`list-disc pr-5 space-y-3 my-6 marker:text-blue-500 ${msg.role === 'assistant' ? 'text-slate-600' : 'text-white marker:text-white'}`} {...props} />,
                                                        ol: ({node, ...props}) => <ol className={`list-decimal pr-5 space-y-3 my-6 font-medium marker:text-blue-500 ${msg.role === 'assistant' ? 'text-slate-600' : 'text-white marker:text-white'}`} {...props} />,
                                                        li: ({node, ...props}) => <li className="pl-1 leading-loose" {...props} />,
                                                        a: ({node, ...props}) => {
                                                            const isPageLink = props.href?.includes('#page=');
                                                            return isPageLink 
                                                                ? <a className={`inline-flex items-center justify-center px-2.5 py-0.5 mx-1 rounded-md text-sm font-bold transition-colors border shadow-sm ${msg.role === 'assistant' ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border-indigo-200' : 'bg-white/20 text-white hover:bg-white/30 border-white/30'}`} target="_blank" rel="noopener noreferrer" {...props} />
                                                                : <a className={`underline underline-offset-4 font-medium ${msg.role === 'assistant' ? 'text-blue-600 hover:text-blue-800 decoration-blue-200' : 'text-white hover:text-blue-100 decoration-white/50'}`} target="_blank" rel="noopener noreferrer" {...props} />;
                                                        },
                                                        p: ({node, ...props}) => <p className={`mb-6 last:mb-0 leading-loose text-base ${msg.role === 'assistant' ? 'text-slate-700' : 'text-white'}`} {...props} />,
                                                        strong: ({node, ...props}) => <strong className={`font-bold ${msg.role === 'assistant' ? 'text-slate-900' : 'text-white'}`} {...props} />,
                                                        table: ({node, ...props}) => <div className={`overflow-x-auto my-8 rounded-xl border shadow-sm ${msg.role === 'assistant' ? 'border-slate-200' : 'border-blue-400'}`}><table className="w-full text-sm text-right border-collapse" {...props} /></div>,
                                                        thead: ({node, ...props}) => <thead className={`text-xs uppercase border-b ${msg.role === 'assistant' ? 'text-slate-600 bg-slate-50 border-slate-200' : 'text-blue-100 bg-blue-700 border-blue-500'}`} {...props} />,
                                                        th: ({node, ...props}) => <th className="px-4 py-3 font-bold" {...props} />,
                                                        td: ({node, ...props}) => <td className={`px-4 py-3 border-t ${msg.role === 'assistant' ? 'border-slate-100' : 'border-blue-500'}`} {...props} />,
                                                        blockquote: ({node, ...props}) => <blockquote className={`border-r-4 pr-4 py-3 my-6 rounded-l-lg italic ${msg.role === 'assistant' ? 'border-blue-500 bg-blue-50 text-slate-700' : 'border-white bg-blue-700 text-white'}`} {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <span className="animate-pulse">جاري التفكير...</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                         <div ref={scrollRef} />
                    </div>


                    <div className="sticky bottom-6 z-10 px-1">
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/5 p-2">
                            <form
                                onSubmit={handleSend}
                                className="flex items-center gap-3"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) =>
                                        setInput(e.target.value)
                                    }
                                    placeholder="ابحث عن مصطلح أو مورد..."
                                    className="border-0 focus-visible:ring-0 shadow-none text-base font-arabic bg-transparent h-12"
                                    disabled={loading}
                                    dir="rtl"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || loading}
                                    className={`h-12 w-12 rounded-xl shrink-0 transition-all duration-300 ${loading ? 'opacity-50' : 'hover:scale-105 hover:shadow-md bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Send className="h-5 w-5 rotate-180 text-white" />} 
                                </Button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

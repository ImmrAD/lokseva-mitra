"use client";
import { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES & INTERFACES ---
interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

type Language = "en" | "hi" | "mr";

const UI_TEXT = {
  en: {
    title: "LokSeva Mitra",
    subtitle: "Citizen Portal",
    newChat: "+ NEW",
    history: "HISTORY",
    placeholder: "Ask about schemes or Mandi prices...",
    send: "SEND",
    pdf: "PDF REPORT",
    ticker: "LATEST UPDATES",
    loading: "CHECKING LIVE RECORDS...",
    welcome: "Namaste! How can I help you today?",
    deleteConfirm: "Delete this conversation?",
  },
  hi: {
    title: "लोकसेवा मित्र",
    subtitle: "नागरिक पोर्टल",
    newChat: "+ नया चैट",
    history: "पुराना इतिहास",
    placeholder: "योजनाओं या मंडी भाव के बारे में पूछें...",
    send: "भेजें",
    pdf: "पीडीएफ रिपोर्ट",
    ticker: "ताज़ा अपडेट",
    loading: "रिकॉर्ड की जाँच हो रही है...",
    welcome: "नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?",
    deleteConfirm: "क्या आप इस बातचीत को हटाना चाहते हैं?",
  },
  mr: {
    title: "लोकसेवा मित्र",
    subtitle: "नागरिक पोर्टल",
    newChat: "+ नवीन चॅट",
    history: "इतिहास",
    placeholder: "योजना किंवा मंडी दराबद्दल विचारा...",
    send: "पाठवा",
    pdf: "पीडीएफ रिपोर्ट",
    ticker: "ताज्या घडामोडी",
    loading: "रेकॉर्ड तपासत आहे...",
    welcome: "नमस्कार! मी तुम्हाला आज कशी मदत करू शकतो?",
    deleteConfirm: "तुम्ही हे संभाषण हटवू इच्छिता का?",
  },
};

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [news, setNews] = useState<string[]>([]);
  const [lang, setLang] = useState<Language>("en");

  const createNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lokseva_chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setSessions(parsed);
        setActiveId(parsed[0].id);
      } else {
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, [createNewChat]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("lokseva_chats", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data.news);
      } catch {
        setNews(["LokSeva Mitra - Your Digital Assistant"]);
      }
    };
    fetchNews();
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId) || null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeId) return;

    const userMessage = input;
    const currentId = activeId;
    
    setInput("");
    setIsLoading(true);

    // ✅ Immutable Update for User Message
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentId
          ? {
              ...s,
              title: s.messages.length === 0 ? userMessage.substring(0, 30) + "..." : s.title,
              messages: [...s.messages, { role: "user", content: userMessage }],
            }
          : s
      )
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          language: lang,
          userProfile: { age: 25, income: 150000, state: "Maharashtra" },
        }),
      });

      const data = await response.json();

      // ✅ Immutable Update for AI Message
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentId
            ? {
                ...s,
                messages: [...s.messages, { role: "ai", content: data.reply }],
              }
            : s
        )
      );
    } catch {
      console.error("Failed to fetch response");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(UI_TEXT[lang].deleteConfirm)) {
      setSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        if (activeId === id) setActiveId(filtered[0]?.id || null);
        return filtered;
      });
    }
  };

  const downloadPDF = () => {
    if (!activeSession) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${UI_TEXT[lang].title} - Report`, 20, 20);
    let y = 35;
    doc.setFontSize(10);
    activeSession.messages.forEach((m) => {
      const role = m.role === "user" ? "Citizen" : "LokSeva Mitra";
      const cleanContent = m.content.replace(/[#*`]/g, "");
      const text = doc.splitTextToSize(`${role}: ${cleanContent}`, 170);
      if (y + (text.length * 7) > 280) { doc.addPage(); y = 20; }
      doc.text(text, 20, y);
      y += (text.length * 7) + 5;
    });
    doc.save(`LokSeva_Report.pdf`);
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans">
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="bg-slate-900 flex flex-col shrink-0 overflow-hidden text-white z-30 shadow-2xl"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center whitespace-nowrap">
          <span className="font-bold text-[10px] tracking-widest text-slate-500 uppercase">{UI_TEXT[lang].history}</span>
          <button onClick={createNewChat} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all">
            {UI_TEXT[lang].newChat}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 w-[280px]">
          {sessions.map((s) => (
            <motion.div
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`group p-4 rounded-xl cursor-pointer flex justify-between items-center text-sm transition-all ${activeId === s.id ? "bg-slate-800 border-l-4 border-blue-500" : "hover:bg-slate-800/50 text-slate-400"}`}
            >
              <span className="truncate w-44">{s.title}</span>
              <button onClick={(e) => deleteSession(s.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-red-400">×</button>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-xl">{isSidebarOpen ? "⇠" : "⇢"}</button>
            <h1 className="text-xl font-black text-blue-800 tracking-tight">{UI_TEXT[lang].title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-gray-100 text-gray-700 text-xs font-bold rounded-lg px-2 py-2 outline-none">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
            {activeSession && activeSession.messages.length > 0 && (
              <button onClick={downloadPDF} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">{UI_TEXT[lang].pdf}</button>
            )}
          </div>
        </header>

        <div className="bg-orange-50 border-b border-orange-100 h-9 flex items-center overflow-hidden shrink-0">
          <div className="bg-orange-500 text-white px-4 h-full flex items-center font-black text-[9px] z-10 whitespace-nowrap">{UI_TEXT[lang].ticker} 🇮🇳</div>
          <div className="flex-1 whitespace-nowrap overflow-hidden">
            <div className="animate-marquee inline-block text-[11px] text-orange-900 font-bold py-2 uppercase">
              {news.length > 0 ? news.join("  |  ") : "Connecting to Official OGD API...  |  "}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8">
          <AnimatePresence>
            {activeSession?.messages.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-center">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-lg">
                  <h2 className="text-2xl font-black text-gray-800">{UI_TEXT[lang].welcome}</h2>
                  <p className="text-gray-500 text-sm mt-2">{UI_TEXT[lang].placeholder}</p>
                </div>
              </motion.div>
            ) : (
              activeSession?.messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl border ${msg.role === "user" ? "bg-blue-600 text-white border-blue-500" : "bg-white text-gray-800 border-gray-200 shadow-sm"}`}>
                    {msg.role === "ai" ? (
                      <div className="prose prose-sm max-w-none text-inherit leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                          a: ({ ...props }: any) => <a {...props} target="_blank" className="text-blue-600 underline font-black" />,
                          strong: ({ ...props }: any) => <strong {...props} className="font-black text-blue-900" />
                        }}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : <p className="whitespace-pre-wrap font-medium">{msg.content}</p>}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {isLoading && <div className="text-xs text-blue-500 font-bold animate-pulse">{UI_TEXT[lang].loading}</div>}
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={UI_TEXT[lang].placeholder} className="flex-1 bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all" disabled={isLoading} />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-800 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 disabled:opacity-50 tracking-widest text-xs uppercase transition-all active:scale-95">{UI_TEXT[lang].send}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
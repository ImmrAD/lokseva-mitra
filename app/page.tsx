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

// --- MULTILINGUAL UI DICTIONARY (Newspaper Styled) ---
const UI_TEXT = {
  en: {
    title: "The LokSeva Mitra",
    subtitle: "VOICE OF THE CITIZEN Portal",
    volume: "VOL. II | ED. I",
    newChat: "+ NEW ARTICLE",
    history: "INDEX / ARCHIVES",
    placeholder: "Draft query on schemes or Mandi prices...",
    send: "SUBMIT",
    pdf: "PRINT ADVISORY (PDF)",
    ticker: "LATEST TELEGRAMS",
    loading: "Consulting Archives...",
    welcome: "Greetings, Citizen. How can we advise you today?",
    deleteConfirm: "Archiving Error: Are you sure you wish to delete?",
  },
  hi: {
    title: "लोकसेवा मित्र",
    subtitle: "नागरिक पोर्टल संस्करण",
    volume: "खण्ड २ | अंक १",
    newChat: "+ नया लेख",
    history: "सूचकांक / संग्रह",
    placeholder: "योजनाओं या मंडी भाव पर प्रश्न लिखें...",
    send: "भेजें",
    pdf: "सलाहकार रिपोर्ट (PDF)",
    ticker: "ताज़ा समाचार",
    loading: "पुराने रिकॉर्ड की जाँच हो रही है...",
    welcome: "नमस्ते, नागरिक। आज हम आपकी क्या सहायता कर सकते हैं?",
    deleteConfirm: "संग्रह त्रुटि: क्या आप इसे हटाना चाहते हैं?",
  },
  mr: {
    title: "लोकसेवा मित्र",
    subtitle: "नागरिक पोर्टल आवृत्ती",
    volume: "खंड २ | अंक १",
    newChat: "+ नवीन लेख",
    history: "अनुक्रमणिका / संग्रह",
    placeholder: "योजना किंवा मंडी दराबद्दल प्रश्न लिहा...",
    send: "पाठवा",
    pdf: "सल्लागार अहवाल (PDF)",
    ticker: "ताज्या घडामोडी",
    loading: "रेकॉर्ड तपासत आहे...",
    welcome: "नमस्कार, नागरिक. आज मी तुम्हाला कशी मदत करू शकतो?",
    deleteConfirm: "संग्रह त्रुटी: तुम्ही हे हटवू इच्छिता का?",
  },
};

export default function Home() {
  // --- STATE ---
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [news, setNews] = useState<string[]>([]);
  const [lang, setLang] = useState<Language>("en");
  const [formattedDate, setFormattedDate] = useState("");

  // Faux Date for Newspaper Header
  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'hi' ? 'hi-IN' : 'mr-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, [lang]);

  // --- ACTIONS ---
  const createNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Article Draft",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
  }, []);

  // Load Sessions
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

  // Save Sessions
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("lokseva_chats", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Fetch News Ticker
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data.news);
      } catch {
        setNews(["OGD Connection Stable: Awaiting New Telegrams"]);
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

    // Immutable Update for User Message
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

      // Immutable Update for AI Message
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
      console.error("Failed to fetch advisory");
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
    doc.text(`Advisory: ${activeSession.title}`, 20, 20);
    let y = 35;
    doc.setFontSize(10);
    activeSession.messages.forEach((m) => {
      const role = m.role === "user" ? "QUERY" : "ADVISORY";
      const cleanContent = m.content.replace(/[#*`]/g, "");
      const text = doc.splitTextToSize(`${role}: ${cleanContent}`, 170);
      if (y + (text.length * 7) > 280) { doc.addPage(); y = 20; }
      doc.text(text, 20, y);
      y += (text.length * 7) + 5;
    });
    doc.save(`LokSeva_Mitra_Advisory.pdf`);
  };

  return (
    // Changed Base Background to off-white parchment/paper color
    <div className="flex h-screen bg-[#faf8f5] text-zinc-950 overflow-hidden rounded-none border-none antialiased">
      
      {/* SIDEBAR (INDEX / ARCHIVES) */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="bg-white flex flex-col shrink-0 overflow-hidden text-zinc-950 z-30 shadow-none border-r-2 border-zinc-900 rounded-none"
      >
        <div className="p-6 border-b-2 border-zinc-900 flex flex-col gap-3 whitespace-nowrap">
          <span className="font-mono font-bold text-xs tracking-wider text-rose-950 uppercase border-b border-rose-900 pb-1">
            {UI_TEXT[lang].history}
          </span>
          <button onClick={createNewChat} className="w-full bg-zinc-900 hover:bg-zinc-700 text-white p-3 rounded-none text-xs font-black tracking-widest uppercase transition-all">
            {UI_TEXT[lang].newChat}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 w-[280px]">
          {sessions.map((s) => (
            <motion.div
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`group p-4 rounded-none cursor-pointer flex justify-between items-center text-sm transition-all border ${activeId === s.id ? 'bg-zinc-100 border-zinc-900' : 'hover:bg-zinc-50 border-transparent text-zinc-700'}`}
            >
              <span className="truncate w-44 font-medium">{s.title}</span>
              <button onClick={(e) => deleteSession(s.id, e)} className="opacity-0 group-hover:opacity-100 text-rose-950 hover:text-red-600 font-black text-lg">×</button>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* MAIN VIEW (FRONT PAGE) */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        
        {/* HEADER (THE MASTHEAD) */}
        <header className="bg-white p-4 shrink-0 z-20 border-b-4 border-double border-zinc-900">
          <div className="flex justify-between items-center border-b border-zinc-400 pb-3 mb-3 text-xs font-mono font-bold text-zinc-600 uppercase tracking-wider">
            <span>{UI_TEXT[lang].volume}</span>
            <span>{formattedDate}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-zinc-100 text-zinc-800 text-xs font-bold rounded-none px-2 py-1 outline-none border border-zinc-300">
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-zinc-100 rounded-none text-2xl border border-zinc-300 shadow-inner">
              {isSidebarOpen ? "⇠" : "⇢"}
            </button>
            <div className="flex-1 text-center">
              {/* HEAVY SERIF TYPOGRAPHY */}
              <h1 className="text-4xl md:text-5xl font-serif font-black text-rose-950 tracking-tighter leading-none">
                {UI_TEXT[lang].title}
              </h1 >
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="flex-1 h-px bg-rose-950/20"></div>
                <span className="text-xs font-mono font-black text-rose-900 uppercase tracking-[0.2em]">
                  {UI_TEXT[lang].subtitle}
                </span>
                <div className="flex-1 h-px bg-rose-950/20"></div>
              </div>
            </div>
            {activeSession && activeSession.messages.length > 0 && (
              <button onClick={downloadPDF} className="bg-white border-2 border-rose-950 hover:bg-rose-50 text-rose-950 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                {UI_TEXT[lang].pdf}
              </button>
            )}
          </div>
        </header>

        {/* NEWS TICKER (TELEGRAMS BAR) */}
        <div className="bg-rose-950 text-white h-9 flex items-center overflow-hidden shrink-0 border-b border-rose-900">
          <div className="bg-white text-rose-950 px-4 h-full flex items-center font-black text-[9px] z-10 whitespace-nowrap uppercase tracking-widest border-r-2 border-rose-950">
            {UI_TEXT[lang].ticker} 🇮🇳
          </div>
          <div className="flex-1 whitespace-nowrap overflow-hidden">
            <div className="animate-marquee inline-block text-[11px] font-medium py-2 uppercase tracking-wide">
              {news.length > 0 ? news.join("  |  ") : "Connecting to Official OGD API Telegrams...  |  "}
            </div>
          </div>
        </div>

        {/* CHAT AREA (THE COLUMNS) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 bg-[#faf8f5]">
          <AnimatePresence>
            {activeSession?.messages.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-center">
                <div className="bg-white p-16 rounded-none shadow-none border-2 border-zinc-900 max-w-lg text-left relative">
                  <span className="absolute -top-6 -left-6 text-7xl font-serif font-black text-rose-950 leading-none">“</span>
                  <h2 className="text-3xl font-serif font-bold text-zinc-900 leading-tight">{UI_TEXT[lang].welcome}</h2>
                  <p className="font-sans text-zinc-600 mt-4 leading-relaxed">{UI_TEXT[lang].placeholder}</p>
                </div>
              </motion.div>
            ) : (
              activeSession?.messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] p-6 rounded-none border-2 ${msg.role === "user" 
                    ? "bg-white text-rose-950 border-rose-950 shadow-[4px_4px_0_rgba(159,18,57,0.1)]" 
                    : "bg-white text-zinc-900 border-zinc-900 shadow-[4px_4px_0_rgba(0,0,0,0.1)]"}`}>
                    
                    {/* Role Label */}
                    <div className={`text-[10px] font-mono font-black uppercase tracking-widest mb-3 pb-1 border-b ${msg.role === "user" ? 'border-rose-300' : 'border-zinc-300'}`}>
                      {msg.role === "user" ? '[Query]' : '[Official Advisory]'}
                    </div>

                    {msg.role === "ai" ? (
                      // SERIF FOR AI BODY CONTENT
                      <div className="prose prose-sm max-w-none text-inherit leading-relaxed font-serif text-[15px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                          a: ({ ...props }: any) => <a {...props} target="_blank" className="text-blue-900 underline font-black" />,
                          strong: ({ ...props }: any) => <strong {...props} className="font-black text-rose-950" />,
                          h1: ({ ...props }: any) => <h1 {...props} className="text-lg font-serif font-bold mt-4 mb-2 text-zinc-900 border-double border-b-2 border-zinc-800 pb-1" />,
                          ul: ({ ...props }: any) => <ul {...props} className="list-disc ml-5 space-y-2 mt-3" />,
                        }}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      // SANS-SERIF FOR USER QUERY
                      <p className="whitespace-pre-wrap font-sans font-medium text-base text-rose-950">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {isLoading && (
            <div className="text-xs text-rose-950 font-mono font-black animate-pulse uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-950 rounded-none rotate-45"></span>
              {UI_TEXT[lang].loading}
            </div>
          )}
        </div>

        {/* INPUT AREA (EDITORIAL DESK) */}
        <div className="bg-white border-t-2 border-zinc-900 p-6 shadow-none">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={UI_TEXT[lang].placeholder} className="flex-1 bg-white border-2 border-zinc-900 rounded-none px-6 py-4 focus:outline-none focus:border-rose-950 transition-all font-serif italic shadow-inner" disabled={isLoading} />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-zinc-950 hover:bg-zinc-700 disabled:bg-zinc-400 text-white px-8 py-4 rounded-none font-black hover:bg-blue-700 disabled:opacity-50 tracking-widest text-xs uppercase transition-all active:scale-95">
              {UI_TEXT[lang].send}
            </button>
          </form>
          <div className="text-center mt-3 text-[9px] text-zinc-500 font-bold font-mono tracking-widest uppercase border-t border-zinc-200 pt-2">
            EDITORIAL DEPARTMENT | CIZTEN RELATIONS | LOKSEVA MITRA ©
          </div>
        </div>
      </main>
    </div>
  );
}
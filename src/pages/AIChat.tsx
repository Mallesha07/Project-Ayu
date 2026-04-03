import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, User, Bot, Leaf, Image as ImageIcon, Sparkles, ArrowRight, X, Loader2, Shield, Mic, MicOff } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Project Ayu AI Plant Assistant. I can help you identify medicinal plants, diagnose care issues, and provide gardening tips. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening...", { icon: "🎤" });
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please allow microphone access in your browser to use voice chat.");
      } else {
        toast.error(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      // Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";

      let responseStream;
      if (userMessage.image) {
        // Image + Text
        const base64Data = userMessage.image.split(",")[1];
        responseStream = await ai.models.generateContentStream({
          model,
          contents: {
            parts: [
              { text: userMessage.content || "Analyze this plant and provide care instructions." },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
            ],
          },
          config: {
            systemInstruction: "You are an expert botanist and medicinal plant specialist for Project Ayu. Provide concise, helpful, and scientifically accurate advice about plants, especially medicinal ones.",
          },
        });
      } else {
        // Text only
        responseStream = await ai.models.generateContentStream({
          model,
          contents: userMessage.content,
          config: {
            systemInstruction: "You are an expert botanist and medicinal plant specialist for Project Ayu. Provide concise, helpful, and scientifically accurate advice about plants, especially medicinal ones.",
          },
        });
      }

      setLoading(false);
      let fullText = "";
      for await (const chunk of responseStream) {
        fullText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullText }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("AI Error:", err);
      toast.error("Failed to get AI response. Please try again.");
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-8 px-4 md:px-8 h-screen flex flex-col bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col bg-white rounded-[2rem] border border-[#E8F3ED] shadow-2xl shadow-[#2D5A43]/5 overflow-hidden relative">
        {/* Header */}
        <div className="pl-8 pr-0 pb-0 pt-[3px] border-b border-[#E8F3ED] flex items-center justify-between bg-white z-20 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2D5A43] text-white rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A2E24]">AI Plant Assistant</h1>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 md:p-8 pb-48 space-y-8 scroll-smooth bg-[#F9FBFA]"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-[#1A2E24] text-white" : "bg-[#2D5A43] text-white"
              )}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="space-y-2">
                <div className={cn(
                  "p-6 rounded-[2rem] text-lg leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#1A2E24] text-white rounded-tr-none"
                    : "bg-[#F4F9F6] text-[#1A2E24] border border-[#E8F3ED] rounded-tl-none"
                )}>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded plant"
                      className="w-full max-w-xs rounded-2xl mb-4 border border-white/20"
                    />
                  )}
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#5C7166] uppercase tracking-widest px-2">
                  {msg.role === "user" ? "You" : "Project Ayu AI"} • Just now
                </span>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 bg-[#2D5A43] text-white rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-[#F4F9F6] p-6 rounded-[2rem] rounded-tl-none border border-[#E8F3ED] flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#2D5A43] animate-spin" />
                <span className="text-[#5C7166] font-medium">Analyzing your request...</span>
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pt-32 bg-gradient-to-t from-[#F9FBFA] via-[#F9FBFA]/95 to-transparent flex flex-col items-center pointer-events-none z-10">
          <div className="w-full max-w-4xl pointer-events-auto flex flex-col gap-4">
            {messages.length === 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {["How do I care for Tulsi?", "What plants are good for sleep?", "My plant's leaves are turning yellow"].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="px-5 py-2.5 bg-white border border-[#E8F3ED] rounded-full text-sm font-medium text-[#5C7166] hover:border-[#2D5A43] hover:text-[#2D5A43] shadow-sm hover:shadow-md transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="relative self-start ml-4 mb-2"
                >
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-2xl border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white border border-[#E8F3ED] shadow-xl shadow-[#2D5A43]/5 rounded-[2rem] p-2 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 md:p-4 text-[#5C7166] hover:text-[#2D5A43] hover:bg-[#F4F9F6] rounded-2xl transition-all shrink-0"
              >
                <ImageIcon className="w-6 h-6" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={toggleListening}
                className={cn(
                  "p-3 md:p-4 rounded-2xl transition-all shrink-0",
                  isListening
                    ? "bg-red-50 text-red-500 animate-pulse"
                    : "text-[#5C7166] hover:text-[#2D5A43] hover:bg-[#F4F9F6]"
                )}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <input
                type="text"
                placeholder="Ask about your plants..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-grow bg-transparent border-none focus:outline-none px-2 md:px-4 text-lg text-[#1A2E24] placeholder:text-[#5C7166]/50 min-w-0"
              />
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !selectedImage)}
                className="p-3 md:p-4 bg-[#2D5A43] text-white rounded-2xl hover:bg-[#234735] transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 active:scale-95 shrink-0"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-[10px] font-bold text-[#5C7166] uppercase tracking-[0.2em] mt-2">
              Powered by Project Ayu Intelligence • 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

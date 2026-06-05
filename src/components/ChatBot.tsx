import { useEffect, useRef, useState } from "react";
import ZoeAvatarImg from "../assets/Zoe.png";
import {
  ArrowUp,
  Camera,
  FileText,
  Image,
  Mic,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const ZoeAvatar = ({ className }: { className?: string }) => (
  <img src={ZoeAvatarImg} alt="Zoe" className={className} />
);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot reply — replace with real API call
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "I've received your request. I'm working on it and will get back to you shortly.",
        },
      ]);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{ id: "welcome", role: "bot", content: "Hello! How can I help you today?" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-bg-surface rounded-2xl shadow-2xl border border-border-muted flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border-muted bg-bg-surface">
            <div className="flex items-center gap-2">
              <Sparkles className="text-bg-button" size={18} />
              <span className="text-sm font-semibold text-text-primary">
                Zoe - your assistant for the day!
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-3">
            <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[78%] px-3 py-2 rounded-2xl rounded-br-sm text-sm leading-snug bg-bg-tertiary text-text-primary shadow-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "max-w-[78%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm leading-snug",
                      i === 0
                        ? "bg-text-primary text-white"
                        : "bg-bg-tertiary text-text-primary"
                    )}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-text-primary rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 border-t border-border-muted bg-bg-surface">
            <div className="flex items-center gap-2 bg-bg-surface border border-border-muted rounded-2xl px-3 py-2">
              {/* Attachment */}
              <div className="relative" ref={attachMenuRef}>
                <button
                  onClick={() => setAttachMenuOpen((prev) => !prev)}
                  className="w-7 h-7 rounded-full border border-border-muted flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <Plus size={16} />
                </button>

                {attachMenuOpen && (
                  <div className="absolute bottom-10 left-0 bg-text-primary rounded-xl overflow-hidden shadow-lg min-w-[130px] z-10">
                    {[
                      { icon: <Camera size={16} />, label: "Camera" },
                      { icon: <Image size={16} />, label: "Images" },
                      { icon: <FileText size={16} />, label: "Files" },
                    ].map(({ icon, label }) => (
                      <button
                        key={label}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => setAttachMenuOpen(false)}
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Zoe..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
              />

              {/* Mic */}
              <button className="text-text-tertiary hover:text-text-primary transition-colors">
                <Mic size={17} />
              </button>

              {/* Send */}
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  inputValue.trim()
                    ? "bg-bg-button hover:bg-bg-button-hover text-white"
                    : "bg-bg-button-gray text-text-tertiary cursor-not-allowed"
                )}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip bubble */}
      {showTooltip && !isOpen && (
        <div className="bg-bg-surface text-text-primary text-sm font-medium px-4 py-2.5 rounded-2xl rounded-br-sm shadow-lg border border-border-muted max-w-[200px] text-center leading-snug">
          Hi I am Zoe!
          <br />
          How can I help you?
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className="w-16 h-16 rounded-full shadow-xl overflow-hidden ring-2 ring-bg-primary ring-offset-2 hover:scale-105 transition-transform"
        aria-label="Open Zoe chatbot"
      >
        <ZoeAvatar className="w-full h-full object-cover" />
      </button>
    </div>
  );
}

import { ChatInput } from '@/components/chat/chat-input';
import { type ChatMessage, MessageBubble } from '@/components/chat/message-bubble';
import { Head } from '@inertiajs/react';
import { Bot, GraduationCap, MessageCircle, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Chatbot Index — Organism/Page Component
 *
 * Halaman utama chatbot yang menggabungkan semua komponen atomik
 * (MessageBubble, ChatInput) dan mengelola state percakapan.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Halaman ini bertindak sebagai 'Organism' dalam Atomic Design, yaitu
 *   kumpulan Molecule dan Atom yang membentuk satu bagian antarmuka yang utuh.
 * - State management menggunakan React useState Hook untuk mengelola
 *   riwayat chat secara lokal, memberikan pengalaman 'Optimistic UI'
 *   di mana pesan pengguna langsung muncul tanpa menunggu respons server.
 * - Komunikasi dengan backend dilakukan via fetch() ke endpoint POST /chatbot
 *   yang telah didefinisikan di Phase 2.
 */

/** Suggestion chips untuk memulai percakapan */
const SUGGESTIONS = [
    { label: 'Jadwal Kuliah', icon: '📅' },
    { label: 'Cara Isi KRS', icon: '📝' },
    { label: 'Info Beasiswa', icon: '🎓' },
    { label: 'Biaya UKT', icon: '💰' },
    { label: 'Info Skripsi', icon: '📚' },
    { label: 'Perpustakaan', icon: '📖' },
];

/** Pesan pembuka dari bot */
const WELCOME_MESSAGE: ChatMessage = {
    id: 'welcome',
    text: 'Halo! 👋 Saya adalah Chatbot Kampus. Saya siap membantu menjawab pertanyaan seputar akademik, administrasi, dan informasi umum kampus.\n\nSilakan ketik pertanyaan Anda atau pilih topik di bawah ini!',
    sender: 'bot',
    timestamp: new Date(),
};

export default function ChatbotIndex() {
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    /** Auto-scroll ke pesan terbaru */
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    /** Kirim pesan ke backend */
    const sendMessage = useCallback(
        async (text?: string) => {
            const messageText = text ?? inputValue.trim();

            if (!messageText || isLoading) return;

            // 1. Tambah pesan user ke riwayat (Optimistic UI)
            const userMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                text: messageText,
                sender: 'user',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setInputValue('');
            setIsLoading(true);

            try {
                // 2. Kirim ke backend via API endpoint
                const response = await fetch('/api/chatbot/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ message: messageText }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                // 3. Tambah respons bot ke riwayat (dengan metadata source)
                const botMessage: ChatMessage = {
                    id: `bot-${Date.now()}`,
                    text: data.data.response,
                    sender: 'bot',
                    timestamp: new Date(),
                    matchedKeywords: data.data.matched_keywords,
                    source: data.data.source,
                };

                setMessages((prev) => [...prev, botMessage]);
            } catch {
                // Error fallback
                const errorMessage: ChatMessage = {
                    id: `error-${Date.now()}`,
                    text: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi. 🔄',
                    sender: 'bot',
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [inputValue, isLoading],
    );

    /** Handle klik suggestion chip */
    const handleSuggestion = (label: string) => {
        sendMessage(label);
    };

    const showSuggestions = messages.length <= 1;

    return (
        <>
            <Head title="Chatbot Kampus" />

            <div className="flex h-dvh flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
                {/* ═══ Header ═══ */}
                <header className="relative border-b border-border/50 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                            <Bot className="size-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                                Chatbot Kampus
                                <Sparkles className="size-3.5 text-amber-500" />
                            </h1>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                                Online • Siap membantu
                            </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 dark:bg-indigo-950/50">
                            <GraduationCap className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                Hybrid AI
                            </span>
                        </div>
                    </div>
                </header>

                {/* ═══ Chat Messages Area ═══ */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-3xl px-4 py-4">
                        {/* Messages */}
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex animate-in fade-in duration-300 items-start justify-start">
                                    <div className="mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm text-white shadow-md">
                                        🤖
                                    </div>
                                    <div className="rounded-2xl rounded-bl-md border border-border/50 bg-card px-4 py-3 shadow-sm dark:bg-muted">
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                                            <div className="size-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                                            <div className="size-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                Bot sedang mengetik...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ═══ Suggestion Chips ═══ */}
                        {showSuggestions && (
                            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <MessageCircle className="size-3.5" />
                                    Pertanyaan populer
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s.label}
                                            type="button"
                                            onClick={() => handleSuggestion(s.label)}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md active:scale-95 dark:bg-slate-800 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/50"
                                        >
                                            <span>{s.icon}</span>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ Input Area ═══ */}
                <div className="mx-auto w-full max-w-3xl">
                    <ChatInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSend={() => sendMessage()}
                        disabled={isLoading}
                    />
                </div>

                {/* ═══ Footer ═══ */}
                <div className="border-t border-border/30 bg-white/50 py-1.5 text-center dark:bg-slate-900/50">
                    <p className="text-[10px] text-muted-foreground">
                        Chatbot Hybrid Pelayanan Akademik • UNISKA MAB
                    </p>
                </div>
            </div>
        </>
    );
}

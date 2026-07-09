import { ChatInput } from '@/components/chat/chat-input';
import { type ChatMessage, MessageBubble } from '@/components/chat/message-bubble';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Bot, GraduationCap, MessageCircle, Sparkles, HelpCircle, X, Star, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Interface untuk flash data dari ChatController
 */
interface PageProps {
    [key: string]: unknown;
    result?: {
        response: string;
        source: 'rule' | 'ai';
        matched_rule_id: number | null;
        similarity_score: number | null;
        matched_keywords?: string[];
        chat_log_id: number | null;
        ai_engine?: 'gemini' | 'ollama' | null;
        is_rag_found?: boolean | null;
    };
}

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

/**
 * ChatWindow — Page Component
 *
 * Menggunakan router.post dari Inertia untuk mengirim pesan dan
 * membaca response dari session flash data. Mendukung feedback 👍/👎
 * pada setiap respon bot untuk evaluasi kepuasan pengguna (Bab IV).
 */
export default function ChatWindow() {
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [messageInput, setMessageInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleClearChat = () => {
        setShowDeleteModal(true);
    };

    const confirmClearChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setShowDeleteModal(false);
    };

    // State untuk Popup Form Peserta Penguji
    const [showParticipantModal, setShowParticipantModal] = useState(false);
    const [participantName, setParticipantName] = useState('');
    const [participantFaculty, setParticipantFaculty] = useState('Fakultas Teknologi Informasi');
    const [participantProdi, setParticipantProdi] = useState('');

    // State untuk Popup Sesi Keluar / Akhiri Sesi
    const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [exitRating, setExitRating] = useState(0);
    const [exitRatingHover, setExitRatingHover] = useState(0);
    const [exitComment, setExitComment] = useState('');
    const [exitProcessing, setExitProcessing] = useState(false);

    useEffect(() => {
        const storedInfo = sessionStorage.getItem('participant_info');
        if (!storedInfo) {
            setShowParticipantModal(true);
        }
    }, []);

    // Intersep Tombol Back Browser
    useEffect(() => {
        // Push state awal untuk menangkap navigasi back pertama kali
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            // Ketika user menekan tombol back, browser akan mencoba mundur ke history sebelumnya.
            // Kita push state kembali agar user tetap berada di halaman ini.
            window.history.pushState(null, '', window.location.href);

            // Tampilkan popup konfirmasi akhiri sesi
            setShowExitConfirmModal(true);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleConfirmExit = () => {
        setShowExitConfirmModal(false);
        setShowFeedbackModal(true);
    };

    const handleCancelExit = () => {
        setShowExitConfirmModal(false);
    };

    const handleSendFeedbackAndExit = async (isSkipped: boolean = false) => {
        const participant = JSON.parse(sessionStorage.getItem('participant_info') || 'null');

        if (!isSkipped && (exitRating > 0 || exitComment.trim() !== '')) {
            setExitProcessing(true);
            try {
                // Post ke endpoint /feedback yang sudah terintegrasi analisis sentimen otomatis
                await axios.post('/feedback', {
                    nama_pelapor: participant?.nama_mahasiswa || 'Responden Uji Coba',
                    npm: '0000000000', // Dummy NPM untuk melewati validasi format regex backend 10-digit
                    kategori_masalah: 'Feedback Sesi',
                    laporan: `Rating: ${exitRating}/5 Bintang. Komentar: ${exitComment.trim() || 'Tidak ada komentar.'}`
                });
            } catch (err) {
                console.error('Gagal mengirim feedback sesi:', err);
            } finally {
                setExitProcessing(false);
            }
        }

        // Hapus participant_info agar sesi berikutnya bersih
        sessionStorage.removeItem('participant_info');

        setShowFeedbackModal(false);
        setShowThankYouModal(true);
    };

    const handleFinalExit = () => {
        setShowThankYouModal(false);
        // Arahkan kembali ke halaman utama uji coba chatbot untuk sesi baru
        window.location.href = '/chat';
    };

    const submitParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!participantName.trim() || !participantProdi.trim()) return;

        sessionStorage.setItem('participant_info', JSON.stringify({
            nama_mahasiswa: participantName.trim(),
            fakultas: participantFaculty,
            prodi: participantProdi.trim(),
        }));
        setShowParticipantModal(false);
    };

    const ticketForm = useForm({
        nama_pelapor: '',
        npm: '',
        kategori_masalah: 'Akademik',
        laporan: '',
    });

    const submitTicket = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation: NPM harus tepat 10 digit angka
        const npmPattern = /^[0-9]{10}$/;
        if (!npmPattern.test(ticketForm.data.npm)) {
            ticketForm.setError('npm', 'Format NPM tidak valid! Harus berupa 10 digit angka (contoh: 2110010123).');
            return;
        }

        ticketForm.post('/feedback', {
            preserveScroll: true,
            onSuccess: () => {
                setIsTicketModalOpen(false);
                ticketForm.reset();
                alert('Tiket bantuan berhasil dikirim! Admin akan segera menindaklanjutinya.');
            },
        });
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    /** Auto-scroll ke pesan terbaru */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /**
     * Handler feedback 👍/👎 — mengirim PATCH ke backend.
     *
     * Catatan Akademis (Skripsi Bab 4):
     * Feedback dikirim secara asinkron via axios (bukan Inertia router)
     * agar tidak me-refresh halaman dan mengganggu sesi chat mahasiswa.
     */
    const handleFeedback = async (chatLogId: number, isHelpful: boolean) => {
        // Optimistic UI: update state dulu sebelum request selesai
        setMessages((prev) =>
            prev.map((msg) =>
                msg.chatLogId === chatLogId ? { ...msg, isHelpful } : msg,
            ),
        );

        try {
            await axios.patch(`/chat/${chatLogId}/feedback`, { is_helpful: isHelpful });
        } catch (error) {
            console.error('Gagal menyimpan feedback:', error);
        }
    };

    /** Kirim pesan ke backend via Inertia router */
    const sendMessage = (text?: string) => {
        const messageText = text ?? messageInput.trim();

        if (!messageText || processing) return;

        // 1. Tambah pesan user ke riwayat (Optimistic UI)
        const optimisticId = `user-${Date.now()}`;
        const userMessage: ChatMessage = {
            id: optimisticId,
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Atur state input box ke kosong
        setMessageInput(text ?? '');

        setProcessing(true);

        // 2. Kirim POST via router
        const participant = JSON.parse(sessionStorage.getItem('participant_info') || 'null');
        router.post(
            '/chat',
            {
                message: messageText,
                nama_mahasiswa: participant?.nama_mahasiswa,
                fakultas: participant?.fakultas,
                prodi: participant?.prodi
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setMessageInput('');

                    const result = (page.props as unknown as PageProps).result;
                    if (result) {
                        const botMessage: ChatMessage = {
                            id: `bot-${Date.now()}`,
                            text: result.response,
                            sender: 'bot',
                            timestamp: new Date(),
                            source: result.source,
                            chatLogId: result.chat_log_id,
                            isHelpful: null,
                            aiEngine: result.ai_engine ?? undefined,
                            isRagFound: result.is_rag_found ?? undefined,
                        };
                        setMessages((prev) => [...prev, botMessage]);
                    }
                },
                onError: (errors) => {
                    console.error('Pesan error:', errors);
                    const errorMessage: ChatMessage = {
                        id: `error-${Date.now()}`,
                        text: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi. 🔄',
                        sender: 'bot',
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <>
            <Head title="Chatbot Kampus UNISKA MAB" />

            <div className="flex h-dvh flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/20">
                {/* ═══ Header ═══ */}
                <header className="relative border-b border-border/50 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
                    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#39b6e7] shadow-lg shadow-[#39b6e7]/25">
                            <Bot className="size-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                                Chatbot Kampus UNISKA
                                <Sparkles className="size-3.5 text-amber-500" />
                            </h1>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                                Online • Siap membantu
                            </p>
                        </div>
                        {messages.length > 1 && (
                            <button
                                onClick={handleClearChat}
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-800/80 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
                                title="Hapus obrolan & mulai sesi baru"
                            >
                                <Trash2 className="size-3.5" />
                                <span className="hidden sm:inline">Hapus Obrolan</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* ═══ Chat Messages Area ═══ */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-3xl px-4 py-4">
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    onFeedback={handleFeedback}
                                    onContactAdmin={() => setIsTicketModalOpen(true)}
                                />
                            ))}

                            {/* Typing indicator */}
                            {processing && (
                                <div className="flex animate-in fade-in items-start justify-start duration-300">
                                    <div className="mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#39b6e7] text-sm text-white shadow-md">
                                        <Bot className="size-4 text-white" />
                                    </div>
                                    <div className="rounded-2xl rounded-bl-md border border-border/50 bg-card px-4 py-3 shadow-sm dark:bg-muted">
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-2 animate-bounce rounded-full bg-blue-400 [animation-delay:0ms]" />
                                            <div className="size-2 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
                                            <div className="size-2 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                Mencari data & berpikir...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ═══ Suggestion Chips ═══ */}
                        {messages.length <= 1 && (
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
                                            onClick={() => sendMessage(s.label)}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:border-[#39b6e7] hover:bg-[#39b6e7]/10 hover:shadow-md active:scale-95 dark:bg-slate-800 dark:hover:border-[#39b6e7] dark:hover:bg-[#39b6e7]/20"
                                        >
                                            <span>{s.icon}</span>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* ═══ Tombol Hubungi Admin (Selalu Muncul) ═══ */}
                        <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
                            <button
                                onClick={() => setIsTicketModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                            >
                                <HelpCircle className="size-4" />
                                Hubungi Admin (Tiket Bantuan)
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ Input Area ═══ */}
                <div className="mx-auto w-full max-w-3xl">
                    <ChatInput
                        value={messageInput}
                        onChange={(val) => setMessageInput(val)}
                        onSend={() => sendMessage()}
                        disabled={processing}
                    />
                </div>

                {/* ═══ Footer ═══ */}
                <div className="border-t border-border/30 bg-white/50 py-1.5 text-center dark:bg-slate-900/50">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Powered by FTI UNISKA MAB © 2026 • All Rights Reserved
                    </p>
                </div>

                {/* ═══ Ticket Modal ═══ */}
                {isTicketModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Buat Tiket Bantuan</h2>
                                <button
                                    onClick={() => setIsTicketModalOpen(false)}
                                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={submitTicket} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        value={ticketForm.data.nama_pelapor}
                                        onChange={e => ticketForm.setData('nama_pelapor', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">NPM</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: 2110010123"
                                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${ticketForm.errors.npm
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-slate-300 focus:border-blue-500 dark:border-slate-600'
                                            }`}
                                        value={ticketForm.data.npm}
                                        onChange={e => {
                                            ticketForm.setData('npm', e.target.value);
                                            if (ticketForm.errors.npm) {
                                                ticketForm.clearErrors('npm');
                                            }
                                        }}
                                    />
                                    {ticketForm.errors.npm && (
                                        <p className="mt-1 text-xs text-red-500 font-semibold">{ticketForm.errors.npm}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Kategori Masalah</label>
                                    <select
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        value={ticketForm.data.kategori_masalah}
                                        onChange={e => ticketForm.setData('kategori_masalah', e.target.value)}
                                    >
                                        <option value="Akademik">Akademik & KRS</option>
                                        <option value="Keuangan">Keuangan & UKT</option>
                                        <option value="Sistem">Sistem & Login</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Isi Laporan / Keluhan</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        value={ticketForm.data.laporan}
                                        onChange={e => ticketForm.setData('laporan', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsTicketModalOpen(false)}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={ticketForm.processing}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {ticketForm.processing ? 'Mengirim...' : 'Kirim Tiket'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ═══ Participant Modal ═══ */}
                {showParticipantModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all duration-300 animate-in zoom-in-95 duration-200">
                            <div className="text-center mb-6">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 mb-3">
                                    <GraduationCap className="size-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Formulir Uji Coba Chatbot</h2>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    Silakan lengkapi data diri Anda sebelum mencoba chatbot pelayanan akademik. Data ini digunakan untuk pencatatan responden pada lampiran Skripsi.
                                </p>
                            </div>

                            <form onSubmit={submitParticipant} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nama Lengkap Mahasiswa</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Budi Santoso"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all"
                                        value={participantName}
                                        onChange={e => setParticipantName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fakultas</label>
                                    <select
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all"
                                        value={participantFaculty}
                                        onChange={e => setParticipantFaculty(e.target.value)}
                                    >
                                        <option value="Fakultas Teknologi Informasi">Fakultas Teknologi Informasi (FTI)</option>
                                        <option value="Fakultas Teknik">Fakultas Teknik (FT)</option>
                                        <option value="Fakultas Ekonomi">Fakultas Ekonomi (FE)</option>
                                        <option value="Fakultas Hukum">Fakultas Hukum (FH)</option>
                                        <option value="Fakultas Ilmu Sosial & Ilmu Politik">Fakultas Ilmu Sosial & Ilmu Politik (FISIP)</option>
                                        <option value="Fakultas Keguruan & Ilmu Pendidikan">Fakultas Keguruan & Ilmu Pendidikan (FKIP)</option>
                                        <option value="Fakultas Pertanian">Fakultas Pertanian (FAPERTA)</option>
                                        <option value="Fakultas Kesehatan Masyarakat">Fakultas Kesehatan Masyarakat (FKM)</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Program Studi (Prodi)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Teknik Informatika"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all"
                                        value={participantProdi}
                                        onChange={e => setParticipantProdi(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-[0.98] transition-all"
                                >
                                    Mulai Uji Coba Chatbot
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ═══ Exit Confirmation Modal ═══ */}
                {showExitConfirmModal && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center animate-in zoom-in-95 duration-200">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 mb-4">
                                <HelpCircle className="size-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Akhiri Sesi Uji Coba?</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Apakah Anda yakin ingin mengakhiri sesi percakapan chatbot ini sekarang?
                            </p>
                            <div className="mt-6 flex justify-center gap-3">
                                <button
                                    onClick={handleCancelExit}
                                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Tidak
                                </button>
                                <button
                                    onClick={handleConfirmExit}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:from-red-600 hover:to-amber-700 transition-all"
                                >
                                    Ya
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Feedback Modal ═══ */}
                {showFeedbackModal && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                            <div className="text-center mb-6">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 mb-3">
                                    <Sparkles className="size-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Beri Komentar & Nilai</h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Bantu pengembang dengan memberikan ulasan singkat (opsional) terhadap prototype chatbot pelayanan akademik ini.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* Rating Stars */}
                                <div className="text-center">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nilai Prototype</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setExitRating(star)}
                                                onMouseEnter={() => setExitRatingHover(star)}
                                                onMouseLeave={() => setExitRatingHover(0)}
                                                className="text-amber-400 transition-transform active:scale-90 duration-100 hover:scale-110"
                                            >
                                                <Star
                                                    className="size-8"
                                                    fill={star <= (exitRatingHover || exitRating) ? 'currentColor' : 'none'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {exitRating > 0 && (
                                        <p className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 animate-in fade-in">
                                            {exitRating === 5 && 'Sangat Bagus! 😍'}
                                            {exitRating === 4 && 'Bagus! 😊'}
                                            {exitRating === 3 && 'Cukup! 😐'}
                                            {exitRating === 2 && 'Kurang! 🙁'}
                                            {exitRating === 1 && 'Sangat Kurang! 😡'}
                                        </p>
                                    )}
                                </div>

                                {/* Comment Textarea */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Saran & Ulasan</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Tuliskan saran atau komentar Anda di sini..."
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all resize-none"
                                        value={exitComment}
                                        onChange={e => setExitComment(e.target.value)}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleSendFeedbackAndExit(true)}
                                        disabled={exitProcessing}
                                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                    >
                                        Lewati & Keluar
                                    </button>
                                    <button
                                        onClick={() => handleSendFeedbackAndExit(false)}
                                        disabled={exitProcessing}
                                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                                    >
                                        {exitProcessing ? 'Mengirim...' : 'Kirim & Keluar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Thank You / Exit Modal ═══ */}
                {showThankYouModal && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center animate-in zoom-in-95 duration-200">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 mb-4 animate-bounce">
                                🌟
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Uji Coba Selesai!</h3>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Terima kasih sudah mencoba prototype chatbot ini. Saran dan hasil uji coba Anda sangat membantu pengembang untuk menyempurnakan sistem ini lebih lanjut. 🙏
                            </p>
                            <button
                                onClick={handleFinalExit}
                                className="w-full mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ Modal Validasi Hapus Percakapan ═══ */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <Trash2 className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                        Konfirmasi Hapus Obrolan
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Validasi reset riwayat chat sesi ini.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Apakah anda ingin menghapus percakapan/chat ini?
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmClearChat}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Ya, Hapus</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

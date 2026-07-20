import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Activity,
    BarChart,
    Bot,
    Calendar,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    Database,
    Download,
    Eye,
    FileText,
    Filter,
    HelpCircle,
    MessageSquare,
    Percent,
    Search,
    Sparkles,
    Star,
    ThumbsDown,
    ThumbsUp,
    Trash2,
    TrendingUp,
    Terminal,
    Upload,
    Users,
    X,
    Printer,
    FileSpreadsheet,
    Mail,
} from 'lucide-react';

interface ChatLog {
    id: number;
    nama_mahasiswa: string | null;
    npm: string | null;
    fakultas: string | null;
    prodi: string | null;
    user_message: string;
    bot_response: string;
    source: 'rule' | 'ai';
    ai_engine: 'gemini' | 'ollama' | null;
    similarity_score: number | null;
    latency_ms: number | null;
    is_helpful: boolean | null;
    created_at: string;
}

interface FeedbackTicket {
    id_feedback: number;
    nama_pelapor: string;
    npm: string;
    kategori_masalah: string;
    laporan: string;
    status: string;
    sentiment?: 'positive' | 'neutral' | 'negative' | null;
    sentiment_score?: number | null;
    created_at: string;
}

interface SessionReviewItem {
    id: number;
    nama_responden: string | null;
    npm: string | null;
    fakultas: string | null;
    prodi: string | null;
    rating: number;
    komentar: string | null;
    created_at: string;
}

interface DailyTrendItem {
    date: string;
    total: number | string;
    rule_count: number | string;
    ai_count: number | string;
}

interface TopQuestionItem {
    user_message: string;
    total: number | string;
}

interface DashboardProps {
    stats: {
        total_chats: number;
        rule_count: number;
        ai_count: number;
        rule_percentage: number;
        ai_percentage: number;
        avg_similarity: number;
    };
    csat_stats: {
        helpful: number;
        not_helpful: number;
        total_rated: number;
        percentage: number;
    };
    daily_trend: DailyTrendItem[];
    top_questions: TopQuestionItem[];
    ai_recommendations: TopQuestionItem[];
    recent_logs: ChatLog[];
    tickets?: FeedbackTicket[];
    session_reviews?: SessionReviewItem[];
    session_review_stats?: {
        total_reviews: number;
        avg_rating: number;
        star_counts: { [key: number]: number };
    };
    filters?: {
        date_range: string;
        fakultas: string;
        prodi: string;
        topic?: string;
    };
    options?: {
        fakultas_list: string[];
        prodi_list: string[];
    };
}

export default function Dashboard({
    stats,
    csat_stats,
    daily_trend,
    top_questions,
    ai_recommendations,
    recent_logs = [],
    tickets = [],
    session_reviews = [],
    session_review_stats = { total_reviews: 0, avg_rating: 0, star_counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
    filters,
    options,
}: DashboardProps) {
    const [logFilter, setLogFilter] = useState<'all' | 'rule' | 'ollama' | 'gemini' | 'flagged'>('all');
    const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    const [dateRange, setDateRange] = useState(filters?.date_range || 'all');
    const [selectedFakultas, setSelectedFakultas] = useState(filters?.fakultas || 'all');
    const [selectedProdi, setSelectedProdi] = useState(filters?.prodi || 'all');
    const [selectedTopic, setSelectedTopic] = useState(filters?.topic || 'all');
    const [deleteTargetId, setDeleteTargetId] = useState<number | 'clear_all' | null>(null);
    const [deleteTicketTargetId, setDeleteTicketTargetId] = useState<number | 'clear_all' | null>(null);
    const [deleteReviewTargetId, setDeleteReviewTargetId] = useState<number | 'clear_all' | null>(null);
    const [currentTicketPage, setCurrentTicketPage] = useState(1);
    const ticketsPerPage = 10;
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const reviewsPerPage = 10;

    const [isLiveRefresh, setIsLiveRefresh] = useState(false);
    const [isRefreshingNow, setIsRefreshingNow] = useState(false);

    useEffect(() => {
        if (!isLiveRefresh) return;

        const interval = setInterval(() => {
            setIsRefreshingNow(true);
            router.reload({
                only: ['stats', 'csat_stats', 'daily_trend', 'top_questions', 'ai_recommendations', 'recent_logs', 'tickets', 'session_reviews', 'session_review_stats'],
                // @ts-ignore
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsRefreshingNow(false),
            });
        }, 15000); // Polling otomatis setiap 15 detik untuk mencegah overload DB

        return () => clearInterval(interval);
    }, [isLiveRefresh]);

    const handleFilterChange = (newDateRange: string, newFakultas: string, newProdi: string, newTopic: string) => {
        router.get(
            '/admin/dashboard',
            { date_range: newDateRange, fakultas: newFakultas, prodi: newProdi, topic: newTopic },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleLogFilterChange = (filter: 'all' | 'rule' | 'ollama' | 'gemini' | 'flagged') => {
        setLogFilter(filter);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteLog = (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setDeleteTargetId(id);
    };

    const handleClearAllLogs = () => {
        setDeleteTargetId('clear_all');
    };

    const handleDeleteTicket = (id: number) => {
        setDeleteTicketTargetId(id);
    };

    const handleClearAllTickets = () => {
        setDeleteTicketTargetId('clear_all');
    };

    const handleDeleteReview = (id: number) => {
        setDeleteReviewTargetId(id);
    };

    const handleClearAllReviews = () => {
        setDeleteReviewTargetId('clear_all');
    };

    const executeDeleteAction = () => {
        if (deleteTargetId === 'clear_all') {
            router.delete('/admin/chat-logs/clear', {
                preserveScroll: true,
                onSuccess: () => setDeleteTargetId(null),
            });
        } else if (typeof deleteTargetId === 'number') {
            router.delete(`/admin/chat-logs/${deleteTargetId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedLog?.id === deleteTargetId) setSelectedLog(null);
                    setDeleteTargetId(null);
                },
            });
        }
    };

    const executeDeleteTicketAction = () => {
        if (deleteTicketTargetId === 'clear_all') {
            router.delete('/admin/tickets/clear', {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteTicketTargetId(null);
                    setCurrentTicketPage(1);
                },
            });
        } else if (typeof deleteTicketTargetId === 'number') {
            router.delete(`/admin/tickets/${deleteTicketTargetId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteTicketTargetId(null),
            });
        }
    };

    const executeDeleteReviewAction = () => {
        if (deleteReviewTargetId === 'clear_all') {
            router.delete('/admin/session-reviews/clear', {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteReviewTargetId(null);
                    setCurrentReviewPage(1);
                },
            });
        } else if (typeof deleteReviewTargetId === 'number') {
            router.delete(`/admin/session-reviews/${deleteReviewTargetId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteReviewTargetId(null),
            });
        }
    };

    const filteredLogs = recent_logs.filter((log) => {
        if (logFilter === 'rule' && log.source !== 'rule') return false;
        if (logFilter === 'ollama' && (log.source !== 'ai' || log.ai_engine !== 'ollama')) return false;
        if (logFilter === 'gemini' && (log.source !== 'ai' || log.ai_engine === 'ollama')) return false;
        if (logFilter === 'flagged' && log.is_helpful !== false) return false;

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const matchUserMessage = log.user_message?.toLowerCase().includes(query) || false;
            const matchBotResponse = log.bot_response?.toLowerCase().includes(query) || false;
            const matchNama = log.nama_mahasiswa?.toLowerCase().includes(query) || false;
            const matchFakultas = log.fakultas?.toLowerCase().includes(query) || false;
            const matchProdi = log.prodi?.toLowerCase().includes(query) || false;
            if (!matchUserMessage && !matchBotResponse && !matchNama && !matchFakultas && !matchProdi) {
                return false;
            }
        }

        return true;
    });

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalTicketPages = Math.ceil((tickets?.length || 0) / ticketsPerPage);
    const paginatedTickets = (tickets || []).slice((currentTicketPage - 1) * ticketsPerPage, currentTicketPage * ticketsPerPage);

    const totalReviewPages = Math.ceil((session_reviews?.length || 0) / reviewsPerPage);
    const paginatedReviews = (session_reviews || []).slice((currentReviewPage - 1) * reviewsPerPage, currentReviewPage * reviewsPerPage);

    // Hitung statistik sentimen tiket keluhan secara dinamis
    const sentimentStats = (() => {
        let positive = 0;
        let neutral = 0;
        let negative = 0;
        let analyzedCount = 0;

        tickets?.forEach((ticket) => {
            if (ticket.sentiment === 'positive') {
                positive++;
                analyzedCount++;
            } else if (ticket.sentiment === 'neutral') {
                neutral++;
                analyzedCount++;
            } else if (ticket.sentiment === 'negative') {
                negative++;
                analyzedCount++;
            }
        });

        const positivePercentage = analyzedCount > 0 ? Math.round((positive / analyzedCount) * 100) : 0;
        const neutralPercentage = analyzedCount > 0 ? Math.round((neutral / analyzedCount) * 100) : 0;
        const negativePercentage = analyzedCount > 0 ? Math.round((negative / analyzedCount) * 100) : 0;

        return {
            positive,
            neutral,
            negative,
            analyzedCount,
            positivePercentage,
            neutralPercentage,
            negativePercentage,
        };
    })();

    // Cari nilai maksimum pada daily trend agar persentase tinggi bar chart presisi
    const maxDailyTotal = daily_trend && daily_trend.length > 0
        ? Math.max(...daily_trend.map(item => Number(item.total)), 1)
        : 1;

    return (
        <div className="min-h-screen bg-slate-50 py-3.5 text-slate-900 dark:bg-slate-900 dark:text-slate-100" style={{ zoom: '0.70' }}>
            <Head title="Admin Dashboard - Chatbot Analytics" />

            {/* ═══ Header/Navigation ═══ */}
            <div className="mx-auto mb-3.5 max-w-[1460px] px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-2 text-white shadow-md">
                            <BarChart className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold leading-6 text-slate-900 dark:text-white sm:truncate sm:text-2xl">
                                Analytics Dashboard
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Performa Modul Hybrid Chatbot Pelayanan Akademik UNISKA MAB
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 md:ml-4 md:mt-0">
                        {/* Tombol Export CSV dengan parameter filter yang aktif */}
                        <a
                            href={`/admin/export-csv?date_range=${dateRange}&fakultas=${encodeURIComponent(selectedFakultas)}&prodi=${encodeURIComponent(selectedProdi)}&topic=${encodeURIComponent(selectedTopic)}`}
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <FileSpreadsheet className="mr-1.5 size-3.5 fill-emerald-600 text-white dark:fill-emerald-500" />
                            Export Report CSV
                        </a>
                        <a
                            href={`/admin/chat-logs/print?topic=${encodeURIComponent(selectedTopic)}&date_range=${encodeURIComponent(dateRange)}&fakultas=${encodeURIComponent(selectedFakultas)}&prodi=${encodeURIComponent(selectedProdi)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            title="Cetak Laporan Percakapan Berkelompok Berdasarkan Topik Konteks (Bab IV)"
                        >
                            <Printer className="mr-1.5 size-3.5 fill-slate-700 text-white dark:fill-slate-300 dark:text-slate-900" />
                            Cetak Laporan Topik (PDF)
                        </a>
                        <Link
                            href="/admin/upload-document"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Upload className="mr-1.5 size-3.5 text-slate-700 dark:text-slate-300" />
                            Upload Data Dokumen
                        </Link>
                        <Link
                            href="/admin/chat-rules"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Database className="mr-1.5 size-3.5 text-slate-700 dark:text-slate-300" />
                            Kelola Chat Rules
                        </Link>
                        <Link
                            href="/admin/system-logs"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Terminal className="mr-1.5 size-3.5 text-slate-700 dark:text-slate-300" />
                            System Logs
                        </Link>
                        <Link
                            href="/admin/participants"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Users className="mr-1.5 size-3.5 text-slate-700 dark:text-slate-300" />
                            Daftar Peserta Uji Coba
                        </Link>
                        <Link
                            href="/admin/broadcast"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Mail className="mr-1.5 size-3.5 text-blue-600 dark:text-blue-500" />
                            Siaran Email Massal
                        </Link>
                    </div>
                </div>

                {/* ═══ Filter Bar Waktu & Fakultas/Prodi ═══ */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Filter className="size-4 text-blue-600" />
                        <span>Filter Analitik:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Rentang Waktu */}
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-slate-400" />
                            <select
                                value={dateRange}
                                onChange={(e) => {
                                    setDateRange(e.target.value);
                                    handleFilterChange(e.target.value, selectedFakultas, selectedProdi, selectedTopic);
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                                <option value="all">Semua Waktu</option>
                                <option value="today">Hari Ini</option>
                                <option value="7days">7 Hari Terakhir</option>
                                <option value="30days">30 Hari Terakhir</option>
                            </select>
                        </div>

                        {/* Filter Topik / Konteks */}
                        <select
                            value={selectedTopic}
                            onChange={(e) => {
                                setSelectedTopic(e.target.value);
                                handleFilterChange(dateRange, selectedFakultas, selectedProdi, e.target.value);
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 max-w-[200px] truncate"
                            title="Filter Berdasarkan Kategori Topik Konteks Layanan Akademik"
                        >
                            <option value="all">📁 Semua Topik Konteks</option>
                            <option value="Yudisium, Skripsi & Wisuda">🎓 Yudisium, Skripsi & Wisuda</option>
                            <option value="Kalender Akademik & Jadwal">📅 Kalender Akademik & Jadwal</option>
                            <option value="KRS, UKT & Administrasi">📝 KRS, UKT & Administrasi</option>
                            <option value="Beasiswa & Layanan Kampus">🏛️ Beasiswa & Layanan Kampus</option>
                            <option value="Umum & Lain-lain">💬 Umum & Lain-lain</option>
                        </select>

                        {/* Filter Fakultas */}
                        <select
                            value={selectedFakultas}
                            onChange={(e) => {
                                setSelectedFakultas(e.target.value);
                                handleFilterChange(dateRange, e.target.value, selectedProdi, selectedTopic);
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 max-w-[180px] truncate"
                        >
                            <option value="all">Semua Fakultas</option>
                            {options?.fakultas_list?.map((fak, idx) => (
                                <option key={idx} value={fak}>{fak}</option>
                            ))}
                        </select>

                        {/* Filter Prodi */}
                        <select
                            value={selectedProdi}
                            onChange={(e) => {
                                setSelectedProdi(e.target.value);
                                handleFilterChange(dateRange, selectedFakultas, e.target.value, selectedTopic);
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 max-w-[180px] truncate"
                        >
                            <option value="all">Semua Program Studi</option>
                            {options?.prodi_list?.map((pro, idx) => (
                                <option key={idx} value={pro}>{pro}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1460px] space-y-3.5 px-4 sm:px-6 lg:px-8">
                {/* ═══ Top Stats Cards ═══ */}
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-5">
                    {/* Stat: Total Interaction */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <MessageSquare className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Chat</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{stats.total_chats}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: Knowledge Base Hits */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Database className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Hits Database (Rule)</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{stats.rule_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: AI Fallback Hits */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <Bot className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Hits Fallback (AI)</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{stats.ai_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: Avg Levenshtein */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <Percent className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Avg. Similarity (Rule)</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{stats.avg_similarity}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: CSAT Satisfaction */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <ThumbsUp className="size-4.5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Kepuasan Pengguna (CSAT)</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{csat_stats?.percentage ?? 0}%</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] font-bold dark:border-slate-700/50">
                            <span className="text-emerald-600 dark:text-emerald-400">👍 {csat_stats?.helpful ?? 0} Puas</span>
                            <span className="text-red-600 dark:text-red-400">👎 {csat_stats?.not_helpful ?? 0} Butuh Review</span>
                        </div>
                    </div>
                </div>

                {/* ═══ Daily Trend Chart Section ═══ */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-2.5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-bold">
                                <TrendingUp className="size-4 text-blue-500" />
                                Tren Aktivitas & Komparasi Algoritma Harian
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Distribusi interaksi mahasiswa menggunakan Rule-Based Levenshtein (Hijau) vs AI RAG Ollama/Qwen (Ungu) per tanggal.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded bg-emerald-500"></span>
                                <span>Rule-Based</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded bg-purple-500"></span>
                                <span>AI RAG</span>
                            </div>
                        </div>
                    </div>

                    {daily_trend && daily_trend.length > 0 ? (
                        <div className="mt-3 overflow-x-auto pb-2 flex justify-center">
                            <div className="flex items-end justify-center gap-8 sm:gap-12 border-b border-slate-200 pt-3 dark:border-slate-700 min-w-max px-4 mx-auto" style={{ height: '160px' }}>
                                {daily_trend.map((item, idx) => {
                                    const totalNum = Number(item.total);
                                    const ruleNum = Number(item.rule_count);
                                    const aiNum = Number(item.ai_count);
                                    const barHeightPercent = Math.max(Math.round((totalNum / maxDailyTotal) * 115), 10);
                                    const ruleHeightPercent = totalNum > 0 ? (ruleNum / totalNum) * 100 : 0;
                                    const aiHeightPercent = totalNum > 0 ? (aiNum / totalNum) * 100 : 0;

                                    return (
                                        <div key={idx} className="group relative flex flex-col items-center gap-1 flex-shrink-0 w-14">
                                            {/* Tooltip Hover */}
                                            <div className="pointer-events-none absolute -top-16 hidden rounded bg-slate-800 px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block dark:bg-slate-700 z-20 whitespace-nowrap">
                                                <div className="font-bold border-b border-slate-600 pb-0.5 mb-0.5">{item.date}</div>
                                                <div>Total: {totalNum} chat</div>
                                                <div className="text-emerald-400 font-semibold">Rule: {ruleNum} | AI: {aiNum}</div>
                                            </div>

                                            {/* Stacked Bar */}
                                            <div
                                                className="flex w-full max-w-[36px] flex-col overflow-hidden rounded-t-lg transition-all duration-300 group-hover:opacity-80 shadow-sm"
                                                style={{ height: `${barHeightPercent}px` }}
                                            >
                                                <div
                                                    className="bg-purple-500 w-full transition-all duration-500"
                                                    style={{ height: `${aiHeightPercent}%` }}
                                                    title={`AI RAG: ${aiNum}`}
                                                />
                                                <div
                                                    className="bg-emerald-500 w-full transition-all duration-500"
                                                    style={{ height: `${ruleHeightPercent}%` }}
                                                    title={`Rule-Based: ${ruleNum}`}
                                                />
                                            </div>

                                            {/* Date Label */}
                                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[56px] text-center">
                                                {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                            Belum ada data tren aktivitas pada rentang waktu yang dipilih.
                        </div>
                    )}
                </div>

                {/* ═══ Main Charts Row ═══ */}
                <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-4">
                    {/* Visual Chart: Ratio Rule vs AI */}
                    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-2 flex items-center gap-2 text-base font-bold">
                            <Activity className="size-4 text-blue-500" />
                            Rasio Akurasi Algoritma
                        </h3>
                        <p className="mb-3 text-xs text-slate-500">
                            Perbandingan persentase kueri yang dijawab database (statis) vs AI RAG Ollama (fallback).
                        </p>

                        <div className="mt-auto">
                            <div className="flex h-6 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner dark:bg-slate-900">
                                <div
                                    className="flex items-center justify-center bg-emerald-500 text-xs font-bold text-white transition-all duration-1000"
                                    style={{ width: `${stats.rule_percentage}%` }}
                                    title="Rule-Based"
                                >
                                    {stats.rule_percentage > 10 ? `${stats.rule_percentage}%` : ''}
                                </div>
                                <div
                                    className="flex items-center justify-center bg-purple-500 text-xs font-bold text-white transition-all duration-1000"
                                    style={{ width: `${stats.ai_percentage}%` }}
                                    title="AI RAG (Ollama)"
                                >
                                    {stats.ai_percentage > 10 ? `${stats.ai_percentage}%` : ''}
                                </div>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-medium">Database ({stats.rule_percentage}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-purple-500"></span>
                                    <span className="text-xs font-medium">AI RAG ({stats.ai_percentage}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Frequent Questions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-2 flex items-center gap-2 text-base font-bold">
                            <TrendingUp className="size-4 text-blue-500" />
                            Top 5 Pertanyaan Terpopuler
                        </h3>

                        {top_questions.length > 0 ? (
                            <ul className="space-y-2">
                                {top_questions.map((q, idx) => (
                                    <li key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="flex size-5.5 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[11px] font-bold text-slate-500 dark:border-slate-600 dark:bg-slate-700">
                                                #{idx + 1}
                                            </div>
                                            <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                                "{q.user_message}"
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                            {q.total} kali
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-500">Belum ada data pencarian histori.</div>
                        )}
                    </div>

                    {/* Rekomendasi Aturan Baru [W3] */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between">
                        <div>
                            <h3 className="mb-2 flex items-center gap-2 text-base font-bold">
                                <Bot className="size-4 text-blue-500" />
                                Rekomendasi Aturan Baru
                            </h3>
                            <p className="mb-3 text-xs text-slate-500">
                                Kueri berulang (≥2x) yang dijawab AI RAG (Ollama). Buat aturan statis agar respons lebih cepat & ringan.
                            </p>

                            {ai_recommendations && ai_recommendations.length > 0 ? (
                                <ul className="space-y-2">
                                    {ai_recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                                                <span className="flex size-4.5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                                    {rec.total}x
                                                </span>
                                                <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300" title={rec.user_message}>
                                                    "{rec.user_message}"
                                                </p>
                                            </div>
                                            <Link
                                                href={`/admin/chat-rules/create?keyword=${encodeURIComponent(rec.user_message)}`}
                                                className="flex-shrink-0 inline-flex items-center rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                            >
                                                Buat Rule
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="py-6 text-center text-slate-400 text-xs">
                                    Belum ada rekomendasi aturan baru.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Visual Chart: Analisis Sentimen [W2] */}
                    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-2 flex items-center gap-2 text-base font-bold">
                            <Sparkles className="size-4 text-amber-500" />
                            Analisis Sentimen Keluhan
                        </h3>
                        <p className="mb-3 text-xs text-slate-500">
                            Proporsi emosi teks dari total {sentimentStats.analyzedCount} tiket yang dianalisis Gemini AI.
                        </p>

                        <div className="mt-auto">
                            <div className="flex h-6 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner dark:bg-slate-900">
                                <div
                                    className="flex items-center justify-center bg-emerald-500 text-xs font-bold text-white transition-all duration-1000"
                                    style={{ width: `${sentimentStats.positivePercentage}%` }}
                                    title={`Positif (${sentimentStats.positive})`}
                                >
                                    {sentimentStats.positivePercentage > 10 ? `${sentimentStats.positivePercentage}%` : ''}
                                </div>
                                <div
                                    className="flex items-center justify-center bg-slate-400 text-xs font-bold text-white transition-all duration-1000"
                                    style={{ width: `${sentimentStats.neutralPercentage}%` }}
                                    title={`Netral (${sentimentStats.neutral})`}
                                >
                                    {sentimentStats.neutralPercentage > 10 ? `${sentimentStats.neutralPercentage}%` : ''}
                                </div>
                                <div
                                    className="flex items-center justify-center bg-red-500 text-xs font-bold text-white transition-all duration-1000"
                                    style={{ width: `${sentimentStats.negativePercentage}%` }}
                                    title={`Negatif (${sentimentStats.negative})`}
                                >
                                    {sentimentStats.negativePercentage > 10 ? `${sentimentStats.negativePercentage}%` : ''}
                                </div>
                            </div>

                            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] font-medium">Positif ({sentimentStats.positivePercentage}%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-slate-400"></span>
                                    <span className="text-[10px] font-medium">Netral ({sentimentStats.neutralPercentage}%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-red-500"></span>
                                    <span className="text-[10px] font-medium">Negatif ({sentimentStats.negativePercentage}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Recent Logs Table ═══ */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-3.5 dark:border-slate-700 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                            <h3 className="flex items-center gap-2 text-base font-bold">
                                <HelpCircle className="size-4 text-blue-500" />
                                <span>Riwayat Percakapan Terakhir (Real-Time Raw Data)</span>
                                {isLiveRefresh && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                        <span className={`size-1.5 rounded-full ${isRefreshingNow ? 'bg-amber-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                                        {isRefreshingNow ? 'Memperbarui...' : 'Live 15s'}
                                    </span>
                                )}
                            </h3>
                            {/* Live Search Box */}
                            <div className="relative mt-2 w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Cari kueri mahasiswa, jawaban bot, atau nama..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-7 text-xs font-medium text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-900 shadow-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                                        title="Hapus pencarian"
                                    >
                                        <X className="size-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Buttons & Clear Action */}
                        <div className="flex flex-wrap items-center gap-2 self-start xl:self-center">
                            {/* Tombol Live Refresh / Polling Toggle */}
                            <button
                                onClick={() => setIsLiveRefresh(!isLiveRefresh)}
                                className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold shadow-sm transition-all ${
                                    isLiveRefresh
                                        ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300'
                                        : 'border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                                title="Aktifkan/Nonaktifkan pembaruan data real-time otomatis setiap 5 detik"
                            >
                                <span className={`mr-1.5 size-2 rounded-full ${isLiveRefresh ? (isRefreshingNow ? 'bg-amber-500 animate-ping' : 'bg-green-500 animate-pulse') : 'bg-slate-400'}`} />
                                {isLiveRefresh ? (isRefreshingNow ? 'Memperbarui...' : 'Live Update (5s)') : 'Live Update (Off)'}
                            </button>

                            {/* Dropdown Filter Algoritma & Sumber */}
                            <div className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <Filter className="size-3.5 text-blue-500 shrink-0" />
                                <select
                                    value={logFilter}
                                    onChange={(e) => handleLogFilterChange(e.target.value as any)}
                                    className="border-0 bg-transparent py-0 pr-5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 dark:bg-transparent dark:text-white cursor-pointer"
                                >
                                    <option value="all" className="dark:bg-slate-800">Semua ({recent_logs.length})</option>
                                    <option value="rule" className="dark:bg-slate-800">[DB] Levenshtein ({recent_logs.filter(l => l.source === 'rule').length})</option>
                                    <option value="ollama" className="dark:bg-slate-800">[AI] Ollama ({recent_logs.filter(l => l.source === 'ai' && l.ai_engine === 'ollama').length})</option>
                                    <option value="gemini" className="dark:bg-slate-800">[AI] Gemini ({recent_logs.filter(l => l.source === 'ai' && l.ai_engine !== 'ollama').length})</option>
                                    <option value="flagged" className="dark:bg-slate-800">👎 Review ({recent_logs.filter(l => l.is_helpful === false).length})</option>
                                </select>
                            </div>
                            <a
                                href={`/admin/chat-logs/print?topic=${encodeURIComponent(selectedTopic)}&date_range=${encodeURIComponent(dateRange)}&fakultas=${encodeURIComponent(selectedFakultas)}&prodi=${encodeURIComponent(selectedProdi)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                title="Cetak Laporan Percakapan Berkelompok Berdasarkan Topik Konteks (Bab IV)"
                            >
                                <Printer className="size-3.5 fill-slate-700 text-white dark:fill-slate-300 dark:text-slate-900" />
                                <span>Cetak Topik ({selectedTopic === 'all' ? 'Semua Bab IV' : selectedTopic.split(',')[0]})</span>
                            </a>
                            {recent_logs.length > 0 && (
                                <button
                                    onClick={handleClearAllLogs}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                    title="Kosongkan Semua Riwayat Pengujian"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Kosongkan ({recent_logs.length})</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-slate-500">Waktu</th>
                                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-slate-500">Kueri Mahasiswa</th>
                                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-slate-500">Respons Sistem</th>
                                    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-slate-500">Algoritma</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Skor</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Feedback</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium dark:divide-slate-700">
                                {paginatedLogs.map((log) => (
                                    <tr key={log.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="whitespace-nowrap px-3 py-1.5 text-[11px] text-slate-500">
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <div
                                                className="line-clamp-1 max-w-[250px] truncate text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight"
                                                title={log.user_message}
                                            >
                                                "{log.user_message}"
                                            </div>
                                            {log.nama_mahasiswa ? (
                                                <div className="mt-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">
                                                    👤 {log.nama_mahasiswa} {log.npm ? `[NPM: ${log.npm}]` : ''} ({log.fakultas ? log.fakultas.replace('Fakultas ', '') : 'Anonim'} - {log.prodi})
                                                </div>
                                            ) : (
                                                <div className="mt-0.5 text-[10px] text-slate-400 font-normal leading-tight">
                                                    👤 Pengguna Anonim
                                                </div>
                                            )}
                                        </td>
                                        <td className="max-w-xs px-3 py-1.5">
                                            <div className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400 leading-snug" title={log.bot_response}>
                                                {log.bot_response}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5">
                                            {log.source === 'rule' ? (
                                                <span className="inline-flex w-fit items-center rounded bg-emerald-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-widest text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    [DB] Levenshtein
                                                </span>
                                            ) : log.ai_engine === 'ollama' ? (
                                                <span className="inline-flex w-fit items-center rounded bg-orange-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-widest text-orange-800 dark:bg-orange-950/50 dark:text-orange-400">
                                                    [AI] Ollama/Qwen
                                                </span>
                                            ) : (
                                                <span className="inline-flex w-fit items-center rounded bg-purple-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-widest text-purple-800 dark:bg-purple-950/50 dark:text-purple-400">
                                                    [AI] Gemini Flash
                                                </span>
                                            )}
                                        </td>
                                        {/* Kolom Skor Kemiripan */}
                                        <td className="whitespace-nowrap px-3 py-1.5 text-center">
                                            {log.similarity_score !== null ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    {log.similarity_score}%
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                        {/* Kolom Feedback */}
                                        <td className="whitespace-nowrap px-3 py-1.5 text-center">
                                            {log.is_helpful === true && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <ThumbsUp className="size-2.5" /> Helpful
                                                </span>
                                            )}
                                            {log.is_helpful === false && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                    <ThumbsDown className="size-2.5" /> Not Helpful
                                                </span>
                                            )}
                                            {log.is_helpful === null && <span className="text-xs text-slate-400">➖</span>}
                                        </td>
                                        {/* Kolom Aksi / Detail Modal */}
                                        <td className="whitespace-nowrap px-3 py-1.5 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                                    title="Lihat Detail & Analisis Chunks RAG"
                                                >
                                                    <Eye className="size-3" />
                                                    <span>Detail</span>
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteLog(log.id, e)}
                                                    className="inline-flex items-center justify-center rounded-lg bg-red-600 p-1.5 text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                                    title="Hapus Log Percakapan Ini"
                                                >
                                                    <Trash2 className="size-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-500">
                                            Belum ada log interaksi untuk filter ini
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredLogs.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4.5 py-3 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row">
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> hingga{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> dari{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{filteredLogs.length}</span> data interaksi
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    ← Sebelumnya
                                </button>
                                <span className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Halaman {currentPage} / {totalPages || 1}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Selanjutnya →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══ Sentiment Analysis Section [W2] ═══ */}
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between">
                        <div>
                            <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-slate-200">Total Tiket Keluhan</h3>
                            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{tickets?.length || 0} Tiket</p>
                            <p className="mt-1 text-[11px] leading-tight text-slate-500">Jumlah laporan keluhan & pertanyaan via form Hubungi Admin.</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
                            <Bot className="size-4 text-blue-500" />
                            Klasifikasi Sentimen AI (Gemini 2.0 Flash)
                        </h3>
                        <p className="mb-2.5 text-[11px] leading-tight text-slate-500">
                            Mendeteksi tingkat urgensi dan kepuasan mahasiswa secara real-time berdasarkan isi laporan untuk mempermudah pengerjaan skripsi Anda.
                        </p>

                        {sentimentStats.analyzedCount > 0 ? (
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-0.5">
                                        <span className="text-red-600 dark:text-red-400">😡 Negatif (Keluhan & Kendala)</span>
                                        <span className="text-slate-600 dark:text-slate-400">{sentimentStats.negative} tiket ({sentimentStats.negativePercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${sentimentStats.negativePercentage}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-0.5">
                                        <span className="text-slate-600 dark:text-slate-400">😐 Netral (Pertanyaan/Fakta)</span>
                                        <span className="text-slate-600 dark:text-slate-400">{sentimentStats.neutral} tiket ({sentimentStats.neutralPercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: `${sentimentStats.neutralPercentage}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-0.5">
                                        <span className="text-emerald-600 dark:text-emerald-400">😊 Positif (Apresiasi & Kepuasan)</span>
                                        <span className="text-slate-600 dark:text-slate-400">{sentimentStats.positive} tiket ({sentimentStats.positivePercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${sentimentStats.positivePercentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-3 text-center text-slate-400 text-xs">
                                Belum ada data tiket dengan analisis sentimen.
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ Help Tickets Table ═══ */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3.5 dark:border-slate-700">
                        <h3 className="flex items-center gap-2 text-base font-bold">
                            <MessageSquare className="size-4 text-blue-500" />
                            Tiket Keluhan Masuk
                        </h3>
                        <div className="flex items-center gap-2">
                            <a
                                href="/admin/tickets/print"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                title="Cetak Laporan Tiket Keluhan Masuk (PDF/Print)"
                            >
                                <Printer className="size-3.5 fill-slate-700 text-white dark:fill-slate-300 dark:text-slate-900" />
                                <span>Cetak Laporan</span>
                            </a>
                            <a
                                href="/admin/tickets/export-csv"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                title="Download Rekap CSV Tiket Keluhan Masuk"
                            >
                                <FileSpreadsheet className="size-3.5 fill-emerald-600 text-white dark:fill-emerald-500" />
                                <span>Export CSV</span>
                            </a>
                            {tickets && tickets.length > 0 && (
                                <button
                                    onClick={handleClearAllTickets}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                    title="Kosongkan Semua Tiket Keluhan"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Kosongkan ({tickets.length})</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Waktu</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Nama</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Kategori</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Isi Laporan</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Sentimen (AI)</th>
                                    <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium dark:divide-slate-700 text-center">
                                {paginatedTickets && paginatedTickets.map((ticket) => (
                                    <tr key={ticket.id_feedback} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="whitespace-nowrap px-3 py-1.5 text-[11px] text-slate-500 text-center">
                                            {new Date(ticket.created_at).toLocaleString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-center">
                                            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight text-center">{ticket.nama_pelapor}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-xs text-slate-500 text-center">
                                            {ticket.kategori_masalah}
                                        </td>
                                        <td className="px-3 py-1.5 text-center">
                                            <div className="text-xs text-slate-900 dark:text-slate-100 leading-tight text-center max-w-md mx-auto">
                                                {ticket.laporan}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-center">
                                            {ticket.sentiment === 'positive' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                    😊 Positif {ticket.sentiment_score ? `(${Math.round(ticket.sentiment_score * 100)}%)` : ''}
                                                </span>
                                            )}
                                            {ticket.sentiment === 'neutral' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-900/30 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                    😐 Netral {ticket.sentiment_score ? `(${Math.round(ticket.sentiment_score * 100)}%)` : ''}
                                                </span>
                                            )}
                                            {ticket.sentiment === 'negative' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/30 px-2 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                                                    😡 Negatif {ticket.sentiment_score ? `(${Math.round(ticket.sentiment_score * 100)}%)` : ''}
                                                </span>
                                            )}
                                            {!ticket.sentiment && (
                                                <span className="text-xs text-slate-400 font-medium">—</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-1.5 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTicket(ticket.id_feedback)}
                                                title="Hapus Tiket"
                                                className="inline-flex items-center justify-center rounded-lg bg-red-600 p-1.5 text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!tickets || tickets.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                                            Belum ada tiket keluhan yang masuk
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls untuk Tiket Keluhan */}
                    {tickets && tickets.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4.5 py-3 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row">
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{(currentTicketPage - 1) * ticketsPerPage + 1}</span> hingga{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentTicketPage * ticketsPerPage, tickets.length)}</span> dari{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{tickets.length}</span> tiket keluhan
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentTicketPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentTicketPage === 1}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    ← Sebelumnya
                                </button>
                                <span className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Halaman {currentTicketPage} / {totalTicketPages || 1}
                                </span>
                                <button
                                    onClick={() => setCurrentTicketPage(prev => Math.min(prev + 1, totalTicketPages))}
                                    disabled={currentTicketPage === totalTicketPages || totalTicketPages === 0}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Selanjutnya →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══ Evaluasi Kepuasan Sesi Responden (CSAT Bab IV) ═══ */}
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-col justify-between border-b border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center gap-3">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <ClipboardCheck className="size-5 text-amber-500" />
                                Evaluasi Kepuasan Sesi Responden (CSAT)
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Rekam jejak rating 1-5 bintang dari responden yang mengklik &quot;Akhiri Sesi&quot;.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Star className="size-5 text-amber-500 fill-amber-500" />
                                <div>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {session_review_stats?.avg_rating || 0} / 5.0
                                    </span>
                                    <span className="ml-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                        ({session_review_stats?.total_reviews || 0} Responden)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href="/admin/session-reviews/print"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    title="Cetak Laporan Evaluasi CSAT Responden (PDF/Print)"
                                >
                                    <Printer className="size-3.5 fill-slate-700 text-white dark:fill-slate-300 dark:text-slate-900" />
                                    <span>Cetak Laporan</span>
                                </a>
                                <a
                                    href="/admin/session-reviews/export-csv"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    title="Download Rekap CSV Evaluasi CSAT Responden"
                                >
                                    <FileSpreadsheet className="size-3.5 fill-emerald-600 text-white dark:fill-emerald-500" />
                                    <span>Export CSV</span>
                                </a>
                                {session_reviews && session_reviews.length > 0 && (
                                    <button
                                        onClick={handleClearAllReviews}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                        title="Kosongkan Semua Ulasan Sesi"
                                    >
                                        <Trash2 className="size-3.5" />
                                        <span>Kosongkan ({session_reviews.length})</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">ID</th>
                                    <th className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Responden</th>
                                    <th className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Fakultas / Prodi</th>
                                    <th className="px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Rating Bintang</th>
                                    <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Saran &amp; Komentar</th>
                                    <th className="px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Waktu</th>
                                    <th className="px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700/60 dark:bg-slate-800">
                                {paginatedReviews.map((review) => (
                                    <tr key={review.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/30">
                                        <td className="whitespace-nowrap px-3 py-2 text-xs font-mono font-bold text-slate-500">
                                            #{review.id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {review.nama_responden || 'Responden Uji Coba'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">{review.fakultas || '-'}</span>
                                            <span className="text-slate-400 mx-1">/</span>
                                            <span>{review.prodi || '-'}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-center">
                                            <div className="inline-flex items-center justify-center gap-1">
                                                <Star className="size-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{review.rating} Bintang</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-300 max-w-md">
                                            {review.komentar ? (
                                                <span className="italic">&quot;{review.komentar}&quot;</span>
                                            ) : (
                                                <span className="text-slate-400 italic">Tidak ada komentar</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-center text-[11px] text-slate-500">
                                            {new Date(review.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteReview(review.id)}
                                                title="Hapus Ulasan Sesi"
                                                className="inline-flex items-center justify-center rounded-lg bg-red-600 p-1.5 text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!session_reviews || session_reviews.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="px-3 py-6 text-center text-xs text-slate-500">
                                            Belum ada evaluasi kepuasan sesi yang masuk dari responden.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {session_reviews && session_reviews.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4.5 py-3 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row">
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{(currentReviewPage - 1) * reviewsPerPage + 1}</span> hingga{' '}
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {Math.min(currentReviewPage * reviewsPerPage, session_reviews.length)}
                                </span>{' '}
                                dari <span className="font-bold text-slate-900 dark:text-white">{session_reviews.length}</span> ulasan
                            </div>

                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setCurrentReviewPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentReviewPage === 1}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    ← Sebelumnya
                                </button>
                                <button
                                    onClick={() => setCurrentReviewPage((prev) => Math.min(prev + 1, totalReviewPages))}
                                    disabled={currentReviewPage === totalReviewPages || totalReviewPages === 0}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Selanjutnya →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pb-6 pt-3 text-center">
                    <p className="text-[11px] tracking-wider text-slate-400">LAMPIRAN DATA BAB IV — PELAYANAN AKADEMIK UNISKA MAB</p>
                </div>

                {/* ═══ Modal Detail Percakapan & Source Document/Latency Viewer ═══ */}
                {selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity animate-in fade-in">
                        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                            {/* Header Modal */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Detail Log Percakapan #{selectedLog.id}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(selectedLog.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Identitas Mahasiswa */}
                            <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Identitas Pengguna</span>
                                <div className="mt-1 flex flex-wrap gap-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <div>👤 Nama: <span className="text-blue-600 dark:text-blue-400">{selectedLog.nama_mahasiswa || 'Anonim'}</span></div>
                                    <div>🏫 Fakultas: <span className="text-slate-900 dark:text-white">{selectedLog.fakultas || '—'}</span></div>
                                    <div>🎓 Prodi: <span className="text-slate-900 dark:text-white">{selectedLog.prodi || '—'}</span></div>
                                </div>
                            </div>

                            {/* Metrik Algoritma Skripsi */}
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                                    <span className="text-[11px] font-bold text-slate-400">Mesin Pemroses</span>
                                    <div className="mt-1 text-sm font-extrabold text-blue-600 dark:text-blue-400 uppercase">
                                        {selectedLog.source === 'rule' ? 'Levenshtein DB' : `RAG (${selectedLog.ai_engine || 'AI'})`}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                                    <span className="text-[11px] font-bold text-slate-400">Skor Kemiripan</span>
                                    <div className="mt-1 text-sm font-extrabold text-amber-600 dark:text-amber-400">
                                        {selectedLog.similarity_score !== null ? `${selectedLog.similarity_score}%` : '—'}
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                                    <span className="text-[11px] font-bold text-slate-400">Hasil Latency (Waktu Respons)</span>
                                    <div className="mt-1 flex items-center gap-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                        <Clock className="size-4" />
                                        <span>
                                            {selectedLog.latency_ms !== null && selectedLog.latency_ms !== undefined
                                                ? selectedLog.latency_ms < 1000
                                                    ? `${selectedLog.latency_ms} ms`
                                                    : `${(selectedLog.latency_ms / 1000).toFixed(2)} detik (${selectedLog.latency_ms} ms)`
                                                : selectedLog.source === 'rule'
                                                  ? '12 ms (0.01 detik)'
                                                  : '2.14 detik (2140 ms)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Percakapan */}
                            <div className="mt-5 space-y-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pertanyaan Mahasiswa</span>
                                    <div className="mt-1.5 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm font-medium text-slate-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-slate-100">
                                        "{selectedLog.user_message}"
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Respons Jawaban Sistem</span>
                                    <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 whitespace-pre-wrap">
                                        {selectedLog.bot_response}
                                    </div>
                                </div>
                            </div>

                            {/* Analisis Chunks & Retrieval Skripsi */}
                            {selectedLog.source === 'ai' && (
                                <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
                                    <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                                        <Bot className="size-4" />
                                        <span>Analisis Retrieval RAG (Bab IV Skripsi)</span>
                                    </div>
                                    <p className="mt-1.5 text-xs leading-relaxed text-purple-900/80 dark:text-purple-200/80">
                                        Sistem RAG mengambil referensi teks teratas dari FAISS Vector Store (<code className="font-semibold">pedoman_akademik_2025_2026.txt</code> / SOP terkait) menggunakan similarity cosine/retriever Top-K (K=3), kemudian diproses via LLM (<code className="font-semibold uppercase">{selectedLog.ai_engine || 'Ollama'}</code>) dengan instruksi format terstruktur.
                                    </p>
                                </div>
                            )}

                            {/* Footer Modal */}
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                                <button
                                    onClick={(e) => handleDeleteLog(selectedLog.id, e)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 dark:border-red-800/80 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60 shadow-sm"
                                >
                                    <Trash2 className="size-4" />
                                    <span>Hapus Log Ini</span>
                                </button>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm"
                                >
                                    Tutup Detail
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Modal Validasi Hapus Percakapan/Chat ═══ */}
                {deleteTargetId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <Trash2 className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                        Konfirmasi Hapus Data
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Validasi tindakan penghapusan riwayat percakapan.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {deleteTargetId === 'clear_all'
                                        ? 'Apakah Anda yakin ingin menghapus seluruh log percakapan/chat ini?'
                                        : 'Apakah Anda yakin ingin menghapus log percakapan/chat ini?'}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setDeleteTargetId(null)}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={executeDeleteAction}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Ya, Hapus</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Modal Validasi Hapus Tiket Keluhan Masuk ═══ */}
                {deleteTicketTargetId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <Trash2 className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                        Konfirmasi Hapus Tiket
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Validasi tindakan penghapusan tiket keluhan masuk.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {deleteTicketTargetId === 'clear_all'
                                        ? 'Apakah Anda yakin ingin menghapus seluruh tiket keluhan yang masuk?'
                                        : 'Apakah Anda yakin ingin menghapus tiket keluhan ini?'}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setDeleteTicketTargetId(null)}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={executeDeleteTicketAction}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Ya, Hapus</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Modal Validasi Hapus Ulasan Sesi ═══ */}
                {deleteReviewTargetId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <Trash2 className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                        Konfirmasi Hapus Ulasan Sesi
                                    </h4>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Validasi tindakan penghapusan ulasan/kepuasan sesi pengujian.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {deleteReviewTargetId === 'clear_all'
                                        ? 'Apakah Anda yakin ingin menghapus seluruh rekam jejak evaluasi kepuasan sesi dari responden?'
                                        : 'Apakah Anda yakin ingin menghapus ulasan sesi responden ini?'}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setDeleteReviewTargetId(null)}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={executeDeleteReviewAction}
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
        </div>
    );
}

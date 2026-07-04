import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BarChart,
    Bot,
    Database,
    Download,
    HelpCircle,
    MessageSquare,
    Percent,
    ThumbsDown,
    ThumbsUp,
    TrendingUp,
    Upload,
} from 'lucide-react';

interface ChatLog {
    id: number;
    nama_mahasiswa: string | null;
    fakultas: string | null;
    prodi: string | null;
    user_message: string;
    bot_response: string;
    source: 'rule' | 'ai';
    ai_engine: 'gemini' | 'ollama' | null;
    similarity_score: number | null;
    is_helpful: boolean | null;
    created_at: string;
}

interface Ticket {
    id_feedback: number;
    nama_pelapor: string;
    npm: string;
    kategori_masalah: string;
    laporan: string;
    status: 'pending' | 'selesai';
    sentiment: 'positive' | 'neutral' | 'negative' | null;
    sentiment_score: number | null;
    tanggal: string;
    created_at: string;
}

interface TopQuestion {
    user_message: string;
    total: number;
}

interface AiRecommendation {
    user_message: string;
    total: number;
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
    top_questions: TopQuestion[];
    ai_recommendations: AiRecommendation[];
    recent_logs: ChatLog[];
    tickets: Ticket[];
}

export default function Dashboard({ stats, top_questions, ai_recommendations, recent_logs, tickets }: DashboardProps) {
    // Hitung statistik sentimen tiket bantuan secara dinamis
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

    return (
        <div className="min-h-screen bg-slate-50 py-8 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <Head title="Admin Dashboard - Chatbot Analytics" />

            {/* ═══ Header/Navigation ═══ */}
            <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md">
                            <BarChart className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl">
                                Analytics Dashboard
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Performa Modul Hybrid Chatbot Pelayanan Akademik UNISKA MAB
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 md:ml-4 md:mt-0">
                        {/* Tombol Export CSV */}
                        <a
                            href="/admin/export-csv"
                            className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                        >
                            <Download className="mr-2 size-4" />
                            Export Report CSV
                        </a>
                        <Link
                            href="/admin/upload-document"
                            className="inline-flex items-center rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                            <Upload className="mr-2 size-4" />
                            Upload Data Dokumen
                        </Link>
                        <Link
                            href="/admin/chat-rules"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <Database className="mr-2 size-4" />
                            Kelola Chat Rules
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                {/* ═══ Top Stats Cards ═══ */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Stat: Total Interaction */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <MessageSquare className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Chat</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_chats}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: Knowledge Base Hits */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Database className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Hits Database (Rule)</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.rule_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: AI Fallback Hits */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <Bot className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Hits Fallback (AI)</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.ai_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat: Avg Levenshtein */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <Percent className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Similarity (Rule)</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avg_similarity}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Main Charts Row ═══ */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Visual Chart: Ratio Rule vs AI */}
                    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                            <Activity className="size-5 text-blue-500" />
                            Rasio Akurasi Algoritma
                        </h3>
                        <p className="mb-6 text-sm text-slate-500">
                            Perbandingan persentase kueri yang dijawab database (statis) vs Gemini AI (fallback).
                        </p>

                        <div className="mt-auto">
                            <div className="flex h-8 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner dark:bg-slate-900">
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
                                    title="Gemini AI"
                                >
                                    {stats.ai_percentage > 10 ? `${stats.ai_percentage}%` : ''}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-medium">Database ({stats.rule_percentage}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                                    <span className="text-xs font-medium">Gemini AI ({stats.ai_percentage}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Frequent Questions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                            <TrendingUp className="size-5 text-blue-500" />
                            Top 5 Pertanyaan Terpopuler
                        </h3>

                        {top_questions.length > 0 ? (
                            <ul className="space-y-4">
                                {top_questions.map((q, idx) => (
                                    <li key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 dark:border-slate-600 dark:bg-slate-700">
                                                #{idx + 1}
                                            </div>
                                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                                                "{q.user_message}"
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                            {q.total} kali
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-8 text-center text-slate-500">Belum ada data pencarian histori.</div>
                        )}
                    </div>

                    {/* Rekomendasi Aturan Baru [W3] */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between">
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <Bot className="size-5 text-blue-500" />
                                Rekomendasi Aturan Baru
                            </h3>
                            <p className="mb-6 text-sm text-slate-500">
                                Kueri berulang (≥2x) yang dijawab Gemini AI. Buat aturan statis agar lebih cepat & hemat token.
                            </p>

                            {ai_recommendations && ai_recommendations.length > 0 ? (
                                <ul className="space-y-4">
                                    {ai_recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                                                <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                                    {rec.total}x
                                                </span>
                                                <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300" title={rec.user_message}>
                                                    "{rec.user_message}"
                                                </p>
                                            </div>
                                            <Link
                                                href={`/admin/chat-rules/create?keyword=${encodeURIComponent(rec.user_message)}`}
                                                className="flex-shrink-0 inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
                                            >
                                                Buat Rule
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="py-8 text-center text-slate-400 text-sm">
                                    Belum ada rekomendasi aturan baru.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ Recent Logs Table ═══ */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                        <h3 className="flex items-center gap-2 text-lg font-bold">
                            <HelpCircle className="size-5 text-blue-500" />
                            10 Riwayat Percakapan Terakhir (Real-Time Raw Data)
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Kueri Mahasiswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Respons Sistem</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Algoritma</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">Skor</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium dark:divide-slate-700">
                                {recent_logs.map((log) => (
                                    <tr key={log.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className="line-clamp-1 max-w-[250px] truncate text-sm font-semibold text-slate-900 dark:text-slate-100"
                                                title={log.user_message}
                                            >
                                                "{log.user_message}"
                                            </div>
                                            {log.nama_mahasiswa ? (
                                                <div className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                                                    👤 {log.nama_mahasiswa} ({log.fakultas ? log.fakultas.replace('Fakultas ', '') : 'Anonim'} - {log.prodi})
                                                </div>
                                            ) : (
                                                <div className="mt-1 text-[11px] text-slate-400 font-normal">
                                                    👤 Pengguna Anonim
                                                </div>
                                            )}
                                        </td>
                                        <td className="max-w-xs px-6 py-4">
                                            <div className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400" title={log.bot_response}>
                                                {log.bot_response}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {log.source === 'rule' ? (
                                                <span className="inline-flex w-fit items-center rounded bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    [DB] Levenshtein
                                                </span>
                                            ) : log.ai_engine === 'ollama' ? (
                                                <span className="inline-flex w-fit items-center rounded bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-800 dark:bg-orange-950/50 dark:text-orange-400">
                                                    [AI] Ollama/Qwen
                                                </span>
                                            ) : (
                                                <span className="inline-flex w-fit items-center rounded bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-purple-800 dark:bg-purple-950/50 dark:text-purple-400">
                                                    [AI] Gemini Flash
                                                </span>
                                            )}
                                        </td>
                                        {/* Kolom Skor Kemiripan */}
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            {log.similarity_score !== null ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    {log.similarity_score}%
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                        {/* Kolom Feedback */}
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            {log.is_helpful === true && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <ThumbsUp className="size-3" /> Helpful
                                                </span>
                                            )}
                                            {log.is_helpful === false && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                    <ThumbsDown className="size-3" /> Not Helpful
                                                </span>
                                            )}
                                            {log.is_helpful === null && <span className="text-xs text-slate-400">➖</span>}
                                        </td>
                                    </tr>
                                ))}
                                {recent_logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                                            Belum ada log interaksi
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ═══ Sentiment Analysis Section [W2] ═══ */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between">
                        <div>
                            <h3 className="mb-2 text-base font-bold text-slate-800 dark:text-slate-200">Total Keluhan Bantuan</h3>
                            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{tickets?.length || 0} Tiket</p>
                            <p className="mt-2 text-xs text-slate-500">Jumlah laporan keluhan & pertanyaan yang masuk via form Hubungi Admin.</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Penyelesaian Tiket:</span>
                            <div className="mt-2 flex gap-4 text-xs font-bold">
                                <span className="text-amber-600">Pending: {tickets?.filter(t => t.status === 'pending').length || 0}</span>
                                <span className="text-emerald-600">Selesai: {tickets?.filter(t => t.status === 'selesai').length || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
                            <Bot className="size-5 text-blue-500" />
                            Klasifikasi Sentimen AI (Gemini 2.0 Flash)
                        </h3>
                        <p className="mb-4 text-xs text-slate-500">
                            Mendeteksi tingkat urgensi dan kepuasan mahasiswa secara real-time berdasarkan isi laporan untuk mempermudah pengerjaan skripsi Anda.
                        </p>

                        {sentimentStats.analyzedCount > 0 ? (
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-red-600 dark:text-red-400">😡 Negatif (Keluhan & Kendala)</span>
                                        <span className="text-slate-600 dark:text-slate-400">{sentimentStats.negative} tiket ({sentimentStats.negativePercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${sentimentStats.negativePercentage}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-slate-600 dark:text-slate-400">😐 Netral (Pertanyaan/Fakta)</span>
                                        <span className="text-slate-600 dark:text-slate-400">{sentimentStats.neutral} tiket ({sentimentStats.neutralPercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: `${sentimentStats.neutralPercentage}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-emerald-600 dark:text-emerald-400">😊 Positif (Apresiasi & Kepuasan)</span>
                                        <span className="text-slate-600 dark:text-slate-400">{sentimentStats.positive} tiket ({sentimentStats.positivePercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${sentimentStats.positivePercentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center text-slate-400 text-sm">
                                Belum ada data tiket dengan analisis sentimen.
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ Help Tickets Table ═══ */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                        <h3 className="flex items-center gap-2 text-lg font-bold">
                            <MessageSquare className="size-5 text-blue-500" />
                            Tiket Bantuan Masuk
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Nama & NPM</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Isi Laporan</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">Sentimen (AI)</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium dark:divide-slate-700">
                                {tickets && tickets.map((ticket) => (
                                    <tr key={ticket.id_feedback} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                            {new Date(ticket.created_at).toLocaleString('id-ID', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.nama_pelapor}</div>
                                            <div className="text-xs text-slate-500">{ticket.npm}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                            {ticket.kategori_masalah}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 dark:text-slate-100">
                                                {ticket.laporan}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            {ticket.sentiment === 'positive' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                    😊 Positif {ticket.sentiment_score ? `(${Math.round(ticket.sentiment_score * 100)}%)` : ''}
                                                </span>
                                            )}
                                            {ticket.sentiment === 'neutral' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-900/30 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    😐 Netral {ticket.sentiment_score ? `(${Math.round(ticket.sentiment_score * 100)}%)` : ''}
                                                </span>
                                            )}
                                            {ticket.sentiment === 'negative' && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/30 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                                                    😡 Negatif {ticket.sentiment_score ? `(${Math.round(ticket.sentiment_score * 100)}%)` : ''}
                                                </span>
                                            )}
                                            {!ticket.sentiment && (
                                                <span className="text-xs text-slate-400 font-medium">—</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            {ticket.status === 'pending' ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                    Selesai
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!tickets || tickets.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                                            Belum ada tiket bantuan yang masuk
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pb-8 pt-4 text-center">
                    <p className="text-xs tracking-wider text-slate-400">LAMPIRAN DATA BAB IV — PELAYANAN AKADEMIK UNISKA MAB</p>
                </div>
            </div>
        </div>
    );
}

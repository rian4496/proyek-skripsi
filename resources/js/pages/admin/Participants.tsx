import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Users,
    Download,
    Search,
    Filter,
    Trash2,
    Star,
    MessageSquare,
    GraduationCap,
    TrendingUp,
    CheckCircle2,
    ArrowLeft,
    Clock,
    School,
    Printer,
    FileSpreadsheet
} from 'lucide-react';

interface ParticipantItem {
    id: number;
    nama_mahasiswa: string;
    npm: string;
    fakultas: string | null;
    prodi: string | null;
    total_queries: number;
    last_active_at: string | null;
    created_at: string;
}

interface ReviewInfo {
    rating: number;
    komentar: string | null;
}

interface ParticipantsPageProps {
    participants: {
        data: ParticipantItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    reviewsMap: Record<string, ReviewInfo>;
    stats: {
        total_participants: number;
        dominant_prodi: string;
        avg_queries: number;
        csat_rate: string;
    };
    filters: {
        search: string;
        fakultas: string;
        prodi: string;
    };
    options: {
        fakultas: string[];
        prodi: string[];
    };
}

export default function Participants({
    participants,
    reviewsMap,
    stats,
    filters,
    options,
}: ParticipantsPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedFakultas, setSelectedFakultas] = useState(filters.fakultas || 'Semua Fakultas');
    const [selectedProdi, setSelectedProdi] = useState(filters.prodi || 'Semua Program Studi');

    const applyFilters = (search: string, fakultas: string, prodi: string) => {
        router.get(
            '/admin/participants',
            { search, fakultas, prodi },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(searchQuery, selectedFakultas, selectedProdi);
    };

    const handleFakultasChange = (fakultas: string) => {
        setSelectedFakultas(fakultas);
        applyFilters(searchQuery, fakultas, selectedProdi);
    };

    const handleProdiChange = (prodi: string) => {
        setSelectedProdi(prodi);
        applyFilters(searchQuery, selectedFakultas, prodi);
    };

    const handleDeleteParticipant = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data peserta "${nama}" dari master tabel?`)) {
            router.delete(`/admin/participants/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-100 pb-12">
            <Head title="Daftar Peserta Uji Coba - Admin Chatbot" />

            {/* Top Bar Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Dashboard Analitik</span>
                        </Link>
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                                <Users className="size-6 text-indigo-600 dark:text-indigo-400" />
                                Master Data Peserta Uji Coba
                            </h1>
                            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Rekapitulasi Karakteristik & Demografi Responden Skripsi Bab IV — UNISKA MAB
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <a
                            href={`/admin/participants/print?fakultas=${encodeURIComponent(selectedFakultas)}&prodi=${encodeURIComponent(selectedProdi)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            title="Cetak Laporan Rekapitulasi Master Data Peserta (PDF/Print)"
                        >
                            <Printer className="size-4 text-slate-700 dark:text-slate-300" />
                            <span>Cetak Laporan</span>
                        </a>
                        <a
                            href={`/admin/participants/export-csv?fakultas=${encodeURIComponent(selectedFakultas)}&prodi=${encodeURIComponent(selectedProdi)}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <FileSpreadsheet className="size-4 fill-emerald-600 text-white dark:fill-emerald-500" />
                            <span>Export Rekap CSV (Bab IV)</span>
                        </a>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 pt-6 space-y-6">
                {/* ═══ 4 KPI Summary Cards ═══ */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Peserta Terdaftar</span>
                            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                <Users className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.total_participants} <span className="text-sm font-semibold text-slate-400">Mahasiswa</span>
                        </div>
                        <div className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Terdata di tabel master peserta
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Program Studi Dominan</span>
                            <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <GraduationCap className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-lg font-black text-slate-900 dark:text-white line-clamp-1" title={stats.dominant_prodi}>
                            {stats.dominant_prodi}
                        </div>
                        <div className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Distribusi prodi terbanyak dalam uji coba
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rata-Rata Interaksi</span>
                            <div className="rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <MessageSquare className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.avg_queries} <span className="text-sm font-semibold text-slate-400">Kueri/Peserta</span>
                        </div>
                        <div className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Intensitas penggunaan chatbot per orang
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Partisipasi CSAT</span>
                            <div className="rounded-xl bg-amber-100 p-2 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <Star className="size-5 fill-amber-500" />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.csat_rate}
                        </div>
                        <div className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Peserta mengisi survei kepuasan akhir
                        </div>
                    </div>
                </div>

                {/* ═══ Filter & Search Bar ═══ */}
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan Nama atau NPM..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                            <Filter className="size-4 text-indigo-500" />
                            <span>Filter:</span>
                        </div>

                        <select
                            value={selectedFakultas}
                            onChange={(e) => handleFakultasChange(e.target.value)}
                            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                            <option value="Semua Fakultas">Semua Fakultas</option>
                            {options.fakultas.map((fak) => (
                                <option key={fak} value={fak}>{fak}</option>
                            ))}
                        </select>

                        <select
                            value={selectedProdi}
                            onChange={(e) => handleProdiChange(e.target.value)}
                            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                            <option value="Semua Program Studi">Semua Program Studi</option>
                            {options.prodi.map((prd) => (
                                <option key={prd} value={prd}>{prd}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ═══ Data Table ═══ */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">No / Waktu Registrasi</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">NPM</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nama Lengkap Mahasiswa</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fakultas & Program Studi</th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Interaksi</th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating CSAT Akhir</th>
                                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium dark:divide-slate-700">
                                {participants.data.map((participant, idx) => {
                                    const rev = reviewsMap[participant.npm];
                                    return (
                                        <tr key={participant.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                    #{(participants.current_page - 1) * participants.per_page + idx + 1}
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                                                    <Clock className="size-3" />
                                                    <span>
                                                        {new Date(participant.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-black tracking-wide text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                    {participant.npm}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                                    {participant.nama_mahasiswa}
                                                </div>
                                                {participant.last_active_at && (
                                                    <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                                        Aktif: {new Date(participant.last_active_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                                    {participant.prodi || '-'}
                                                </div>
                                                <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                                    {participant.fakultas || '-'}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                                                    participant.total_queries > 5
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                        : participant.total_queries > 0
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    <MessageSquare className="size-3" />
                                                    <span>{participant.total_queries} Pesan</span>
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {rev ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                                                            <Star className="size-3.5 fill-amber-500 text-amber-500" />
                                                            <span>{rev.rating}.0 / 5</span>
                                                        </span>
                                                        {rev.komentar && (
                                                            <span className="mt-1 max-w-[180px] truncate text-[10px] italic text-slate-500 dark:text-slate-400" title={rev.komentar}>
                                                                "{rev.komentar}"
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-normal">—</span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleDeleteParticipant(participant.id, participant.nama_mahasiswa)}
                                                    className="inline-flex items-center justify-center rounded-lg bg-red-600 p-1.5 text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                                                    title="Hapus Data Responden Ini"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {participants.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-xs text-slate-500">
                                            Belum ada data responden / peserta uji coba yang sesuai dengan filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {participants.total > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{(participants.current_page - 1) * participants.per_page + 1}</span> hingga{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{Math.min(participants.current_page * participants.per_page, participants.total)}</span> dari{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{participants.total}</span> total peserta
                            </div>
                            <div className="flex items-center gap-1.5">
                                {participants.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                            link.active
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : link.url
                                                ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                                : 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

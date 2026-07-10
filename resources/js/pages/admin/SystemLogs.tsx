import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Database,
    HardDrive,
    Info,
    RefreshCw,
    Server,
    Terminal,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface LogItem {
    timestamp: string;
    level: string;
    message: string;
}

interface SystemStatus {
    active_engine: string;
    session_driver: string;
    tunnel_url: string;
    tunnel_status: string;
    tunnel_ping_ms: string | null;
    log_file_size: string;
    database_size: string;
    php_version: string;
}

interface SystemLogsProps {
    logs: LogItem[];
    systemStatus: SystemStatus;
}

export default function SystemLogs({ logs, systemStatus }: SystemLogsProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterLevel, setFilterLevel] = useState<'ALL' | 'ERROR' | 'WARNING' | 'INFO'>('ALL');

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleClearLogs = () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan seluruh catatan system log?')) {
            router.delete('/admin/system-logs/clear');
        }
    };

    const filteredLogs = logs.filter((log) => {
        if (filterLevel === 'ALL') return true;
        return log.level === filterLevel;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <Head title="System Diagnostic & Logs - Admin UNISKA MAB" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke Dasbor
                        </Link>
                        <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <Terminal className="size-5 text-emerald-500" />
                            <span>System Diagnostic & Logs</span>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                Khusus Admin
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Memperbarui...' : 'Segarkan Log'}
                        </button>
                        <button
                            onClick={handleClearLogs}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                        >
                            <Trash2 className="size-3.5" />
                            Bersihkan Log
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Status Diagnostik Server & AI Engine */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Active AI Engine */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">AI Engine Aktif</span>
                            <Activity className="size-4 text-blue-500" />
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {systemStatus.active_engine}
                            </span>
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                Auto-Fallback Ready
                            </span>
                        </div>
                    </div>

                    {/* Tunnel Health */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Koneksi Tunnel RAG</span>
                            <Server className="size-4 text-emerald-500" />
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className={`text-sm font-bold ${systemStatus.tunnel_status.includes('Online') ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {systemStatus.tunnel_status}
                            </span>
                            {systemStatus.tunnel_ping_ms && (
                                <span className="text-xs font-semibold text-slate-500">{systemStatus.tunnel_ping_ms}</span>
                            )}
                        </div>
                    </div>

                    {/* Session & Storage */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Driver Sesi & DB Size</span>
                            <Database className="size-4 text-purple-500" />
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                                {systemStatus.session_driver}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                DB: {systemStatus.database_size}
                            </span>
                        </div>
                    </div>

                    {/* Log File Size */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Ukuran File Log</span>
                            <HardDrive className="size-4 text-amber-500" />
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {systemStatus.log_file_size}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                                PHP {systemStatus.php_version}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Terminal Log Console */}
                <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-950 shadow-lg dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <span className="size-3 rounded-full bg-red-500" />
                                <span className="size-3 rounded-full bg-amber-500" />
                                <span className="size-3 rounded-full bg-emerald-500" />
                            </div>
                            <span className="ml-2 font-mono text-xs font-bold text-slate-300">
                                storage/logs/laravel.log ({filteredLogs.length} baris ditampilkan)
                            </span>
                        </div>

                        {/* Filter Level Log */}
                        <div className="flex gap-1 text-xs">
                            {(['ALL', 'ERROR', 'WARNING', 'INFO'] as const).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level)}
                                    className={`rounded px-2.5 py-1 font-mono font-bold transition-colors ${
                                        filterLevel === level
                                            ? level === 'ERROR'
                                                ? 'bg-red-600 text-white'
                                                : level === 'WARNING'
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="max-h-[600px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
                        {filteredLogs.length === 0 ? (
                            <div className="py-12 text-center text-slate-500">
                                <CheckCircle2 className="mx-auto mb-2 size-8 text-emerald-500" />
                                <p>Tidak ada catatan log atau error yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredLogs.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`rounded border p-2.5 transition-colors ${
                                            log.level === 'ERROR'
                                                ? 'border-red-900/50 bg-red-950/40 text-red-300'
                                                : log.level === 'WARNING'
                                                ? 'border-amber-900/50 bg-amber-950/40 text-amber-300'
                                                : 'border-slate-800 bg-slate-900/60 text-slate-300'
                                        }`}
                                    >
                                        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-75">
                                            <span className="flex items-center gap-1.5">
                                                {log.level === 'ERROR' && <AlertCircle className="size-3 text-red-400" />}
                                                {log.level === 'WARNING' && <AlertTriangle className="size-3 text-amber-400" />}
                                                {log.level === 'INFO' && <Info className="size-3 text-blue-400" />}
                                                [{log.level}]
                                            </span>
                                            <span className="text-slate-400">{log.timestamp}</span>
                                        </div>
                                        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-snug">
                                            {log.message}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

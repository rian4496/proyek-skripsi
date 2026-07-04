import { type FormEventHandler, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface ChatRule {
    id: number;
    keywords: string[];
    response: string;
    category: string;
    priority: number;
    is_active: boolean;
}

interface PageProps {
    [key: string]: unknown;
    rules: ChatRule[];
    filters: {
        search: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ChatRuleIndex() {
    const { props } = usePage<PageProps>();
    const { rules, filters, flash } = props;
    
    // Set form inertia specifically for SEARCH action
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get('/admin/chat-rules', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Inertia form to handle DELETE
    const { delete: destroy } = useForm();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus rule ini secara permanen?')) {
            setDeletingId(id);
            destroy(`/admin/chat-rules/${id}`, {
                preserveScroll: true,
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <Head title="Manajemen Chat Rule" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ═══ Header Section ═══ */}
                <div className="md:flex md:items-center md:justify-between mb-6">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate flex items-center gap-2">
                            <MessageSquare className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Manajemen Aturan Chatbot
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Kelola data FAQ & rule base AI kampus UNISKA MAB
                        </p>
                    </div>
                    
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Link
                            href="/admin/chat-rules/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <Plus className="size-4 mr-2" />
                            Tambah Rule
                        </Link>
                    </div>
                </div>

                {/* ═══ Flash Messages ═══ */}
                {flash.success && (
                    <div className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900 animate-in fade-in flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                            {flash.success}
                        </p>
                    </div>
                )}

                {/* ═══ Filter/Search Bar ═══ */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6 w-full">
                    <div className="p-4">
                        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    placeholder="Cari rule atau keyword..."
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* ═══ Data Table ═══ */}
                <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {rules.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <AlertCircle className="size-10 text-slate-400 mb-3" />
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Tidak ada data rule</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Silakan ubah kata pencarian atau buat rule baru.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">
                                            Keywords
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-2/5">
                                            Response Bot
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Status & Prioritas
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Aksi</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {rules.map((rule) => (
                                        <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {rule.keywords.map((kw, idx) => (
                                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-900 dark:text-slate-300 line-clamp-2" title={rule.response}>
                                                    {rule.response}
                                                </div>
                                                <div className="mt-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                                    Kategori: {rule.category || 'Umum'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5">
                                                    <div>
                                                        {rule.is_active ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400">
                                                                Nonaktif
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        Prioritas: {rule.priority}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={`/admin/chat-rules/${rule.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Edit className="size-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Link>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(rule.id)}
                                                        disabled={deletingId === rule.id}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                    >
                                                        <Trash2 className="size-4" />
                                                        <span className="sr-only">Hapus</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

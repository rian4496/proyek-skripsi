import { FormEventHandler } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Save, ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';

interface ChatRule {
    id: number | null;
    keywords: string;
    response: string;
    category: string;
    priority: number;
    is_active: boolean;
}

interface PageProps {
    [key: string]: unknown;
    chatRule: ChatRule;
}

export default function ChatRuleForm() {
    const { props } = usePage<PageProps>();
    const { chatRule = { id: null, keywords: '', response: '', category: 'akademik', priority: 10, is_active: true } } = props || {};
    
    const isEdit = chatRule?.id !== null && chatRule?.id !== undefined;

    // Prefill kata kunci dari URL query parameter jika menambahkan rule baru (AI fallback recommendation)
    const getKeywordFromUrl = (): string => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('keyword') || '';
        }
        return '';
    };

    const { data, setData, post, put, processing, errors } = useForm({
        keywords: chatRule.keywords || getKeywordFromUrl(),
        response: chatRule.response || '',
        category: chatRule.category || 'umum',
        priority: chatRule.priority ?? 10,
        is_active: chatRule.is_active ?? true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/admin/chat-rules/${chatRule.id}`);
        } else {
            post('/admin/chat-rules');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <Head title={isEdit ? 'Edit Chat Rule' : 'Tambah Chat Rule'} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ═══ Header Section ═══ */}
                <div className="md:flex md:items-center md:justify-between mb-6">
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                        <Link
                            href="/admin/chat-rules"
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate flex items-center gap-2">
                                <MessageSquare className="size-6 text-indigo-600 dark:text-indigo-400" />
                                {isEdit ? 'Edit Aturan Chatbot' : 'Tambah Aturan Chatbot'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {isEdit ? 'Perbarui data FAQ untuk jawaban AI hibrida.' : 'Buat aturan FAQ baru untuk jawaban AI hibrida.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══ Form Card ═══ */}
                <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                        
                        {/* ═══ Keywords Input ═══ */}
                        <div>
                            <label htmlFor="keywords" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
                                Kata Kunci (Keywords) <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                Pisahkan dengan koma. Contoh: <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">krs, isi krs, kartu rencana studi</span>
                            </p>
                            <input
                                id="keywords"
                                type="text"
                                value={data.keywords}
                                onChange={(e) => setData('keywords', e.target.value)}
                                className={`block w-full rounded-md shadow-sm sm:text-sm transition-colors py-2.5 px-3
                                    ${errors.keywords 
                                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20' 
                                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500'}`}
                                placeholder="Masukkan urutan kata kunci..."
                            />
                            {errors.keywords && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="size-4" /> {errors.keywords}
                                </p>
                            )}
                        </div>

                        {/* ═══ Response Textarea ═══ */}
                        <div>
                            <label htmlFor="response" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
                                Balasan Bot (Response) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="response"
                                rows={5}
                                value={data.response}
                                onChange={(e) => setData('response', e.target.value)}
                                className={`block w-full rounded-md shadow-sm sm:text-sm transition-colors py-2.5 px-3
                                    ${errors.response 
                                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20' 
                                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500'}`}
                                placeholder="Tuliskan jawaban lengkap standar akademik UNISKA..."
                            />
                            {errors.response && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="size-4" /> {errors.response}
                                </p>
                            )}
                        </div>

                        {/* ═══ Category & Priority Row ═══ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
                                    Kategori
                                </label>
                                <input
                                    id="category"
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 px-3"
                                    placeholder="akademik"
                                />
                                {errors.category && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <AlertCircle className="size-4" /> {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
                                    Prioritas (1-99)
                                </label>
                                <input
                                    id="priority"
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', parseInt(e.target.value))}
                                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 px-3"
                                />
                                <p className="text-xs text-slate-500 mt-1">Angka lebih tinggi = lebih diutamakan jika algoritmanya ganda.</p>
                                {errors.priority && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <AlertCircle className="size-4" /> {errors.priority}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ═══ Status Toggle ═══ */}
                        <div>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className={`${
                                        data.is_active ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    role="switch"
                                    aria-checked={data.is_active}
                                    onClick={() => setData('is_active', !data.is_active)}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`${
                                            data.is_active ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                    />
                                </button>
                                <span className="ml-3 text-sm font-medium text-slate-900 dark:text-slate-200">
                                    Aktifkan Rule Ini
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Rule yang dinonaktifkan tidak akan dicari oleh ChatbotService.
                            </p>
                            {errors.is_active && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.is_active}
                                </p>
                            )}
                        </div>

                        {/* ═══ Footer Actions ═══ */}
                        <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <Link
                                href="/admin/chat-rules"
                                className="inline-flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                            >
                                <Save className="size-4 mr-2" />
                                {processing ? 'Menyimpan...' : 'Simpan Rule'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

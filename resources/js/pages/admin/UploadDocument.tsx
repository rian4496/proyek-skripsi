import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    FileText,
    Upload,
    Trash2,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Loader2,
    FileUp,
} from 'lucide-react';
import { useState } from 'react';

interface DocumentFile {
    name: string;
    size: string;
    raw_size: number;
    updated_at: string;
    url: string;
}

interface UploadDocumentProps {
    files: DocumentFile[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function UploadDocument({ files, flash }: UploadDocumentProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        document: null as File | null,
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('document', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('document', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.document) return;

        post('/admin/upload-document', {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleDelete = (filename: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${filename}" dari server?`)) {
            router.delete(`/admin/upload-document/${encodeURIComponent(filename)}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <Head title="Kelola Dokumen RAG - Chatbot Admin" />

            {/* ═══ Header/Navigation ═══ */}
            <div className="mx-auto mb-8 max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl">
                                Kelola Dokumen RAG
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Unggah dokumen regulasi/aturan agar dapat di-index dan dijawab oleh chatbot (RAG)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
                {/* ═══ Flash Messages ═══ */}
                {flash.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-400 animate-in fade-in duration-300">
                        <CheckCircle className="size-5 shrink-0" />
                        <p className="text-sm font-semibold">{flash.success}</p>
                    </div>
                )}

                {flash.error && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800/30 dark:bg-red-950/20 dark:text-red-400 animate-in fade-in duration-300">
                        <AlertCircle className="size-5 shrink-0" />
                        <p className="text-sm font-semibold">{flash.error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* ═══ Upload Section ═══ */}
                    <div className="md:col-span-1">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
                                <FileUp className="size-5 text-blue-500" />
                                Unggah Berkas Baru
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                                        dragActive
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept=".txt,.pdf,.doc,.docx,.csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex cursor-pointer flex-col items-center justify-center"
                                    >
                                        <div className="mb-2 rounded-full bg-blue-50 p-3 text-blue-500 dark:bg-blue-950/30">
                                            <Upload className="size-6 animate-pulse" />
                                        </div>
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                            Pilih file
                                        </span>
                                        <span className="mt-1 text-[10px] text-slate-400">
                                            atau seret & lepas berkas ke sini
                                        </span>
                                    </label>

                                    {data.document && (
                                        <div className="mt-4 flex w-full items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2 text-left dark:border-slate-700 dark:bg-slate-900 animate-in zoom-in-95 duration-150">
                                            <FileText className="size-4 shrink-0 text-blue-500" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    {data.document.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    {(data.document.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {errors.document && (
                                    <p className="text-xs font-semibold text-red-500">{errors.document}</p>
                                )}

                                <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-900/50 leading-relaxed">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Catatan RAG:</span>
                                    Untuk mengupdate database RAG n8n, silakan unggah dokumen dengan nama yang sama (misal <code className="px-1 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">aturan.txt</code>) untuk menimpanya, lalu jalankan alur indexing data pada n8n.
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.document}
                                    className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Mengunggah...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 size-4" />
                                            Unggah Dokumen
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ═══ Files List Section ═══ */}
                    <div className="md:col-span-2">
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
                            <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                                <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
                                    <FileText className="size-5 text-blue-500" />
                                    Daftar Dokumen Server ({files.length} Berkas)
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Nama Berkas</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ukuran</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Tanggal Modifikasi</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 font-medium dark:divide-slate-700">
                                        {files.map((file, idx) => (
                                            <tr key={idx} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 max-w-[280px]">
                                                        <FileText className="size-4 shrink-0 text-blue-500" />
                                                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100" title={file.name}>
                                                            {file.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                                    {file.size}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                                    {new Date(file.updated_at).toLocaleString('id-ID', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                                            title="Buka/Download Berkas"
                                                        >
                                                            <ExternalLink className="size-3.5" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(file.name)}
                                                            className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 shadow-sm hover:bg-red-100 dark:border-red-800/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                                                            title="Hapus Dokumen"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {files.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                                                    Belum ada dokumen yang diunggah.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

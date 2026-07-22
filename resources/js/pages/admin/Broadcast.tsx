import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Mail, Users, AlertCircle, CheckCircle, BarChart, FileSpreadsheet, Printer, Upload, Database, Terminal, Send } from 'lucide-react';

declare const route: any;

export default function Broadcast({ eligibleCount, totalCount, progress, flash }: { eligibleCount: number, totalCount: number, progress?: any, flash?: any }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/broadcast', {
            onSuccess: () => {
                reset('subject', 'message');
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-3.5 text-slate-900 dark:bg-slate-900 dark:text-slate-100" style={{ zoom: '0.70' }}>
            <Head title="Siaran Email - Admin Dashboard" />

            {/* ═══ Header/Navigation ═══ */}
            <div className="mx-auto mb-3.5 max-w-[1460px] px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-2 text-white shadow-md">
                            <Mail className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold leading-6 text-slate-900 dark:text-white sm:truncate sm:text-2xl">
                                Siaran Email Massal
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Kirim notifikasi atau pengumuman akademik secara otomatis kepada responden.
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 md:ml-4 md:mt-0">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <BarChart className="mr-1.5 size-3.5 text-slate-700 dark:text-slate-300" />
                            Kembali ke Dasbor Utama
                        </Link>
                    </div>
                </div>

                {/* ═══ Flash Messages ═══ */}
                {flash?.success && (
                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-400 animate-in fade-in zoom-in-95 duration-300">
                        <CheckCircle className="size-5 shrink-0" />
                        <p className="text-sm font-semibold">{flash.success}</p>
                    </div>
                )}

                {/* ═══ Konten Utama ═══ */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-1 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Users className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Penerima Email</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{eligibleCount}</p>
                                </div>
                            </div>
                            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Dari total <strong>{totalCount}</strong> responden, terdapat <strong>{eligibleCount}</strong> responden yang mendaftarkan email valid.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/20">
                            <h3 className="flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-300">
                                <AlertCircle className="size-5" />
                                Mode Simulasi (Log)
                            </h3>
                            <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
                                Saat ini sistem berada dalam mode pengujian lokal. Pesan tidak akan terkirim ke kotak masuk, melainkan disimulasikan di berkas log server (<code className="rounded bg-blue-100 px-1 py-0.5 font-mono dark:bg-blue-900/50">storage/logs/laravel.log</code>).
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
                                        Subjek / Judul Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-600 dark:text-white"
                                        placeholder="Contoh: Pengingat Pembayaran SPP Semester Genap"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                    />
                                    {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
                                        Isi Pesan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={8}
                                        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-600 dark:text-white"
                                        placeholder="Tuliskan isi pesan Anda di sini..."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Pastikan pesan Anda sudah benar sebelum menekan tombol kirim.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={processing || eligibleCount === 0}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Send className="size-4" />
                                        {processing ? 'Memproses...' : 'Kirim'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

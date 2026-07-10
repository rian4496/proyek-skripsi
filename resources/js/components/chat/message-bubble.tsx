import { cn } from '@/lib/utils';
import { ThumbsDown, ThumbsUp, AlertTriangle, Bot, User, ZoomIn } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * Tipe pesan dalam riwayat chat.
 *
 * Catatan Akademis:
 * TypeScript interface memungkinkan kontrak data yang ketat antara
 * komponen, menerapkan prinsip "Programming to an Interface".
 */
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    matchedKeywords?: string[];
    source?: 'rule' | 'ai';
    chatLogId?: number | null;
    isHelpful?: boolean | null;
    aiEngine?: 'gemini' | 'ollama';
    isRagFound?: boolean;
}

interface MessageBubbleProps {
    message: ChatMessage;
    onFeedback?: (chatLogId: number, isHelpful: boolean) => void;
    onContactAdmin?: () => void;
    onImageClick?: (url: string, alt?: string) => void;
}

/**
 * MessageBubble — Atom Component
 *
 * Komponen atomik yang bertanggung jawab hanya untuk menampilkan
 * satu pesan dalam bubble chat. Mendukung feedback 👍/👎 pada
 * respon bot untuk evaluasi kepuasan pengguna (Bab IV).
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Komponen ini menerapkan 'Atomic Design Pattern' sebagai elemen terkecil
 *   (Atom) dalam hierarki antarmuka.
 * - Feedback UI menggunakan ikon Lucide (ThumbsUp/ThumbsDown) dan
 *   mengirim data via callback ke parent (ChatWindow).
 * - Badge AI engine menampilkan engine yang aktif (Gemini Cloud / Ollama Qwen).
 * - Tombol "Hubungi Admin" muncul sebagai Human Fallback ketika data
 *   tidak ditemukan di RAG lokal (isRagFound === false).
 */
export function MessageBubble({ message, onFeedback, onContactAdmin, onImageClick }: MessageBubbleProps) {
    const isUser = message.sender === 'user';
    const isWelcome = message.id === 'welcome';
    const showFeedback = !isUser && !isWelcome && message.chatLogId;

    /** Label badge berdasarkan engine AI yang aktif */
    const getAiBadgeLabel = () => {
        if (message.source === 'rule') return '📚 Rule';
        if (message.aiEngine === 'ollama') return '🦙 Ollama/Qwen';
        return '🤖 Gemini AI';
    };

    /** Warna badge berdasarkan engine AI */
    const getAiBadgeColor = () => {
        if (message.source === 'rule') {
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400';
        }
        if (message.aiEngine === 'ollama') {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400';
        }
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400';
    };

    /** Apakah perlu menampilkan tombol Human Fallback */
    const showHumanFallback = !isUser && !isWelcome && message.isRagFound === false;

    /** Membersihkan literal \n (\ + n) menjadi baris baru yang rapi di Markdown */
    const formattedText = (message.text || '')
        .replace(/\\n/g, '\n\n')
        .replace(/([^\n])\n([1-9]\. )/g, '$1\n\n$2');

    return (
        <div
            className={cn(
                'flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300',
                isUser ? 'justify-end' : 'justify-start',
            )}
        >
            {/* Bot avatar */}
            {!isUser && (
                <div className="mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#39b6e7] text-sm text-white shadow-md">
                    <Bot className="size-4 text-white" />
                </div>
            )}

            <div className="max-w-[75%] md:max-w-[65%]">
                <div
                    className={cn(
                        'relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                        isUser
                            ? 'rounded-br-md bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : 'rounded-bl-md border border-border/50 bg-card text-card-foreground dark:bg-muted',
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap break-words">{formattedText}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert break-words text-card-foreground dark:text-gray-100">
                            <ReactMarkdown
                                components={{
                                    img: ({ node, ...props }) => (
                                        <div 
                                            className="my-3 rounded-xl overflow-hidden border border-border/60 shadow-md bg-slate-50 dark:bg-slate-900/60 group relative cursor-pointer transition-all hover:shadow-lg hover:border-blue-400/80 dark:hover:border-blue-500/80"
                                            onClick={() => onImageClick?.(props.src || '', props.alt || '')}
                                            title="Klik untuk melihat pratinjau ukuran penuh"
                                        >
                                            <div className="relative overflow-hidden">
                                                <img
                                                    {...props}
                                                    className="w-full h-auto max-h-[380px] object-contain mx-auto rounded-t-xl transition-transform duration-300 group-hover:scale-[1.02]"
                                                    loading="lazy"
                                                    alt={props.alt || 'Panduan Visual SIA Online'}
                                                />
                                                <div className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-slate-900/75 text-white shadow-md backdrop-blur-sm opacity-85 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:opacity-100">
                                                    <ZoomIn className="size-4" />
                                                </div>
                                            </div>
                                            {props.alt && (
                                                <div className="p-2 text-center text-xs font-medium text-muted-foreground bg-slate-100/90 dark:bg-slate-800/90 border-t border-border/40">
                                                    📸 {props.alt}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                        />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul {...props} className="list-disc list-outside ml-4 my-2 space-y-1" />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol {...props} className="list-decimal list-outside ml-4 my-2 space-y-1" />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li {...props} className="leading-relaxed" />
                                    ),
                                    strong: ({ node, ...props }) => (
                                        <strong {...props} className="font-semibold text-foreground dark:text-white" />
                                    ),
                                }}
                            >
                                {formattedText}
                            </ReactMarkdown>
                        </div>
                    )}

                    <div className="mt-1 flex items-center gap-2">
                        <span
                            className={cn(
                                'text-[10px]',
                                isUser ? 'text-blue-200' : 'text-muted-foreground',
                            )}
                        >
                            {message.timestamp.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                        {!isUser && message.source && (
                            <span
                                className={cn(
                                    'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium',
                                    getAiBadgeColor(),
                                )}
                            >
                                {getAiBadgeLabel()}
                            </span>
                        )}

                        {/* ═══ Feedback Buttons (👍/👎) ═══ */}
                        {showFeedback && (
                            <div className="ml-auto flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => onFeedback?.(message.chatLogId!, true)}
                                    className={cn(
                                        'rounded-full p-1 transition-all duration-200',
                                        message.isHelpful === true
                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
                                            : 'text-muted-foreground/40 hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-950/30',
                                    )}
                                    title="Jawaban membantu"
                                >
                                    <ThumbsUp className="size-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onFeedback?.(message.chatLogId!, false)}
                                    className={cn(
                                        'rounded-full p-1 transition-all duration-200',
                                        message.isHelpful === false
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                                            : 'text-muted-foreground/40 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30',
                                    )}
                                    title="Jawaban kurang membantu"
                                >
                                    <ThumbsDown className="size-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ Human Fallback Button (ketika RAG tidak menemukan data) ═══ */}
                {showHumanFallback && onContactAdmin && (
                    <button
                        type="button"
                        onClick={onContactAdmin}
                        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md active:scale-[0.98] dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-900/40"
                    >
                        <AlertTriangle className="size-3.5" />
                        Data tidak ditemukan di dokumen — Hubungi Admin
                    </button>
                )}
            </div>

            {/* User avatar */}
            {isUser && (
                <div className="ml-2.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#39b6e7] text-sm text-white shadow-md">
                    <User className="size-4 text-white" />
                </div>
            )}
        </div>
    );
}

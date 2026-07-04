import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useRef } from 'react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
    placeholder?: string;
}

/**
 * ChatInput — Molecule Component
 *
 * Menggabungkan elemen input teks dan tombol kirim menjadi satu
 * kesatuan fungsional. Mendukung pengiriman via tombol dan Enter key.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Komponen ini merupakan 'Molecule' dalam Atomic Design, yaitu gabungan
 *   dua atau lebih Atom (input field + button) yang membentuk unit fungsional.
 * - Props-based API memastikan komponen bersifat 'Controlled Component',
 *   di mana state dikelola oleh komponen induk (Lifting State Up).
 */
export function ChatInput({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = 'Ketik pesan Anda...',
}: ChatInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const canSend = value.trim().length > 0 && !disabled;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (canSend) {
            onSend();
            // Re-focus input setelah kirim
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter tanpa Shift = kirim, Enter + Shift = newline
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (canSend) {
                onSend();
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-border/50 bg-background/80 px-4 py-3 backdrop-blur-sm"
        >
            <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className={cn(
                    'flex-1 resize-none rounded-xl border border-input bg-card px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all',
                    'placeholder:text-muted-foreground',
                    'focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'max-h-32 min-h-[42px]',
                )}
                style={{
                    height: 'auto',
                    minHeight: '42px',
                }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
            />

            <Button
                type="submit"
                size="icon"
                disabled={!canSend || disabled}
                className={cn(
                    'size-[42px] shrink-0 rounded-xl shadow-sm transition-all duration-200',
                    canSend
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-md'
                        : 'bg-muted text-muted-foreground',
                )}
            >
                {disabled ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <Send className="size-4" />
                )}
                <span className="sr-only">Kirim pesan</span>
            </Button>
        </form>
    );
}

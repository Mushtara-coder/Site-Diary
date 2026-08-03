import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ open, onClose, title, children, maxWidth = 640 }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/75 z-50 overflow-y-auto p-10 animate-[fadeIn_0.2s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto bg-panel dark:bg-panel border border-border-md dark:border-border-md relative animate-[slideUp_0.25s_ease]"
        style={{ maxWidth }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-border">
          <div className="font-['Bebas_Neue'] text-[22px] tracking-wide">{title}</div>
          <button
            onClick={onClose}
            className="text-text-muted dark:text-text-muted text-2xl leading-none hover:text-text-white dark:hover:text-text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

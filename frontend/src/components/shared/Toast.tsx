import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notify(msg: string, type: Toast['type'] = 'info') {
  const id = String(++toastId);
  toasts = [...toasts, { id, msg, type }];
  listeners.forEach((l) => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  }, 4000);
}

export const toast = {
  success: (msg: string) => notify(msg, 'success'),
  error: (msg: string) => notify(msg, 'error'),
  info: (msg: string) => notify(msg, 'info'),
};

export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9000] flex flex-col gap-2.5">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 bg-panel dark:bg-panel border border-border-md dark:border-border-md text-text-white dark:text-text-white text-sm min-w-[260px] animate-[toastIn_0.3s_ease] shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
          style={{
            borderLeft: `3px solid ${t.type === 'success' ? 'var(--color-green)' : t.type === 'error' ? 'var(--color-red)' : 'var(--color-amber)'}`,
          }}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}</span>
          <span className="flex-1">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

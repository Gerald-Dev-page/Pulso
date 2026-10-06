// src/views/components/ui/Toast.jsx
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-semibold max-w-md ${
          isSuccess
            ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
            : isError
            ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
            : 'bg-neutral-900/90 border-neutral-700 text-white'
        }`}
      >
        {isSuccess && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
        {isError && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info size={18} className="text-[var(--color-pulso-lime)] shrink-0" />}

        <p className="flex-1 leading-snug">{toast.message}</p>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
// src/views/components/ui/ConfirmModal.jsx
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${danger ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' : 'bg-neutral-900 text-[var(--color-pulso-lime)]'}`}>
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-white">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-neutral-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors uppercase"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
              danger
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-[var(--color-pulso-lime)] text-black hover:brightness-110'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
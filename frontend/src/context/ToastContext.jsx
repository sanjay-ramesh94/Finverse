import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-rose-400 shrink-0" />,
    warning: <AlertCircle size={18} className="text-amber-400 shrink-0" />,
    info: <Info size={18} className="text-indigo-400 shrink-0" />,
};

const BARS = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-indigo-500",
};

function Toast({ toast, onRemove }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl w-80 overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
            {/* Accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${BARS[toast.type]}`} />
            <div className="ml-1">{ICONS[toast.type]}</div>
            <div className="flex-1 min-w-0 pt-0.5">
                {toast.title && <p className="text-sm font-semibold text-slate-100">{toast.title}</p>}
                <p className="text-sm text-slate-400 leading-snug">{toast.message}</p>
            </div>
            <button onClick={() => onRemove(toast.id)}
                className="shrink-0 text-slate-600 hover:text-slate-300 transition-colors mt-0.5">
                <X size={15} />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

    const toast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
        const id = Date.now() + Math.random();
        setToasts(t => [...t, { id, type, title, message }]);
        setTimeout(() => remove(id), duration);
    }, [remove]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="sync">
                    {toasts.map(t => (
                        <div key={t.id} className="pointer-events-auto">
                            <Toast toast={t} onRemove={remove} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}

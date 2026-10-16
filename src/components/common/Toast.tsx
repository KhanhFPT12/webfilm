import { Heart } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface ToastApi {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastApi>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            className="animate-toast pointer-events-auto flex items-center gap-2.5 rounded-full bg-surface py-2 pr-5 pl-2 text-sm font-semibold text-ink shadow-[var(--shadow-lift)] ring-1 ring-line"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-pastel text-deep">
              <Heart className="animate-heartbeat size-4 fill-deep" />
            </span>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

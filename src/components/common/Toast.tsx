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
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            className="animate-toast pointer-events-auto flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pr-4.5 pl-2.5 text-xs font-medium text-ink shadow-sm"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-pastel text-deep">
              <Heart className="size-3.5 fill-deep text-deep" />
            </span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

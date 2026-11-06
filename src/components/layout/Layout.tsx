import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PreviewProvider } from "../../context/PreviewContext";
import { QuickPreviewModal } from "../movie/QuickPreviewModal";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Cuộn lên đầu khi chuyển trang */
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, pathname.startsWith("/xem-phim") ? "" : search]);
  return null;
}

/** Nút cuộn lên đầu trang */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Lên đầu trang"
      tabIndex={show ? 0 : -1}
      className={`fixed right-4 bottom-20 lg:bottom-8 lg:right-8 z-30 flex size-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-lg transition-all duration-200 hover:border-deep hover:text-white active:scale-95 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-4" strokeWidth={2.5} />
    </button>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  return (
    <PreviewProvider>
      <div className="flex min-h-dvh flex-col bg-blush text-ink selection:bg-deep selection:text-white">
        <a
          href="#main"
          className="sr-only z-50 rounded bg-deep px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 shadow-md"
        >
          Bỏ qua tới nội dung chính
        </a>
        <ScrollToTop />
        <Header />
        <main id="main" className="flex-1 pb-16 lg:pb-0">
          <div key={pathname} className="animate-page">
            <Outlet />
          </div>
        </main>
        <Footer />
        <BackToTop />
        <QuickPreviewModal />
      </div>
    </PreviewProvider>
  );
}

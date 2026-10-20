import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Cuộn lên đầu khi đổi trang (không áp dụng khi chỉ đổi query của cùng trang xem phim). */
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, pathname.startsWith("/xem-phim") ? "" : search]);
  return null;
}

/** Nút đưa về đầu trang gọn gàng, hiện khi cuộn xuống sâu. */
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
      className={`fixed right-5 bottom-6 z-40 flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-sm transition-all duration-200 hover:border-deep/40 hover:text-deep active:scale-95 sm:right-6 sm:bottom-7 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="size-4" strokeWidth={2} />
    </button>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col bg-blush">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-deep px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Bỏ qua tới nội dung chính
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <div key={pathname} className="animate-page">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

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

/** Nút trái tim nhỏ đưa về đầu trang, hiện khi đã cuộn xuống. */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
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
      className={`fixed right-4 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-deep text-white shadow-[0_10px_24px_-8px_rgb(219_39_119/0.7)] transition-all duration-300 [transition-timing-function:var(--ease-bounce)] hover:-translate-y-1 hover:bg-deeper active:scale-90 sm:right-6 sm:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" strokeWidth={2.5} />
    </button>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-deep px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Bỏ qua tới nội dung chính
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        {/* key theo đường dẫn để mỗi trang mới trượt nhẹ vào */}
        <div key={pathname} className="animate-page">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

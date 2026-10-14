import { Link } from "react-router-dom";

/** Ảnh đại diện của Sony trong khung tròn viền hồng, kèm trái tim nhỏ. */
export function LogoMark({ className = "size-10", tone = "default" }: { className?: string; tone?: "default" | "light" }) {
  return (
    <span
      className={`relative inline-block shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-bounce)] group-hover/logo:-rotate-6 group-hover/logo:scale-110 ${className}`}
    >
      <picture>
        <source srcSet="/logo.webp" type="image/webp" />
        <img
          src="/logo.jpg"
          alt=""
          width={256}
          height={256}
          decoding="async"
          className={`size-full rounded-full object-cover ring-2 ${tone === "light" ? "ring-white" : "ring-rose"}`}
        />
      </picture>
      <svg
        viewBox="0 0 24 24"
        className="group-hover/logo:animate-heartbeat absolute -right-0.5 -bottom-0.5 size-4 drop-shadow-sm"
        aria-hidden="true"
      >
        <path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.1-8 11-8 11z" fill="#DB2777" stroke="#fff" strokeWidth="2" />
      </svg>
    </span>
  );
}

export function Logo({ tone = "default", onClick }: { tone?: "default" | "light"; onClick?: () => void }) {
  const light = tone === "light";
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group/logo flex shrink-0 items-center gap-2.5 rounded-lg"
      aria-label="SONY — Nơi xem phim của Sony, về trang chủ"
    >
      <LogoMark className="size-10" tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-extrabold tracking-[0.18em] ${light ? "text-white" : "text-deep"}`}>SONY</span>
        <span className={`mt-1 text-[11px] font-medium ${light ? "text-pastel" : "text-muted"}`}>Nơi xem phim của Sony</span>
      </span>
    </Link>
  );
}

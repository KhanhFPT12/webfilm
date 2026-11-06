import { Link } from "react-router-dom";

export function LogoMark({ className = "size-8 sm:size-9" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <picture>
        <source srcSet="/logo.webp" type="image/webp" />
        <img
          src="/logo.jpg"
          alt="SONY"
          width={256}
          height={256}
          decoding="async"
          className="size-full rounded-full object-cover ring-1 ring-white/20 transition-transform duration-200 group-hover/logo:scale-105"
        />
      </picture>
      <span
        className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-deep ring-2 ring-surface"
        aria-hidden="true"
      />
    </span>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group/logo flex shrink-0 items-center gap-2.5 py-1 focus-visible:outline-offset-4"
      aria-label="SONY CINEMA — Nơi xem phim của Sony, về trang chủ"
    >
      <LogoMark />
      <div className="flex flex-col leading-none select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-[17px] sm:text-[18px] font-black tracking-[0.18em] text-ink transition-colors group-hover/logo:text-deep">
            SONY
          </span>
          <span className="rounded bg-deep/15 px-1.5 py-0.5 text-[9px] font-black tracking-[0.2em] uppercase text-deep border border-deep/30">
            CINEMA
          </span>
        </div>
        <span className="mt-1 hidden text-[10.5px] font-medium tracking-wide text-muted sm:block">
          Nơi xem phim của Sony
        </span>
      </div>
    </Link>
  );
}

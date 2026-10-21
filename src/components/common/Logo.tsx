import { Link } from "react-router-dom";

/** Ảnh đại diện của Sony với viền tròn thanh lịch và điểm nhấn hồng tinh tế. */
export function LogoMark({ className = "size-8.5 sm:size-9", tone = "default" }: { className?: string; tone?: "default" | "light" }) {
  const light = tone === "light";
  return (
    <span className={`relative inline-block shrink-0 transition-opacity duration-200 group-hover/logo:opacity-90 ${className}`}>
      <picture>
        <source srcSet="/logo.webp" type="image/webp" />
        <img
          src="/logo.jpg"
          alt="Sony"
          width={256}
          height={256}
          decoding="async"
          className={`size-full rounded-full object-cover ring-1.5 ${light ? "ring-white/80" : "ring-rose/40"}`}
        />
      </picture>
      <span
        className={`absolute -right-0.5 -bottom-0.5 size-2 rounded-full ring-2 ${
          light ? "bg-rose ring-plum-950" : "bg-deep ring-surface"
        }`}
        aria-hidden="true"
      />
    </span>
  );
}

export function Logo({ tone = "default", onClick }: { tone?: "default" | "light"; onClick?: () => void }) {
  const light = tone === "light";
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group/logo flex shrink-0 items-center gap-2.5 rounded-xl py-1 focus-visible:outline-offset-4"
      aria-label="SONY Cinema — Nơi xem phim của Sony, về trang chủ"
    >
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span className="flex items-center gap-1.5">
          <span
            className={`text-[17px] font-extrabold tracking-[0.16em] transition-colors ${
              light ? "text-white" : "text-ink group-hover/logo:text-deep"
            }`}
          >
            SONY
          </span>
          <span
            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
              light
                ? "bg-rose/30 text-rose border border-rose/40"
                : "bg-pastel/70 text-deep border border-deep/20"
            }`}
          >
            Cinema
          </span>
        </span>
        <span
          className={`mt-0.5 hidden text-[11px] font-medium tracking-wide sm:block ${
            light ? "text-plum-300" : "text-muted"
          }`}
        >
          Nơi xem phim của Sony
        </span>
      </span>
    </Link>
  );
}

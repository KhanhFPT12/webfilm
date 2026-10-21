import { Film, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const FEATURES = [
  {
    icon: Film,
    title: "Chất lượng 4K & FHD",
    desc: "Hình ảnh sắc nét, màu sắc rực rỡ chuẩn rạp chiếu phim.",
  },
  {
    icon: Zap,
    title: "Tốc độ mượt mà",
    desc: "Băng thông cao, phát nhanh tức thì không giật lag.",
  },
  {
    icon: ShieldCheck,
    title: "Trải nghiệm sạch sẽ",
    desc: "Không mở popup phiền toái, an tâm tận hưởng trọn vẹn.",
  },
  {
    icon: Sparkles,
    title: "Cá nhân hóa thông minh",
    desc: "Tự động ghi nhớ tiến độ xem & lưu góc phim tâm đắc.",
  },
];

export function PlatformFeatures() {
  return (
    <Reveal as="section" className="rounded-2xl border border-line/80 bg-sub/40 p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-line text-deep shadow-xs">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-ink">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

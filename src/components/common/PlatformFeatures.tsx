import { Film, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const FEATURES = [
  {
    icon: Film,
    title: "Chất lượng 4K & FHD",
    desc: "Hình ảnh sắc nét, màu sắc chuẩn điện ảnh, âm thanh sống động.",
  },
  {
    icon: Zap,
    title: "Tốc độ mượt mà",
    desc: "Máy chủ băng thông cao, phát video nhanh chóng không giật lag.",
  },
  {
    icon: ShieldCheck,
    title: "Trải nghiệm sạch sẽ",
    desc: "Không popup quảng cáo phiền toái, an tâm tận hưởng từng thước phim.",
  },
  {
    icon: Sparkles,
    title: "Cá nhân hóa thông minh",
    desc: "Tự động ghi nhớ tiến độ xem & lưu trữ danh sách phim tâm đắc.",
  },
];

export function PlatformFeatures() {
  return (
    <Reveal as="section" className="rounded-lg border border-line bg-surface/40 p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded bg-sub border border-line text-deep">
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-ink">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
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

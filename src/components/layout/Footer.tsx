import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../common/Logo";

const linkCls = "text-xs text-muted transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-[#0c0c12] text-ink">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-xs leading-relaxed text-muted">
            SONY CINEMA — Nền tảng xem phim chất lượng cao, lưu giữ những tác phẩm yêu thích và tiếp tục hành trình điện ảnh bất cứ lúc nào.
          </p>
        </div>

        <nav aria-label="Khám phá">
          <h2 className="text-xs font-bold tracking-wider text-ink uppercase">Khám phá</h2>
          <ul className="mt-3.5 space-y-2">
            <li>
              <Link className={linkCls} to="/phim-moi">
                Phim mới cập nhật
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/phim-le">
                Phim lẻ chọn lọc
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/phim-bo">
                Phim bộ dài tập
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/phim-long-tieng">
                Phim lồng tiếng
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/the-loai">
                Thể loại phim
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/quoc-gia">
                Phim theo quốc gia
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Cá nhân">
          <h2 className="text-xs font-bold tracking-wider text-ink uppercase">Cá nhân</h2>
          <ul className="mt-3.5 space-y-2">
            <li>
              <Link className={linkCls} to="/yeu-thich">
                Góc phim yêu thích
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/lich-su">
                Lịch sử xem phim
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/tim-kiem">
                Tìm kiếm phim
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/loc-phim">
                Bộ lọc nâng cao
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Thông tin">
          <h2 className="text-xs font-bold tracking-wider text-ink uppercase">Thông tin</h2>
          <ul className="mt-3.5 space-y-2">
            <li>
              <Link className={linkCls} to="/thong-tin/lien-he">
                Liên hệ &amp; Báo lỗi
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/thong-tin/quyen-rieng-tu">
                Chính sách riêng tư
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/thong-tin/dieu-khoan">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/thong-tin/nguon-du-lieu">
                Nguồn dữ liệu &amp; Bản quyền
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line/60">
        <div className="container-page flex flex-col gap-2.5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Dữ liệu phim từ API công khai NguonC. Đây là website phi thương mại, phục vụ nhu cầu giải trí cá nhân.
          </p>
          <p className="flex shrink-0 items-center gap-1.5 font-medium text-ink">
            SONY CINEMA · Thiết kế trải nghiệm điện ảnh <Heart className="size-3.5 fill-deep text-deep" aria-label="yêu thương" />
          </p>
        </div>
      </div>
    </footer>
  );
}

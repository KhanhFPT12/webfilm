import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../common/Logo";

const linkCls = "text-xs sm:text-sm text-muted transition-colors hover:text-deep";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-sub/60 text-ink">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-muted">
            Một góc rạp phim nhỏ ấm áp — nơi Sony tìm phim theo cảm xúc mỗi ngày, lưu lại những bộ phim thương và xem tiếp từ chỗ đã dừng.
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
                Phim lẻ
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/phim-bo">
                Phim bộ
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
          </ul>
        </nav>

        <nav aria-label="Thông tin">
          <h2 className="text-xs font-bold tracking-wider text-ink uppercase">Thông tin</h2>
          <ul className="mt-3.5 space-y-2">
            <li>
              <Link className={linkCls} to="/thong-tin/lien-he">
                Liên hệ &amp; báo lỗi
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
                Nguồn dữ liệu &amp; bản quyền
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line/60">
        <div className="container-page flex flex-col gap-2.5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Dữ liệu phim từ API công khai NguonC. Đây là website cá nhân, <strong className="font-semibold text-ink">không phải</strong>{" "}
            sản phẩm hay dịch vụ của Sony Corporation.
          </p>
          <p className="flex shrink-0 items-center gap-1.5 font-medium text-ink">
            Dành riêng cho Sony với <Heart className="size-3.5 fill-deep text-deep" aria-label="yêu thương" /> · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

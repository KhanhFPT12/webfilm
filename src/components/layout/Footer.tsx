import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../common/Logo";

const linkCls = "rounded text-sm text-pastel/90 transition-colors hover:text-white hover:underline underline-offset-4";

export function Footer() {
  return (
    <footer className="mt-16 bg-deep text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-pastel/90">
            Một góc rạp phim hồng nhỏ xinh — nơi Sony tìm phim theo tâm trạng, lưu lại những bộ phim thương và xem tiếp từ chỗ đã dừng.
          </p>
        </div>

        <nav aria-label="Khám phá">
          <h2 className="text-sm font-bold tracking-wider uppercase">Khám phá</h2>
          <ul className="mt-4 space-y-2.5">
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
                Thể loại
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/quoc-gia">
                Quốc gia
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Của bạn">
          <h2 className="text-sm font-bold tracking-wider uppercase">Của bạn</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link className={linkCls} to="/yeu-thich">
                Góc phim yêu thích
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/lich-su">
                Lịch sử xem
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/tim-kiem">
                Tìm kiếm
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Thông tin">
          <h2 className="text-sm font-bold tracking-wider uppercase">Thông tin</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link className={linkCls} to="/thong-tin/lien-he">
                Liên hệ &amp; báo lỗi
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/thong-tin/quyen-rieng-tu">
                Chính sách quyền riêng tư
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

      <div className="border-t border-white/20">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-pastel/90 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Dữ liệu phim từ API công khai NguonC. Đây là website cá nhân, <strong className="font-semibold text-white">không phải</strong>{" "}
            sản phẩm hay dịch vụ của Sony Corporation.
          </p>
          <p className="flex shrink-0 items-center gap-1">
            Làm với <Heart className="size-3.5 fill-white text-white" aria-label="yêu thương" /> cho Sony · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

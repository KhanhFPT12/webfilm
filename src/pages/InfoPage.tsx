import type { ReactNode } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { useDocumentTitle } from "../hooks/useUtils";
import { NotFoundPage } from "./NotFoundPage";

const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();

const PAGES: Record<string, { title: string; body: ReactNode }> = {
  "lien-he": {
    title: "Liên hệ & báo lỗi nội dung",
    body: (
      <>
        <p>
          Nếu một bộ phim không phát được, sai thông tin hoặc có nội dung không phù hợp, hãy cho chúng mình biết tên phim, tập phim và đường
          dẫn trang bạn đang xem.
        </p>
        {CONTACT_EMAIL ? (
          <p>
            Gửi email tới{" "}
            <a
              className="font-semibold text-deep underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Báo lỗi phim")}`}
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : (
          <p>Kênh liên hệ đang được cập nhật.</p>
        )}
        <p>
          Lưu ý: phim, hình ảnh và trình phát được cung cấp bởi nguồn dữ liệu bên thứ ba (NguonC). Với các yêu cầu liên quan đến bản quyền,
          vui lòng liên hệ trực tiếp đơn vị cung cấp nội dung.
        </p>
      </>
    ),
  },
  "quyen-rieng-tu": {
    title: "Chính sách quyền riêng tư",
    body: (
      <>
        <p>Website không yêu cầu đăng ký tài khoản và không thu thập thông tin cá nhân của người dùng.</p>
        <p>
          Danh sách yêu thích và lịch sử xem được lưu bằng <strong>LocalStorage</strong> ngay trên trình duyệt của bạn, hoàn toàn riêng tư và không gửi lên máy chủ nào. Bạn có thể xoá bất cứ lúc nào tại trang{" "}
          <Link className="text-deep underline" to="/yeu-thich">
            Yêu thích
          </Link>
          ,{" "}
          <Link className="text-deep underline" to="/lich-su">
            Lịch sử xem
          </Link>{" "}
          hoặc bằng cách xoá dữ liệu duyệt web.
        </p>
        <p>
          Khi xem phim, trình duyệt kết nối trực tiếp tới máy chủ của nhà cung cấp dữ liệu (phim.nguonc.com, img.nguonc.com) và trình phát nhúng của họ.
        </p>
      </>
    ),
  },
  "dieu-khoan": {
    title: "Điều khoản sử dụng",
    body: (
      <>
        <p>Website là dự án cá nhân, phi thương mại, phục vụ mục đích giải trí và học tập.</p>
        <p>
          Nội dung phim không do website lưu trữ. Website không vượt qua DRM hay bất kỳ cơ chế bảo vệ bản quyền nào và chỉ hiển thị các nguồn phát mà API công khai cung cấp.
        </p>
        <p>Website không phải sản phẩm, dịch vụ hay đối tác của Sony Corporation, Sony Pictures hoặc bất kỳ công ty con nào.</p>
        <p>Người dùng tự chịu trách nhiệm tuân thủ pháp luật về bản quyền tại nơi mình sinh sống.</p>
      </>
    ),
  },
  "nguon-du-lieu": {
    title: "Nguồn dữ liệu & bản quyền",
    body: (
      <>
        <p>
          Toàn bộ thông tin phim, hình ảnh và đường dẫn trình phát được lấy theo thời gian thực từ API công khai của{" "}
          <a
            className="font-semibold text-deep underline underline-offset-4"
            href="https://phim.nguonc.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            NguonC
          </a>
          . Website không tự tạo hay chỉnh sửa dữ liệu phim.
        </p>
        <p>
          Những trường API không cung cấp sẽ không được hiển thị. Bản quyền phim thuộc về các hãng sản xuất và nhà phát hành tương ứng.
        </p>
      </>
    ),
  },
};

export function InfoPage() {
  const { page = "" } = useParams();
  const info = PAGES[page];
  useDocumentTitle(info?.title);
  if (!info) return <NotFoundPage />;

  return (
    <>
      <PageHeader title={info.title} crumbs={[{ to: `/thong-tin/${page}`, label: info.title }]} />
      <div className="container-page grid gap-8 py-10 md:grid-cols-[220px_1fr]">
        <nav aria-label="Trang thông tin" className="flex gap-1.5 overflow-x-auto scrollbar-none md:flex-col">
          {Object.entries(PAGES).map(([slug, p]) => (
            <NavLink
              key={slug}
              to={`/thong-tin/${slug}`}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive ? "bg-pastel/60 text-deep font-semibold" : "text-ink hover:bg-sub"
                }`
              }
            >
              {p.title}
            </NavLink>
          ))}
        </nav>
        <article className="max-w-2xl space-y-4 text-xs sm:text-sm leading-relaxed text-ink/85">
          {info.body}
        </article>
      </div>
    </>
  );
}

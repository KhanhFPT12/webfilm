import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { useDocumentTitle } from "../hooks/useUtils";

export function NotFoundPage({ message }: { message?: string }) {
  useDocumentTitle("Không tìm thấy trang");
  return (
    <div className="container-page py-16">
      <p className="mb-4 text-center text-5xl font-extrabold tracking-tight text-deep">404</p>
      <EmptyState
        title="Trang này không tồn tại"
        description={message ?? "Nội dung bạn tìm kiếm không tồn tại hoặc đã được dời đi nơi khác."}
        action={
          <>
            <Link to="/" className="btn-primary">
              Về trang chủ
            </Link>
            <Link to="/tim-kiem" className="btn-secondary">
              Tìm kiếm phim
            </Link>
          </>
        }
      />
    </div>
  );
}

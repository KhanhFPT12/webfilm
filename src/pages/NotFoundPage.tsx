import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { useDocumentTitle } from "../hooks/useUtils";

export function NotFoundPage({ message }: { message?: string }) {
  useDocumentTitle("Không tìm thấy trang");
  return (
    <div className="container-page py-16">
      <p className="mb-4 text-center text-6xl font-extrabold tracking-tight text-rose">404</p>
      <EmptyState
        title="Ơ, cuộn phim này bị lạc mất rồi"
        description={message ?? "Trang bạn tìm không tồn tại hoặc đã được dời đi nơi khác."}
        action={
          <>
            <Link to="/" className="btn-primary">
              Về trang chủ
            </Link>
            <Link to="/tim-kiem" className="btn-secondary">
              Tìm phim
            </Link>
          </>
        }
      />
    </div>
  );
}

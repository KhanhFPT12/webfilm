import { useEffect, useRef, useState, type ReactNode } from "react";

/** Hiện dần nội dung (trượt nhẹ lên) khi cuộn tới. Tự tắt nếu người dùng giảm chuyển động. */
interface Props {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  labelledBy?: string;
}

export function Reveal({ children, className = "", as: Tag = "div", labelledBy }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} aria-labelledby={labelledBy} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

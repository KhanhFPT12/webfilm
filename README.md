# SONY · Nơi xem phim của Sony 🎬💗

Website xem phim phong cách **Pink Cinema**, dùng dữ liệu thật từ API công khai **NguonC**.
React 18 + Vite + TypeScript + Tailwind CSS v4 + React Router + Lucide.

> Đây là website cá nhân, **không phải** sản phẩm hay dịch vụ của Sony Corporation.

## Cài đặt & chạy

Yêu cầu Node.js ≥ 20 (đã kiểm tra với Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # kiểm tra kiểu (tsc) + build ra dist/
npm run preview    # chạy bản build tại http://localhost:4173
```

Biến môi trường (không bắt buộc), tạo file `.env.local`:

```
VITE_CONTACT_EMAIL=email-cua-ban@example.com   # hiện ở trang "Liên hệ & báo lỗi"
```

### Triển khai

Đây là SPA nên mọi đường dẫn phải trả về `index.html`. Đã kèm sẵn:
`public/_redirects` (Netlify) và `vercel.json` (Vercel). Với Nginx: `try_files $uri /index.html;`.

## Endpoint đã xác minh (13/10/2026)

Base URL: `https://phim.nguonc.com/api` — CORS `Access-Control-Allow-Origin: *`, gọi trực tiếp từ trình duyệt, không cần proxy.

| Endpoint | Ghi chú |
| --- | --- |
| `GET /films/phim-moi-cap-nhat?page=N` | `{ status, paginate, items[] }`, 10 phim/trang |
| `GET /films/danh-sach/{phim-le\|phim-bo\|tv-shows}?page=N` | có thêm `cat` (`phim-dang-chieu` → 404) |
| `GET /films/the-loai/{slug}?page=N` | slug sai → 404 `Category movie doesn't exist!` |
| `GET /films/quoc-gia/{slug}?page=N` | như trên |
| `GET /films/nam-phat-hanh/{year}?page=N` | năm không có phim → `items: []` |
| `GET /films/search?keyword=...&page=N` | tìm cả tên Việt **và tên gốc** |
| `GET /film/{slug}` | `{ status, movie }`; slug sai → 404 `Movie doesn't exist` |

`page` phải trong khoảng 1–5000. Phản hồi được cache 5 phút trong bộ nhớ và các request trùng nhau được gộp lại.

**Các trường quan trọng**

- `thumb_url` là ảnh **dọc** (~336×504) → poster card; `poster_url` là ảnh **ngang** (~1280×720) → banner. Có thêm bản `*_webp` nhẹ hơn ~10 lần, được ưu tiên dùng, ảnh gốc làm dự phòng.
- `year` là chuỗi ở danh sách nhưng là số ở trang chi tiết.
- Chi tiết có `category` dạng `{ "1": { group: { name: "Định dạng" | "Thể loại" | "Năm" | "Quốc gia" }, list: [{ name }] } }` — **không có slug**, nên tên được ánh xạ sang slug đã xác minh trong [src/utils/catalog.ts](src/utils/catalog.ts); tên không ánh xạ được thì hiển thị dạng chữ, không gắn link.
- `episodes: [{ server_name, items: [{ name, slug, embed }] }]`. Một số tập có `embed` rỗng/không hợp lệ → hiển thị thông báo, không tự tạo URL.

## Giới hạn của API & cách xử lý

- **Nguồn phát chỉ là trang embed** (`https://embedN.streamc.xyz/embed.php?hash=...`), không có link `.m3u8`/`.mp4` trực tiếp. Trình phát nhúng bằng `<iframe>` đúng như nhà cung cấp đưa ra. `VideoPlayer` vẫn nhận diện được HLS (tải `hls.js` động) và file MP4 nếu sau này API trả về.
- Host embed dùng Cloudflare và **chặn trình duyệt tự động / curl** (403 "Sorry, you have been blocked"). Với Chrome thường thì trình phát tải bình thường (đã kiểm tra). Nếu bị chặn, trình phát có nút **Tải lại**, kèm cảnh báo khi phản hồi chậm.
- **Quảng cáo:** iframe có `sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"` (không có `allow-popups`/`allow-top-navigation`) nên bấm vào trình phát **không mở tab quảng cáo hay chuyển hướng trang** (đã kiểm tra: 0 popup). Video quảng cáo chèn trước bên trong trình phát do nhà cung cấp đặt và không thể gỡ từ phía website; người xem bấm "Bỏ qua quảng cáo" để vào phim. Nếu nhà cung cấp bắt đầu từ chối phát trong sandbox, hãy bỏ thuộc tính này trong `VideoPlayer.tsx`.
- Iframe khác domain nên **không đọc được mốc thời gian đang xem**. Lịch sử lưu phim + tập + server để xem tiếp.
- Không có endpoint liệt kê thể loại/quốc gia → danh sách được duy trì thủ công, chỉ gồm các slug đã gọi thử thành công. Thể loại "Phim 18+" có tồn tại nhưng cố ý không hiển thị.
- API không hỗ trợ kết hợp nhiều bộ lọc (ví dụ thể loại + quốc gia) → mỗi trang danh mục lọc theo một tiêu chí.
- API không có điểm đánh giá/lượt xem → website không hiển thị các số liệu đó.

## Tính năng

- Trang chủ: hero lấy phim thật (chọn được 5 phim nổi bật), Xem tiếp, Mới cập bến rạp hồng, thể loại, phim lẻ, phim bộ, Góc phim của Sony.
- Danh mục `/phim-moi`, `/phim-le`, `/phim-bo`, `/tv-shows`, `/the-loai[/:slug]`, `/quoc-gia[/:slug]`, `/nam/:year` — phân trang qua `?page=` (mỗi trang giao diện = 2 trang API = 20 phim).
- Tìm kiếm `/tim-kiem?q=` — debounce 450 ms, đồng bộ URL, nút xoá, trạng thái loading/rỗng/lỗi.
- Chi tiết `/phim/:slug` — chỉ hiển thị trường có dữ liệu, chọn server/tập, chia sẻ (Web Share API hoặc sao chép link), phim liên quan cùng thể loại.
- Xem phim `/xem-phim/:slug?tap=&sv=` — nền mận đậm, tập trước/tiếp, chọn server, tìm tập (phim dài), toàn màn hình, tự tiếp tục tập đang xem.
- Yêu thích `/yeu-thich` (lọc, sắp xếp, xoá từng phim/xoá hết) và Lịch sử `/lich-su` (tối đa 50 mục, xoá từng mục/xoá hết) — lưu LocalStorage, đồng bộ giữa các trang và các tab.
- Trang thông tin: liên hệ, quyền riêng tư, điều khoản, nguồn dữ liệu.
- Mọi khu vực tải dữ liệu đều có skeleton, trạng thái lỗi (HTTP / timeout 15 s / mất mạng / JSON hỏng) kèm nút thử lại, và trạng thái rỗng.

## Cấu trúc

```
src/
  api/          client.ts (fetch + timeout + cache + lỗi), movies.ts (endpoint + chuẩn hoá dữ liệu)
  components/
    common/     Logo, PosterImage, LoadingSkeleton, ErrorState, EmptyState, Pagination, Toast, PageHeader, SectionHeader
    layout/     Header, MobileMenu, SearchBox, Footer, Layout, nav
    movie/      MovieCard, MovieGrid, MovieSection, HeroBanner, FavoriteButton, EpisodeList, VideoPlayer, RelatedMovies
  hooks/        useMovies (useQuery), useFavorites, useWatchHistory, useUtils
  pages/        Home, Search, Category, Taxonomy, MovieDetail, Watch, Favorites, History, Info, NotFound
  types/        movie.ts (kiểu thô từ API + kiểu đã chuẩn hoá)
  utils/        catalog.ts, formatters.ts, storage.ts, video.ts
```

## Đã kiểm thử

Chạy trên bản build (`vite preview`) bằng Chrome:

- Không bị tràn ngang ở 14 route × 5 kích thước (375, 430, 768, 1366, 1920 px), không có lỗi console.
- Trái tim không mở trang chi tiết; yêu thích được lưu và còn sau khi tải lại; badge trên header cập nhật.
- Tìm kiếm đồng bộ URL, có kết quả thật, trạng thái rỗng, nút xoá từ khoá.
- Phân trang, truy cập trực tiếp trang chi tiết, 404 cho phim/thể loại không tồn tại.
- Trang xem phim: iframe embed, ghi lịch sử, tập tiếp, tự tiếp tục từ lịch sử; trình phát hiển thị được trong Chrome thường.
- Menu mobile mở/đóng (Esc, giữ focus trong menu); mất mạng → báo lỗi → có mạng lại, bấm thử lại thì tải được.
- Tất cả ảnh trên trang chủ tải thành công sau khi cuộn trang.

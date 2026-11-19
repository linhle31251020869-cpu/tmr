# THE MYSTIC ROOM — Hệ thống quản lý User, Tracking hành vi & CRM

## 1. Mô tả dự án
Xây dựng hệ thống quản lý người dùng và theo dõi hành vi thực tế (lưu vào database) cho website
THE MYSTIC ROOM. Mục tiêu:
- Lưu đầy đủ thông tin user khi đăng ký (họ tên, email, ngày sinh, giới tính, đồng ý marketing...).
- Theo dõi hành trình của từng user qua các tính năng (Mystic Mirror, Birth Chart, Numerology, Tarot, Vòng tay, Giỏ hàng, Mua hàng) với số lần + mốc thời gian.
- Admin Dashboard xem toàn bộ user, lọc theo nhóm hành vi, xem timeline chi tiết.
- Dữ liệu sẵn sàng cho email marketing theo hành vi.
- Newsletter popup cho khách chưa có tài khoản.
- Hệ thống Voucher (tạo/quản lý/áp dụng khi thanh toán).

Đây là hệ thống thật, gắn với Backend (Readdy Backend), không phải demo giao diện.

## 2. Cấu trúc trang
Hiện có:
- `/admin` - Quản trị Blog (đang tồn tại)
- `/admin/editor`, `/admin/editor/:id` - Trình soạn bài viết

Bổ sung / điều chỉnh:
- `/admin` - Chuyển thành khu Quản trị có tab: **Blog · Người dùng · Voucher**
- `/admin/users` - Danh sách user + bộ lọc nhóm hành vi (nay có MBTI, tiến độ khám phá %, Last Login/Visit dạng "x ngày trước")
- `/admin/users/:id` - Chi tiết 1 user + timeline hành trình + lịch sử mua hàng
- `/admin/vouchers` - Quản lý voucher (nay có điều kiện + sản phẩm áp dụng)
- `/admin/orders` - Quản lý lịch sử mua hàng toàn hệ thống + bộ lọc
- `/admin/email` - Email Marketing (nhóm hành vi + danh sách email đã đồng ý)
- `/thanh-toan` - Bổ sung ô nhập mã voucher
- Popup Newsletter - hiển thị trên toàn site cho khách chưa đăng nhập

### Trang yêu cầu đăng nhập (RequireAuth)
Bắt buộc đăng nhập/đăng ký mới trải nghiệm được:
`/explore/mystic-mirror`, `/explore/moon-window`, `/explore/numerology`,
`/explore/tarot-table`, `/thiet-ke-vong`, `/thanh-toan`, `/my-profile`.
Các trang Trang Chủ, Blog, Giới Thiệu, Chính Sách vẫn xem tự do.

### Bảng dữ liệu bổ sung (Phase 5)
- `vouchers`: code, discount_type (percent/fixed), discount_value, min_order, starts_at, expires_at, max_uses, used_count, active.
- `voucher_redemptions`: voucher_id, user_id, order_id, code, discount_amount.
- Hàm `redeem_voucher(code, order_id, discount)`: tăng lượt dùng + ghi log, chặn vượt lượt (SECURITY DEFINER).

## 3. Danh sách chức năng
- [x] Lưu thông tin user khi đăng ký + tự tạo hồ sơ
- [x] Ghi nhận last_login, last_visit, total_visits
- [x] Tracking hành vi từng tính năng (số lần + thời gian)
- [x] Log sự kiện chi tiết (timeline) cho từng user
- [x] Trang cá nhân: cho phép user cập nhật họ tên, ngày sinh, giới tính, đồng ý marketing
- [x] Admin Dashboard danh sách user + lọc nhóm
- [x] Admin chi tiết user + timeline
- [x] Newsletter popup (khách vãng lai)
- [x] Quản lý Voucher (CRUD, bật/tắt, %/số tiền, thời hạn, lượt dùng)
- [x] Áp dụng voucher ở trang thanh toán
- [x] Email welcome khi đăng ký (Brevo — chỉ gửi cho đăng ký mới thành công; chờ nạp BREVO_API_KEY để gửi thật)
- [x] Dữ liệu nền cho email marketing theo hành vi (nhóm + danh sách email)
- [x] Bắt buộc đăng nhập cho các trang trải nghiệm
- [x] Admin User Dashboard bổ sung: MBTI, tiến độ khám phá %, Last Login/Visit tương đối, bộ lọc mới
- [x] Quản lý lịch sử mua hàng (Order History) + lọc theo ngày/sản phẩm/trạng thái/thanh toán/khách
- [x] Voucher bổ sung: điều kiện áp dụng + sản phẩm áp dụng (kiểm tra khi checkout)
- [x] Xóa tài khoản: user tự xóa tài khoản của mình (Vùng Nguy Hiểm ở `/my-profile`)
- [x] Admin xóa tài khoản người dùng trong database (danh sách + chi tiết user)
- [x] Hình ảnh đá thật cho Chế tác vòng tay (đổi màu đúng theo đá đã chọn ở cả bộ chọn và bản xem trước); charm Trái Tim bạc gọn đồng bộ
- [x] Moon Window: chọn nơi sinh linh hoạt, không mặc định cố định về Hà Nội
- [x] Hiệu ứng xào bài Tarot (keyframes cardScatter + nhịp thở của bộ bài)

## 4. Thiết kế dữ liệu

### Bảng: user_profiles (thông tin + tổng hợp hành vi để hiển thị nhanh)
| Field | Type | Mô tả |
|-------|------|-------|
| id | bigint | PK |
| user_id | text | = auth.uid(), unique |
| full_name | text | Họ và tên |
| email | text | Email |
| birth_date | date | Ngày sinh |
| gender | text | Giới tính (không bắt buộc) |
| marketing_consent | boolean | Đồng ý nhận email marketing |
| created_at | timestamptz | Ngày đăng ký |
| last_login_at | timestamptz | Lần đăng nhập gần nhất |
| last_visit_at | timestamptz | Lần truy cập gần nhất |
| total_visits | int | Tổng số lần truy cập |
| mirror_started / mirror_completed | boolean | Mystic Mirror |
| mirror_mbti | text | Kết quả MBTI |
| mirror_completed_at | timestamptz | Thời gian hoàn thành |
| birthchart_entered / birthchart_viewed | boolean | Moon Window |
| birthchart_viewed_at | timestamptz | Thời gian xem |
| numerology_entered / numerology_viewed | boolean | Numerology |
| numerology_viewed_at | timestamptz | Thời gian xem |
| tarot_drawn / tarot_viewed | boolean | Tarot |
| tarot_viewed_at | timestamptz | Thời gian thực hiện |
| bracelet_viewed | boolean | Đã xem trang vòng tay |
| bracelet_view_count | int | Số lần xem vòng tay |
| bracelet_craft_clicked / started / completed | boolean | Chế tác |
| bracelet_craft_at | timestamptz | Thời gian hoàn thành chế tác |
| cart_added | boolean | Đã thêm giỏ |
| cart_added_at | timestamptz | Thời gian thêm giỏ |
| purchased | boolean | Đã mua |
| purchased_at | timestamptz | Thời gian mua |
| welcome_email_sent_at | timestamptz | Đã gửi email welcome |
| updated_at | timestamptz | |

### Bảng: user_events (log sự kiện — nguồn sự thật cho timeline)
| Field | Type | Mô tả |
|-------|------|-------|
| id | bigint | PK |
| user_id | text | = auth.uid() |
| event_type | text | visit, login, mirror_started, mirror_completed, birthchart_entered, birthchart_viewed, numerology_entered, numerology_viewed, tarot_drawn, tarot_viewed, bracelet_view, bracelet_craft_click, bracelet_craft_start, bracelet_craft_complete, cart_add, purchase |
| metadata | jsonb | Dữ liệu kèm theo |
| created_at | timestamptz | Thời điểm |

### Bảng: newsletter_subscribers (khách chưa có tài khoản)
| Field | Type | Mô tả |
|-------|------|-------|
| id | bigint | PK |
| name | text | Tên |
| email | text | unique |
| marketing_consent | boolean | Đồng ý nhận tin |
| source | text | popup / footer / checkout |
| created_at | timestamptz | |

### Bảng: vouchers
| Field | Type | Mô tả |
|-------|------|-------|
| id | bigint | PK |
| code | text | Mã (unique, uppercase) |
| discount_type | text | percent / fixed |
| discount_value | numeric | Giá trị giảm |
| starts_at / expires_at | timestamptz | Thời gian hiệu lực |
| max_uses | int | Số lượt (null = không giới hạn) |
| used_count | int | Đã dùng |
| conditions | text | Điều kiện áp dụng (mô tả) |
| applicable_products | text[] | Sản phẩm áp dụng (rỗng = tất cả sản phẩm) |
| active | boolean | Bật/tắt |
| created_at / updated_at | timestamptz | |

### Bảng: voucher_redemptions
| Field | Type | Mô tả |
|-------|------|-------|
| id | bigint | PK |
| voucher_id | bigint | FK vouchers |
| user_id | text | |
| order_id | bigint | FK order_headers |
| discount_amount | numeric | |
| created_at | timestamptz | |

### RLS (theo mẫu hiện có: auth.uid()::text = user_id, admin dùng is_admin())
- user_profiles: user select/insert/update hồ sơ của mình; admin select/update tất cả.
- user_events: user insert/select của mình; admin select tất cả.
- newsletter_subscribers: anon + auth insert; admin select.
- vouchers: anon/auth select voucher đang active (để kiểm tra khi thanh toán); admin toàn quyền.
- voucher_redemptions: user insert của mình + select của mình; admin select tất cả.

## 5. Kế hoạch Backend / tích hợp
- Database: **Readdy Backend (đã kết nối)** — tạo bảng + RLS bằng SQL.
- Email (welcome + marketing): dùng **Brevo** transactional API (`POST https://api.brevo.com/v3/smtp/email`). Cần secret server-side `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` (sender đã xác minh), `BREVO_SENDER_NAME` (tùy chọn). Không còn dùng Resend.
- Thanh toán: hiện dùng COD/VietQR nội bộ; voucher áp dụng trực tiếp vào tổng đơn.
- Shopify/Stripe: chưa dùng.

## 6. Kế hoạch phát triển theo giai đoạn

### Phase 1: Nền tảng dữ liệu + Tracking hành vi
- Goal: Có bảng lưu user + sự kiện, và mọi hành động trên site được ghi lại gắn đúng user.
- Deliverable:
  - Tạo các bảng user_profiles, user_events (+ RLS).
  - Tự tạo hồ sơ khi user đăng ký/đăng nhập.
  - Cập nhật last_login, last_visit, total_visits.
  - Gắn tracking vào: Mystic Mirror, Moon Window, Numerology, Tarot, Vòng tay (xem/chế tác/giỏ/mua).

### Phase 2: Trang hồ sơ user
- Goal: User xem/cập nhật thông tin cá nhân (họ tên, ngày sinh, giới tính, đồng ý marketing).
- Deliverable: Cập nhật trang `/my-profile` với form thông tin.

### Phase 3: Admin Dashboard User
- Goal: Admin xem danh sách user, lọc nhóm, xem timeline.
- Deliverable:
  - Tab Quản trị: Blog · Người dùng · Voucher.
  - `/admin/users`: bảng user + cột hành vi + bộ lọc nhóm.
  - `/admin/users/:id`: chi tiết + timeline.

### Phase 4: Newsletter popup
- Goal: Thu email khách chưa có tài khoản.
- Deliverable: Popup email + tên + checkbox đồng ý; lưu vào newsletter_subscribers.

### Phase 5: Voucher — HOÀN THÀNH
- Goal: Hệ thống voucher hoàn chỉnh.
- Deliverable:
  - `/admin/vouchers`: CRUD + bật/tắt + theo dõi lượt dùng.
  - Ô nhập mã + kiểm tra hợp lệ ở `/thanh-toan` (tồn tại, đang bật, trong thời gian, còn lượt, đủ đơn tối thiểu).

### Phase 6: Email marketing — HOÀN THÀNH (đã chuyển sang Brevo)
- Goal: Gửi welcome email + chuẩn bị automation theo hành vi.
- Deliverable:
  - Edge function `send-welcome-email` (đã deploy) — gửi bằng **template Brevo** (transactional `templateId`), KHÔNG dựng HTML trong code. Tên user được truyền qua personalization param (`params.FIRSTNAME`), lấy từ `user_profiles.full_name` (trigger `handle_new_user` điền lúc đăng ký) hoặc `user_metadata.full_name`. CTA URL kèm UTM được truyền qua `params.CTA_URL`. Chỉ gửi khi có tài khoản MỚI đăng ký thành công (cửa sổ 24h) và chưa gửi trước đó; KHÔNG gửi khi user chỉ đăng nhập. Đọc `BREVO_API_KEY` + `BREVO_SENDER_EMAIL` (+ `BREVO_SENDER_NAME`, `BREVO_TEMPLATE_ID`) từ Backend secrets. Nếu chưa cấu hình thì bỏ qua an toàn, không làm hỏng đăng ký.
  - Lưu ý quan trọng: Brevo **Campaign template** KHÔNG dùng được với API gửi tự động — phải tạo **Transactional template** (Transactional → Templates) từ thiết kế campaign, rồi lấy ID của nó làm `BREVO_TEMPLATE_ID`.
  - `/admin/email`: 5 nhóm chiến dịch (mới đăng ký, chưa khám phá, xem vòng chưa mua, giỏ chưa thanh toán, lâu ngày không truy cập) kèm danh sách email đã đồng ý nhận.
  - Bước còn lại: tạo Transactional template trong Brevo + nạp secret (`BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_TEMPLATE_ID`) để email thực sự được gửi.

### Phase 7: Mở rộng Admin Dashboard, Order History & Voucher — HOÀN THÀNH
- Goal: Bổ sung các trường và chức năng còn thiếu, giữ nguyên toàn bộ chức năng cũ.
- Deliverable:
  - `/admin/users`: thêm cột MBTI, tiến độ khám phá (%), Last Login/Visit dạng tương đối ("5 ngày trước"), và bộ lọc mới (chưa hoàn thành Mystic Mirror, chưa xem sản phẩm, lâu không truy cập, đã mua hàng, đã dùng/quan tâm Tarot).
  - `/admin/orders`: danh sách toàn bộ đơn hàng gắn với User ID (tên, email, SĐT, mã đơn, ngày, sản phẩm, số lượng, giá, tổng tiền, voucher + số tiền giảm, phương thức thanh toán, trạng thái). Lọc theo ngày, sản phẩm, trạng thái, phương thức thanh toán, khách hàng.
  - `/admin/users/:id`: thêm mục Lịch Sử Mua Hàng của từng user.
  - Voucher: thêm `conditions` (điều kiện áp dụng) và `applicable_products` (sản phẩm áp dụng); checkout kiểm tra đồng thời mã, thời hạn, điều kiện, sản phẩm và số lượt còn lại.

### Phase 8: Xóa tài khoản, hình ảnh đá thật & tối ưu hiệu năng — HOÀN THÀNH
- Goal: Bổ sung các yêu cầu mới mà không phá vỡ luồng hiện có.
- Deliverable:
  - Edge function `delete-account` (đã deploy): user tự xóa tài khoản của mình; admin xóa tài khoản người khác (kiểm tra `is_admin()`). Xác thực JWT bằng anon client + thực thi bằng service-role client; dọn `user_profiles`, `user_events`, `mystic_profiles`, `mystic_results` rồi xóa auth user.
  - `/my-profile`: thêm "Vùng Nguy Hiểm" + modal xác nhận xóa tài khoản (tự đăng xuất sau khi xóa).
  - `/admin/users` + `/admin/users/:id`: nút xóa người dùng + modal xác nhận.
  - Chế tác vòng tay: mỗi loại đá có ảnh viên đá thật riêng (dùng ảnh cho cả thumbnail bộ chọn và từng hạt trong bản xem trước SVG); charm Trái Tim đổi sang bạc, gọn và đồng bộ.
  - Moon Window: bỏ mặc định Hà Nội, khớp tên tỉnh/thành chặt chẽ, báo lỗi rõ nếu không khớp (thay vì âm thầm dùng Hà Nội).
  - Tarot: bật hiệu ứng xào bài thật (keyframes `cardScatter`, `deckBreath`).
  - Hiệu năng: giảm số `preconnect` (còn 3 nguồn quan trọng nhất, phần còn lại chuyển `dns-prefetch`); nạp CSS font/icon không chặn hiển thị (`media=print`+`onload`); ảnh trang chủ dùng biến thể nhỏ cho mobile qua `<picture>`. Lưu ý: thời gian cache/trình duyệt do CDN/nền tảng publish quyết định, không đổi được từ code.

## 7. Ghi chú
- Email marketing và welcome email dùng Brevo: code đã sẵn sàng, chỉ cần nạp secret `BREVO_API_KEY` + `BREVO_SENDER_EMAIL` (sender đã xác minh trong Brevo) là chạy ngay. Toàn bộ code Resend trước đây đã được thay thế bằng Brevo.
- Các trang trải nghiệm bắt buộc đăng nhập để mọi hành vi gắn đúng user và phục vụ tracking + email automation.
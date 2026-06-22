# HEATWAVE SHOWCASE #3: APOCALYPSE - Scoring System

<div align="center">

**Hệ thống chấm điểm & quản lý giải thưởng cho đêm Showcase vũ đạo sinh viên**

_Hợp tác phát triển bởi **[CLB F-Code](https://www.facebook.com/fcodeclub)** và **[CLB FStyle Crew](https://www.facebook.com/FStyleFamily)**_

**Được [HTV đưa tin](https://htv.vn/heatwave-showcase-mua-3-apocalypse-noi-sinh-vien-ke-chuyen-bang-ngon-ngu-vu-dao-222260611214349823.htm)** - _"Nơi sinh viên kể chuyện bằng ngôn ngữ vũ đạo"_

<img src="https://lh3.googleusercontent.com/pw/AP1GczMOo_Y1wKBzgvw8o7SyI2qbiy70CakBEd90BnZMyb08wbkwcxFZ_c2GNz0oK-DRc_pTg5cTwqu9lcNn5-nxZW7Q_vrtSDjnaoq8Fi_Tsr34lCqvv7U1D7cOcYKRmecnKv-l5nX73kV9KLl7yh2gnNY=w2561-h1931-s-no-gm?authuser=0" alt="Heatwave Showcase #3: APOCALYPSE" width="100%" />
<img src="https://lh3.googleusercontent.com/pw/AP1GczO8ZbQ0jjxaFY868-VOTNZY5HhiIoDBzhhAQedIJQFapSCOmD8BFhVFzbpucfkiW9OmxTNSGsGq5O49kiowq54noOV15tY3zr9ZrdeSK6uvkQS08A8tAbT6KU8CkXbvJapM5DPZWUp9KtWrLTMEudA=w2561-h1931-s-no-gm?authuser=0" alt="Heatwave Showcase #3: APOCALYPSE" width="100%" />

</div>

---

## Giới thiệu

Hệ thống chấm điểm phục vụ sự kiện **Heatwave Showcase Mùa 3: APOCALYPSE** - đêm trình diễn vũ đạo lớn nhất của CLB FStyle Crew, Đại học FPT TP.HCM. Sự kiện quy tụ **4 đội thi** gồm 42 sinh viên tranh tài qua các phần trình diễn sáng tạo, được đánh giá bởi ban giám khảo chuyên môn.

Hệ thống hỗ trợ toàn bộ quy trình vận hành đêm Showcase: từ nhập điểm BGK, bình chọn Giải Nỗ lực, đến hiển thị leaderboard realtime trên sân khấu - giúp BTC tập trung vào sự kiện thay vì xử lý thủ công.

## Chức năng hệ thống

### Chấm điểm Ban Giám Khảo

- 3 BGK chấm độc lập cho mỗi đội, tổng 100 điểm/đội
- 6 hạng mục: Ý tưởng & Concept, Choreography & Kỹ thuật biên đạo, Đồng đều & Đội hình, Performance & Stage Presence, Phục trang & Hình ảnh, Âm nhạc & Biên tập
- BTC F-Code nhập điểm hộ BGK qua form, mỗi đội 1 form × 3 cột BGK
- Điểm trung bình 3 BGK → xếp hạng tự động: Quán Quân / Á Quân / Khuyến khích

### Bình chọn Giải Nỗ lực

- Thành viên vote tối đa 2 người trong team mình (không vote chính mình)
- BTC FStyle vote tối đa 2 người mỗi team (xuyên suốt 4 đội)
- Thời hạn bình chọn có kiểm soát, được phép thay đổi lựa chọn trong thời hạn
- Kết quả vote chiếm 40% tổng điểm Nỗ lực (+ 30% BTC đánh giá + 30% chuyên cần)

### Leaderboard Realtime

- Cập nhật tức thì khi BTC nhập điểm hoặc công bố giải thưởng
- Hiển thị trực tiếp trên sân khấu đêm Showcase qua Socket.io
- Hỗ trợ MC theo dõi kết quả trực tiếp

### Quản lý giải thưởng

10 hạng mục giải thưởng, kết hợp tự động và nhập tay:

| Giải                              | Cách xác định                                               |
| --------------------------------- | ----------------------------------------------------------- |
| Quán Quân · Á Quân · Khuyến khích | Tự động từ điểm TB BGK                                      |
| Yêu thích                         | BTC nhập tay (50% vote fanpage + 50% vote trực tiếp)        |
| Kỹ thuật · Biên đạo · Phong cách  | BTC nhập tay (điểm chuyên môn BGK)                          |
| Trưởng nhóm                       | BTC nhập tay (quá trình + đánh giá BTC)                     |
| Nỗ lực                            | 1 người/team - BTC nhập kết quả sau khi tính ngoài hệ thống |
| Tri ân Mentor                     | Trao riêng tại đêm onsite                                   |

### Phân quyền & Bảo mật

| Vai trò                | Quyền hạn                                                        |
| ---------------------- | ---------------------------------------------------------------- |
| **BTC F-Code** (Admin) | Nhập điểm BGK, nhập giải thưởng, quản lý tài khoản, xem thống kê |
| **BTC FStyle**         | Vote Nỗ lực (xuyên suốt), nhập giải thủ công, xem leaderboard    |
| **MC**                 | Xem leaderboard                                                  |
| **Thành viên** (4 đội) | Vote Nỗ lực (trong team mình)                                    |

- Tài khoản do Admin cấp - không đăng ký tự do
- Xác thực qua email kích hoạt (token lưu Redis, có TTL)
- JWT access/refresh token, tự động refresh khi hết hạn

## Tech Stack

### Frontend

|           |                                      |
| --------- | ------------------------------------ |
| Framework | React 19 · TypeScript · Vite 7       |
| Styling   | Tailwind CSS 4 · shadcn/ui (Radix)   |
| State     | Redux Toolkit · TanStack React Query |
| Realtime  | Socket.io-client                     |

### Backend

|               |                           |
| ------------- | ------------------------- |
| Framework     | Express 5 · TypeScript    |
| Database      | MySQL 8 · Drizzle ORM     |
| Cache & Queue | Redis 7 · BullMQ          |
| Auth          | JWT · bcrypt · Nodemailer |

### Infrastructure

|            |                                             |
| ---------- | ------------------------------------------- |
| Container  | Docker Compose (MySQL + Redis + phpMyAdmin) |
| Validation | Zod 4                                       |
| Realtime   | Socket.io                                   |

## Cài đặt & Chạy

```bash
# 1. Clone repo
git clone https://github.com/hoangtuanqn/fstyle-shc3.git
cd fstyle-shc3

# 2. Khởi động infrastructure
docker compose up -d          # MySQL 8 + Redis 7 + phpMyAdmin

# 3. Backend
cd backend
npm install
cp .env.example .env          # Điền thông tin cấu hình
npx drizzle-kit generate
npx drizzle-kit migrate
npm run dev                   # → http://localhost:8000

# 4. Frontend
cd ../frontend
npm install
npm run dev                   # → http://localhost:5173
```

## Đội ngũ phát triển

| Vai trò                             | Người               | Đơn vị                    |
| ----------------------------------- | ------------------- | ------------------------- |
| Project Lead & Full-stack Developer | **Phạm Hoàng Tuấn** | F-Code Club, MST Software |

Phát triển bởi **[F-Code Club](https://www.facebook.com/fcodeclub)** x **[MST Software](https://www.facebook.com/mstsoftware.vn)** - phục vụ cộng đồng sinh viên FPT University HCM.

## Sự kiện

|                  |                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tên sự kiện**  | Heatwave Showcase Mùa 3: APOCALYPSE                                                                                                                                         |
| **Tổ chức**      | CLB FStyle Crew - FPT University HCM                                                                                                                                        |
| **Đêm Showcase** | 05/07/2026, 18:00 - Hall A, FPT University HCM                                                                                                                              |
| **Đội thi**      | SHIRO KURO · Apex Aura · SLATT · ANTI-X                                                                                                                                     |
| **Báo chí**      | [HTV - Nơi sinh viên kể chuyện bằng ngôn ngữ vũ đạo](https://htv.vn/heatwave-showcase-mua-3-apocalypse-noi-sinh-vien-ke-chuyen-bang-ngon-ngu-vu-dao-222260611214349823.htm) |

---

<div align="center">

_Hệ thống được xây dựng với mục tiêu phục vụ sự kiện sinh viên - không vì mục đích thương mại._

**F-Code Club** x **MST Software** · FPT University HCM · 2026

</div>

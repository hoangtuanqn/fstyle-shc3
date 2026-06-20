# HEATWAVE SHOWCASE #3: APOCALYPSE — Tài liệu hệ thống

Hệ thống quản lý sự kiện cho đêm Showcase giữa CLB F-Code và CLB FStyle Crew.

---

## Timeline

| Mốc | Thời gian |
|---|---|
| Mở voting | 29/6/2026 |
| Đóng voting | 23:59 ngày 3/7/2026 |
| Đêm Showcase onsite | 5/7/2026 |

---

## Roles

| Role | Mô tả |
|---|---|
| **Thành viên** | Thành viên 4 đội thi. Vote cho Giải Nỗ lực (trong team mình). |
| **MC** | MC đêm Showcase. Chỉ xem leaderboard. |
| **BTC FStyle** | Ban tổ chức CLB FStyle Crew. Vote Nỗ lực (xuyên suốt các team) + nhập giải thưởng thủ công + xem leaderboard. |
| **BTC F-Code** | Ban tổ chức CLB F-Code. Nhập điểm BGK + nhập giải thưởng + xem leaderboard + xem bảng thống kê điểm từng nhóm. |

> Không có đăng ký tự do — tất cả account do Admin (BTC F-Code) cấp.

---

## Voting (Giải Nỗ lực)

### Quy tắc chung

- Vote trong thời hạn: **29/6/2026 → 23:59 ngày 3/7/2026**
- Được phép **thay đổi lựa chọn** trong thời hạn
- Mỗi người vote tối đa **2 lượt** (2 người khác nhau, không vote 1 người 2 lần)

### Theo role

| Role | Phạm vi xem | Giới hạn vote |
|---|---|---|
| **Thành viên** | Chỉ thấy thành viên trong team mình | Vote tối đa 2 người trong team, không vote chính mình |
| **BTC FStyle** | Thấy tất cả các team | Vote tối đa 2 người mỗi team |

---

## Chấm điểm BGK (Giải 1–3)

- **Ai nhập:** BTC F-Code nhập hộ cả 3 BGK
- **Format:** 1 form per team → 3 cột (BGK 1 / BGK 2 / BGK 3)
- **Tổng:** 4 nhóm = 4 form, mỗi form 100 điểm tối đa
- **Xếp hạng tự động:** Điểm trung bình 3 BGK → Quán Quân / Á Quân / Khuyến khích
- **Chi tiết tiêu chí:** xem [`SCORING_CRITERIA.md`](./SCORING_CRITERIA.md)

---

## Bảng giải thưởng

| # | Giải | Số lượng | Cách xác định | Hệ thống |
|---|---|---|---|---|
| 1 | Quán Quân | 1 | Điểm TB BGK cao nhất | **Tự động** |
| 2 | Á Quân | 1 | Điểm TB BGK cao nhì | **Tự động** |
| 3 | Khuyến khích | 2 | Điểm TB BGK cao 3 (2 nhóm) | **Tự động** |
| 4 | Yêu thích | 1 | BTC FStyle nhập tay (tổng hợp vote online fanpage + vote trực tiếp đêm onsite) | **Nhập tay** |
| 5 | Kỹ thuật | 1 | BTC nhập tay (điểm Kỹ thuật BGK) | **Nhập tay** |
| 6 | Biên đạo | 1 | BTC nhập tay (điểm Biên đạo BGK) | **Nhập tay** |
| 7 | Trưởng nhóm | 1 | BTC nhập tay (điểm quá trình + đánh giá BTC) | **Nhập tay** |
| 8 | Phong cách | 1 | BTC nhập tay (điểm Phục trang BGK) | **Nhập tay** |
| 9 | Nỗ lực | 4 (1/team) | BTC tự tính ngoài hệ thống (40% vote + 30% BTC + 30% chuyên cần) → nhập kết quả | **Nhập tay** |
| 10 | Tri ân Mentor | 13 | Trao riêng tại đêm onsite, không hiển thị trên leaderboard | N/A |

### Cơ chế tính Giải Nỗ lực (tham khảo, BTC tự tính)

- 40% — Vote của thành viên trong hệ thống
- 30% — Đánh giá của BTC
- 30% — Chuyên cần

---

## Leaderboard

Hiển thị 2 phần:

1. **Bảng xếp hạng nhóm** — điểm trung bình BGK, xếp theo thứ hạng (tự động từ điểm đã nhập)
2. **Danh sách giải thưởng** — cập nhật **realtime** (Socket.io) khi BTC nhập giải

> BTC F-Code có thêm bảng thống kê điểm từng nhóm (điểm từng BGK + điểm TB).

---

## Kỹ thuật

| Tính năng | Mô tả |
|---|---|
| **Realtime** | Socket.io — khi BTC nhập giải thưởng, leaderboard cập nhật ngay cho tất cả client |
| **Auto-save** | Form nhập điểm BGK tự động lưu sau khi nhập, kèm nút lưu thủ công |
| **CORS** | Cấu hình domain trong `.env` |
| **Auth** | JWT — account do Admin cấp, không có đăng ký tự do |
| **Role-based access** | Mỗi route/tính năng kiểm tra role trước khi cho phép |

---

## Dữ liệu tham khảo

- [`MEMBERS.md`](./MEMBERS.md) — Danh sách thành viên 4 team + BTC
- [`AWARD.md`](./AWARD.md) — Cơ cấu giải thưởng chi tiết
- [`SCORING_CRITERIA.md`](./SCORING_CRITERIA.md) — Tiêu chí chấm điểm BGK (100 điểm)

---

## Danh sách teams

| Team | Số thành viên |
|---|---|
| SHIRO KURO | 10 |
| Apex Aura | 11 |
| SLATT | 11 |
| ANTI-X | 10 |

import bcrypt from "bcrypt";
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { awards, btcScores, judgeScores, teams, users } from "~/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

const DEFAULT_PASSWORD = "fstyle2026";
const SALT_ROUNDS = 10;

async function seed() {
  console.log("🌱 Seeding database...");
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // ── 1. Teams ───────────────────────────────────────
  const teamData = [
    {
      id: crypto.randomUUID(),
      name: "SHIRO KURO",
      concept: "EMPTINESS",
      color: "#d0d0d0",
      displayOrder: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Apex Aura",
      concept: "INNER CONFLICT",
      color: "#D04047",
      displayOrder: 2,
    },
    {
      id: crypto.randomUUID(),
      name: "SLATT",
      concept: "AWAKENING",
      color: "#5973B3",
      displayOrder: 3,
    },
    {
      id: crypto.randomUUID(),
      name: "ANTI-X",
      concept: "LETTING GO",
      color: "#5EAF7C",
      displayOrder: 4,
    },
  ] as const;

  await db.insert(teams).values([...teamData]);
  console.log(`  ✓ ${teamData.length} teams`);

  const [shiro, apex, slatt, anti] = teamData;

  // ── 2. Users ───────────────────────────────────────
  const adminUsers = [
    {
      name: "Phạm Hoàng Tuấn",
      email: "phamhoangtuanqn@gmail.com",
      role: "ADMIN" as const,
    },
    {
      name: "Nguyễn Hoàng Minh",
      email: "nguyenminh150906@gmail.com",
      role: "ADMIN" as const,
    },
  ];

  const btcFstyleUsers = [
    {
      name: "Nguyễn Thế Hiển",
      email: "nguyenthehien28062005@gmail.com",
      role: "BTC_FSTYLE" as const,
    },
    {
      name: "Nguyễn Hoàng Gia Phúc",
      email: "titangiaphuc1804@gmail.com",
      role: "BTC_FSTYLE" as const,
    },
    {
      name: "Nguyễn Thanh Lâm",
      email: "lam01052004@gmail.com",
      role: "BTC_FSTYLE" as const,
    },
    {
      name: "Phạm Hải Yến",
      email: "haiin260606@gmail.com",
      role: "BTC_FSTYLE" as const,
    },
  ];
  const mcUsers = [
    { name: "Trấn Thành", email: "mc@gmail.com", role: "MC" as const },
  ];

  const B = "/assets/images/members";

  const shiroMembers = [
    { name: "Huỳnh Minh Quân", email: "huynhminhquan9630@gmail.com", avatarUrls: [`${B}/shiro-huynh-minh-quan-1.webp`, `${B}/shiro-huynh-minh-quan-2.webp`] },
    { name: "Huỳnh Quốc Việt", email: "viet58300@gmail.com", avatarUrls: [`${B}/shiro-huynh-quoc-viet-1.webp`, `${B}/shiro-huynh-quoc-viet-2.webp`] },
    { name: "Phạm Kim Phát", email: "kimphat1123@gmail.com", avatarUrls: [`${B}/shiro-pham-kim-phat-1.webp`] },
    { name: "Nguyễn Trần Đức", email: "nguyentranduc17022006@gmail.com", avatarUrls: [`${B}/shiro-nguyen-tran-duc-1.webp`] },
    { name: "Phan Thiên Tính", email: "phanthientinh219@gmail.com", avatarUrls: [`${B}/shiro-phan-thien-tinh-1.webp`, `${B}/shiro-phan-thien-tinh-2.webp`] },
    { name: "Đỗ Hoàn Thiện", email: "susu05042007@gmail.com", avatarUrls: [`${B}/shiro-do-hoan-thien-1.webp`] },
    { name: "Lê Hiền Diệu", email: "lehiendieu28@gmail.com", avatarUrls: [`${B}/shiro-le-hien-dieu-1.webp`, `${B}/shiro-le-hien-dieu-2.webp`] },
    { name: "Trần Nguyễn Tường Vy", email: "tuongvy.bl.3005@gmail.com", avatarUrls: [`${B}/shiro-tran-nguyen-tuong-vy-1.webp`] },
    { name: "Nguyễn Hoàng Việt", email: "hoangviet7103@gmail.com", avatarUrls: [`${B}/shiro-nguyen-hoang-viet-1.webp`, `${B}/shiro-nguyen-hoang-viet-2.webp`] },
    { name: "Lương Thị Xuân", email: "xuanbp03@gmail.com", avatarUrls: [`${B}/shiro-luong-thi-xuan-1.webp`] },
  ];

  const apexMembers = [
    { name: "Nguyễn Kiều Bảo Ngọc", email: "emhoctruongcapbagl@gmail.com", avatarUrls: [`${B}/apex-nguyen-kieu-bao-ngoc-1.webp`, `${B}/apex-nguyen-kieu-bao-ngoc-2.webp`] },
    { name: "Nguyễn Ngọc Bảo Châu", email: "baochaubc2609@gmail.com", avatarUrls: [`${B}/apex-nguyen-ngoc-bao-chau-1.webp`, `${B}/apex-nguyen-ngoc-bao-chau-2.webp`] },
    { name: "Phạm Lê Ý Linh", email: "pham27linh04@gmail.com", avatarUrls: [`${B}/apex-pham-le-y-linh-1.webp`, `${B}/apex-pham-le-y-linh-2.webp`] },
    { name: "Nguyễn Hoàng Hảo Thy", email: "haothynguyenhoang@gmail.com", avatarUrls: [`${B}/apex-nguyen-hoang-hao-thy-1.webp`] },
    { name: "Vũ An", email: "vu4n06@gmail.com", avatarUrls: [`${B}/apex-vu-an-1.webp`, `${B}/apex-vu-an-2.webp`] },
    { name: "Lê Anh Nghi", email: "leanhnghi181007@gmail.com", avatarUrls: [`${B}/apex-le-anh-nghi-1.webp`] },
    { name: "Nguyễn Đình Thắng", email: "thassng2222@gmail.com", avatarUrls: [`${B}/apex-nguyen-dinh-thang-1.webp`] },
    { name: "Nguyễn Trần Duy Thịnh", email: "thinh30072006@gmail.com", avatarUrls: [`${B}/apex-nguyen-tran-duy-thinh-1.webp`] },
    { name: "Huỳnh Ngọc Minh Thư", email: "huynhthu0702@gmail.com", avatarUrls: [`${B}/apex-huynh-ngoc-minh-thu-1.webp`] },
    { name: "Trần Phương Thuỷ", email: "tphuongthuy72@gmail.com", avatarUrls: [`${B}/apex-tran-phuong-thuy-1.webp`, `${B}/apex-tran-phuong-thuy-2.webp`] },
    { name: "Đặng Ngọc Tú Anh", email: "keelinyoungnie@gmail.com", avatarUrls: [`${B}/apex-dang-ngoc-tu-anh-1.webp`] },
  ];

  const slattMembers = [
    { name: "Trần Võ Thảo Anh", email: "tranvothaoanh2007@gmail.com", avatarUrls: [`${B}/slatt-tran-vo-thao-anh-1.webp`, `${B}/slatt-tran-vo-thao-anh-2.webp`] },
    { name: "Phan Thị Minh Thư", email: "pmthu1516@gmail.com", avatarUrls: [`${B}/slatt-phan-thi-minh-thu-1.webp`, `${B}/slatt-phan-thi-minh-thu-2.webp`] },
    { name: "Trương Tuấn Minh", email: "tuanminh261204@gmail.com", avatarUrls: [`${B}/slatt-truong-tuan-minh-1.webp`, `${B}/slatt-truong-tuan-minh-2.webp`] },
    { name: "Trần Thị Thanh Thảo", email: "tharo3112@gmail.com", avatarUrls: [`${B}/slatt-tran-thi-thanh-thao-1.webp`, `${B}/slatt-tran-thi-thanh-thao-2.webp`] },
    { name: "Phan Minh Nguyên", email: "minhnguyen04112007@gmail.com", avatarUrls: [`${B}/slatt-phan-minh-nguyen-1.webp`, `${B}/slatt-phan-minh-nguyen-2.webp`] },
    { name: "Nguyễn Văn Nhật", email: "nhatnvss160585@fpt.edu.vn", avatarUrls: [`${B}/slatt-nguyen-van-nhat-1.webp`] },
    { name: "Bùi Minh Châu", email: "buiminhchau24@gmail.com", avatarUrls: [`${B}/slatt-bui-minh-chau-1.webp`, `${B}/slatt-bui-minh-chau-2.webp`] },
    { name: "Phạm Lê Hải Ngọc", email: "leessanghn123@gmail.com", avatarUrls: [`${B}/slatt-pham-le-hai-ngoc-1.webp`, `${B}/slatt-pham-le-hai-ngoc-2.webp`] },
    { name: "Võ Phương Nga", email: "vpnga23@gmail.com", avatarUrls: [`${B}/slatt-vo-phuong-nga-1.webp`] },
    { name: "Nguyễn Hoàng Bảo Trân", email: "baotran.slatt@placeholder.com", avatarUrls: [`${B}/slatt-nguyen-hoang-bao-tran-1.webp`] }, // email cần xác nhận
    { name: "Phạm Lê Thắng Hùng", email: "phamlethanghung1806@gmail.com", avatarUrls: [`${B}/slatt-pham-le-thang-hung-1.webp`] },
  ];

  const antiMembers = [
    { name: "Tiêu Thị Thiên Vân", email: "vtieu8226@gmail.com", avatarUrls: [`${B}/anti-tieu-thi-thien-van-1.webp`, `${B}/anti-tieu-thi-thien-van-2.webp`] },
    { name: "Nguyễn Thanh Nguyên", email: "nguyenthanhnguyen2172@gmail.com", avatarUrls: [`${B}/anti-nguyen-thanh-nguyen-1.webp`, `${B}/anti-nguyen-thanh-nguyen-2.webp`] },
    { name: "Nguyễn Thành Thu Ngân", email: "thungan20092005@gmail.com", avatarUrls: [`${B}/anti-nguyen-thanh-thu-ngan-1.webp`] },
    { name: "Võ Thanh Trúc", email: "chucchuc1358@gmail.com", avatarUrls: [`${B}/anti-vo-thanh-truc-1.webp`, `${B}/anti-vo-thanh-truc-2.webp`] },
    { name: "Lê Nguyễn Thảo Tiên", email: "lenguyenthaotien521@gmail.com", avatarUrls: [`${B}/anti-le-nguyen-thao-tien-1.webp`, `${B}/anti-le-nguyen-thao-tien-2.webp`] },
    { name: "Trịnh Nhật Thanh", email: "thanhtrinh240607@gmail.com", avatarUrls: [`${B}/anti-trinh-nhat-thanh-1.webp`, `${B}/anti-trinh-nhat-thanh-2.webp`] },
    { name: "Trần Tấn Phước", email: "benny332148@gmail.com", avatarUrls: [`${B}/anti-tran-tan-phuoc-1.webp`, `${B}/anti-tran-tan-phuoc-2.webp`] },
    { name: "Thái Hoàng Kim", email: "kimthaiworkplace@gmail.com", avatarUrls: [`${B}/anti-thai-hoang-kim-1.webp`] },
    { name: "Lê Tấn Cường", email: "letancuong1002@gmail.com", avatarUrls: [`${B}/anti-le-tan-cuong-1.webp`] },
    { name: "Trần Quốc Huy", email: "huycm1111@gmail.com", avatarUrls: [`${B}/anti-tran-quoc-huy-1.webp`] },
  ];

  const allUsers = [
    ...adminUsers.map((u) => ({ ...u, teamId: null, password: hashedPassword, avatarUrls: null })),
    ...btcFstyleUsers.map((u) => ({ ...u, teamId: null, password: hashedPassword, avatarUrls: null })),
    ...mcUsers.map((u) => ({ ...u, teamId: null, password: hashedPassword, avatarUrls: null })),
    ...shiroMembers.map(({ avatarUrls, ...u }) => ({ ...u, role: "MEMBER" as const, teamId: shiro.id, password: hashedPassword, avatarUrls })),
    ...apexMembers.map(({ avatarUrls, ...u }) => ({ ...u, role: "MEMBER" as const, teamId: apex.id, password: hashedPassword, avatarUrls })),
    ...slattMembers.map(({ avatarUrls, ...u }) => ({ ...u, role: "MEMBER" as const, teamId: slatt.id, password: hashedPassword, avatarUrls })),
    ...antiMembers.map(({ avatarUrls, ...u }) => ({ ...u, role: "MEMBER" as const, teamId: anti.id, password: hashedPassword, avatarUrls })),
  ];

  await db.insert(users).values(allUsers);
  console.log(`  ✓ ${allUsers.length} users (password: ${DEFAULT_PASSWORD})`);

  // ── 3. Judge Scores (empty - 3 BGK × 4 teams) ─────
  const judgeData = teamData.flatMap((team) =>
    [1, 2, 3].map((judgeNumber) => ({
      teamId: team.id,
      judgeNumber,
    })),
  );
  await db.insert(judgeScores).values(judgeData);
  console.log(`  ✓ ${judgeData.length} judge score slots`);

  // ── 4. BTC Scores (empty - 1 per team) ─────────────
  const btcData = teamData.map((team) => ({ teamId: team.id }));
  await db.insert(btcScores).values(btcData);
  console.log(`  ✓ ${btcData.length} btc score slots`);

  // ── 5. Awards (no winners yet) ─────────────────────
  const awardData = [
    {
      name: "Quán Quân",
      type: "AUTO" as const,
      winnerType: "TEAM" as const,
      quantity: 1,
      prize: "1.500.000 VND + Bảng khen + Giấy chứng nhận",
      displayOrder: 1,
    },
    {
      name: "Á Quân",
      type: "AUTO" as const,
      winnerType: "TEAM" as const,
      quantity: 1,
      prize: "1.000.000 VND + Bảng khen + Giấy chứng nhận",
      displayOrder: 2,
    },
    {
      name: "Khuyến Khích",
      type: "AUTO" as const,
      winnerType: "TEAM" as const,
      quantity: 2,
      prize: "500.000 VND + Bảng khen + Giấy chứng nhận",
      displayOrder: 3,
    },
    {
      name: "Yêu Thích",
      type: "MANUAL" as const,
      winnerType: "TEAM" as const,
      quantity: 1,
      prize: "Bảng khen + Giấy chứng nhận",
      displayOrder: 4,
    },
    {
      name: "Kỹ Thuật",
      type: "MANUAL" as const,
      winnerType: "TEAM" as const,
      quantity: 1,
      prize: "Chứng nhận + Quà",
      displayOrder: 5,
    },
    {
      name: "Biên Đạo",
      type: "MANUAL" as const,
      winnerType: "TEAM" as const,
      quantity: 1,
      prize: "Chứng nhận + Quà",
      displayOrder: 6,
    },
    {
      name: "Trưởng Nhóm",
      type: "MANUAL" as const,
      winnerType: "INDIVIDUAL" as const,
      quantity: 1,
      prize: "Chứng nhận + Quà",
      displayOrder: 7,
    },
    {
      name: "Phong Cách",
      type: "MANUAL" as const,
      winnerType: "TEAM" as const,
      quantity: 1,
      prize: "Chứng nhận + Quà",
      displayOrder: 8,
    },
    {
      name: "Nỗ Lực",
      type: "MANUAL" as const,
      winnerType: "INDIVIDUAL" as const,
      quantity: 4,
      prize: "Chứng nhận + Quà",
      displayOrder: 9,
    },
    {
      name: "Tri Ân Mentor",
      type: "MANUAL" as const,
      winnerType: "INDIVIDUAL" as const,
      quantity: 13,
      prize: "Chứng nhận + Quà",
      displayOrder: 10,
    },
  ];

  await db.insert(awards).values(awardData);
  console.log(`  ✓ ${awardData.length} awards`);

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

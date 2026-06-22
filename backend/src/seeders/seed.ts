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

  const shiroMembers = [
    { name: "Huỳnh Minh Quân", email: "huynhminhquan9630@gmail.com" },
    { name: "Huỳnh Quốc Việt", email: "viet58300@gmail.com" },
    { name: "Phạm Kim Phát", email: "kimphat1123@gmail.com" },
    { name: "Nguyễn Trần Đức", email: "nguyentranduc17022006@gmail.com" },
    { name: "Phan Thiên Tính", email: "phanthientinh219@gmail.com" },
    { name: "Đỗ Hoàn Thiện", email: "susu05042007@gmail.com" },
    { name: "Lê Hiền Diệu", email: "lehiendieu28@gmail.com" },
    { name: "Trần Nguyễn Tường Vy", email: "tuongvy.bl.3005@gmail.com" },
    { name: "Nguyễn Hoàng Việt", email: "hoangviet7103@gmail.com" },
    { name: "Lương Thị Xuân", email: "xuanbp03@gmail.com" },
  ];

  const apexMembers = [
    { name: "Nguyễn Kiều Bảo Ngọc", email: "emhoctruongcapbagl@gmail.com" },
    { name: "Nguyễn Ngọc Bảo Châu", email: "baochaubc2609@gmail.com" },
    { name: "Phạm Lê Ý Linh", email: "pham27linh04@gmail.com" },
    { name: "Nguyễn Hoàng Hảo Thy", email: "haothynguyenhoang@gmail.com" },
    { name: "Vũ An", email: "vu4n06@gmail.com" },
    { name: "Lê Anh Nghi", email: "leanhnghi181007@gmail.com" },
    { name: "Nguyễn Đình Thắng", email: "thassng2222@gmail.com" },
    { name: "Nguyễn Trần Duy Thịnh", email: "thinh30072006@gmail.com" },
    { name: "Huỳnh Ngọc Minh Thư", email: "huynhthu0702@gmail.com" },
    { name: "Trần Phương Thuỷ", email: "tphuongthuy72@gmail.com" },
    { name: "Đặng Ngọc Tú Anh", email: "keelinyoungnie@gmail.com" },
  ];

  const slattMembers = [
    { name: "Trần Võ Thảo Anh", email: "tranvothaoanh2007@gmail.com" },
    { name: "Phan Thị Minh Thư", email: "pmthu1516@gmail.com" },
    { name: "Trương Tuấn Minh", email: "tuanminh261204@gmail.com" },
    { name: "Trần Thị Thanh Thảo", email: "tharo3112@gmail.com" },
    { name: "Phan Minh Nguyên", email: "minhnguyen04112007@gmail.com" },
    { name: "Nguyễn Văn Nhật", email: "nhatnvss160585@fpt.edu.vn" },
    { name: "Bùi Minh Châu", email: "buiminhchau24@gmail.com" },
    { name: "Phạm Lê Hải Ngọc", email: "leessanghn123@gmail.com" },
    { name: "Võ Phương Nga", email: "vpnga23@gmail.com" },
    { name: "Nguyễn Hoàng Bảo Trân", email: "baotran.slatt@placeholder.com" }, // email cần xác nhận
    { name: "Phạm Lê Thắng Hùng", email: "phamlethanghung1806@gmail.com" },
  ];

  const antiMembers = [
    { name: "Tiêu Thị Thiên Vân", email: "vtieu8226@gmail.com" },
    { name: "Nguyễn Thanh Nguyên", email: "nguyenthanhnguyen2172@gmail.com" },
    { name: "Nguyễn Thành Thu Ngân", email: "thungan20092005@gmail.com" },
    { name: "Võ Thanh Trúc", email: "chucchuc1358@gmail.com" },
    { name: "Lê Nguyễn Thảo Tiên", email: "lenguyenthaotien521@gmail.com" },
    { name: "Trịnh Nhật Thanh", email: "thanhtrinh240607@gmail.com" },
    { name: "Trần Tấn Phước", email: "benny332148@gmail.com" },
    { name: "Thái Hoàng Kim", email: "kimthaiworkplace@gmail.com" },
    { name: "Lê Tấn Cường", email: "letancuong1002@gmail.com" },
    { name: "Trần Quốc Huy", email: "huycm1111@gmail.com" },
  ];

  const allUsers = [
    ...adminUsers.map((u) => ({
      ...u,
      teamId: null,
      password: hashedPassword,
    })),
    ...btcFstyleUsers.map((u) => ({
      ...u,
      teamId: null,
      password: hashedPassword,
    })),
    ...shiroMembers.map((u) => ({
      ...u,
      role: "MEMBER" as const,
      teamId: shiro.id,
      password: hashedPassword,
    })),
    ...apexMembers.map((u) => ({
      ...u,
      role: "MEMBER" as const,
      teamId: apex.id,
      password: hashedPassword,
    })),
    ...slattMembers.map((u) => ({
      ...u,
      role: "MEMBER" as const,
      teamId: slatt.id,
      password: hashedPassword,
    })),
    ...antiMembers.map((u) => ({
      ...u,
      role: "MEMBER" as const,
      teamId: anti.id,
      password: hashedPassword,
    })),
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

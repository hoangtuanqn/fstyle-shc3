import "dotenv/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!);

const tables = [
  "effort_votes",
  "award_winners",
  "judge_scores",
  "btc_scores",
  "awards",
  "users",
  "teams",
];

async function fresh() {
  console.log("🗑️  Dropping all tables...");
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  for (const table of tables) {
    await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${table}\``));
    console.log(`  ✓ dropped ${table}`);
  }
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

  console.log("\n🔄 Pushing schema...");
  const { execSync } = await import("child_process");
  execSync("npx drizzle-kit push --force", { stdio: "inherit" });

  console.log("\n🌱 Running seed...");
  execSync("npx tsx src/seeders/seed.ts", { stdio: "inherit" });

  process.exit(0);
}

fresh().catch((err) => {
  console.error("❌ Fresh failed:", err);
  process.exit(1);
});

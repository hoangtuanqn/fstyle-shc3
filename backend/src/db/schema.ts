import {
  decimal,
  index,
  mysqlEnum,
  mysqlTable,
  tinyint,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// ── Teams ──────────────────────────────────────────────
export const teams = mysqlTable("teams", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  concept: varchar("concept", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  displayOrder: tinyint("display_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ── Users ──────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["ADMIN", "BTC_FSTYLE", "MC", "MEMBER"])
    .notNull()
    .default("MEMBER"),
  teamId: varchar("team_id", { length: 36 }).references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ── Judge Scores (BGK categories 1–5, max 95đ) ────────
export const judgeScores = mysqlTable(
  "judge_scores",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id),
    judgeNumber: tinyint("judge_number").notNull(), // 1, 2, 3
    ideaConcept: decimal("idea_concept", { precision: 4, scale: 1 }).default(
      "0",
    ), // max 20
    choreography: decimal("choreography", { precision: 4, scale: 1 }).default(
      "0",
    ), // max 25
    synchronization: decimal("synchronization", {
      precision: 4,
      scale: 1,
    }).default("0"), // max 20
    performance: decimal("performance", { precision: 4, scale: 1 }).default(
      "0",
    ), // max 20
    costume: decimal("costume", { precision: 4, scale: 1 }).default("0"), // max 10
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("judge_team_idx").on(table.teamId, table.judgeNumber),
  ],
);

// ── BTC Scores (category 6 - Kỷ luật, max 5đ) ────────
export const btcScores = mysqlTable("btc_scores", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  teamId: varchar("team_id", { length: 36 })
    .notNull()
    .references(() => teams.id)
    .unique(),
  discipline: decimal("discipline", { precision: 3, scale: 1 }).default("0"), // max 5
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ── Awards ─────────────────────────────────────────────
export const awards = mysqlTable("awards", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["AUTO", "MANUAL"]).notNull(),
  winnerType: mysqlEnum("winner_type", ["TEAM", "INDIVIDUAL"]).notNull(),
  quantity: tinyint("quantity").notNull().default(1),
  prize: varchar("prize", { length: 500 }),
  displayOrder: tinyint("display_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ── Award Winners ─────────────────────────────────────
export const awardWinners = mysqlTable(
  "award_winners",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    awardId: varchar("award_id", { length: 36 })
      .notNull()
      .references(() => awards.id),
    slot: tinyint("slot").notNull(),
    winnerTeamId: varchar("winner_team_id", { length: 36 }).references(
      () => teams.id,
    ),
    winnerUserId: varchar("winner_user_id", { length: 36 }).references(
      () => users.id,
    ),
    winnerName: varchar("winner_name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("award_slot_idx").on(table.awardId, table.slot)],
);

// ── Effort Votes (Giải Nỗ lực) ────────────────────────
// Rules: MEMBER → max 2 votes in own team, no self-vote
//        BTC_FSTYLE → max 2 votes per team
export const effortVotes = mysqlTable(
  "effort_votes",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    voterId: varchar("voter_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    candidateId: varchar("candidate_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("vote_unique_idx").on(table.voterId, table.candidateId),
    index("vote_candidate_idx").on(table.candidateId),
  ],
);

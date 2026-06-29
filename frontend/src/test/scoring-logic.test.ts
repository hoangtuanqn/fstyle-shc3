/**
 * Tests for scoring sub-score logic.
 *
 * Core bug scenario: Judge enters sub-scores [1, 1, 1] for a category (total=3).
 * After save + reload, old greedy fillSubs would produce [3, 0, 0].
 * Fix: localStorage preserves individual sub-scores.
 */

import { describe, it, expect, beforeEach } from "vitest";

// ─── Pure functions extracted from Scoring page ───────────────────────────────

const getSubKey = (catId: number, subIdx: number) => `${catId}-${subIdx}`;

const judgeSubsKey = (teamId: string, judge: number) =>
  `scoring_subs_${teamId}_judge${judge}`;
const btcSubsKey = (teamId: string) => `scoring_subs_${teamId}_btc`;

type Criteria = { id: number; subs: { maxScore: number }[] };

const loadStoredSubs = (
  key: string,
  cats: Criteria[],
  fallbackTotal: Record<number, number>,
) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed: Record<string, number> = JSON.parse(stored);
      const storedSum = cats.reduce(
        (s, cat) =>
          s +
          cat.subs.reduce((ss, _, i) => ss + (parsed[getSubKey(cat.id, i)] ?? 0), 0),
        0,
      );
      const apiSum = cats.reduce((s, cat) => s + (fallbackTotal[cat.id] ?? 0), 0);
      if (Math.abs(storedSum - apiSum) < 0.01) return parsed;
    } catch {}
  }
  return null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simulate what happens when scores are saved to localStorage */
function saveSubsToLocalStorage(
  key: string,
  cats: Criteria[],
  subScores: Record<string, number>,
) {
  const payload: Record<string, number> = {};
  cats.forEach((cat) => {
    cat.subs.forEach((_, i) => {
      payload[getSubKey(cat.id, i)] = subScores[getSubKey(cat.id, i)] ?? 0;
    });
  });
  localStorage.setItem(key, JSON.stringify(payload));
}

// ─── Test fixtures ────────────────────────────────────────────────────────────

// Mô phỏng tiêu chí 1: Ý tưởng & Concept — 3 ô con, max: 5+10+5=20
const cat1: Criteria = {
  id: 1,
  subs: [{ maxScore: 5 }, { maxScore: 10 }, { maxScore: 5 }],
};

// Mô phỏng tiêu chí 6: Kỷ luật — 3 ô con, max: 2+2+1=5
const cat6: Criteria = {
  id: 6,
  subs: [{ maxScore: 2 }, { maxScore: 2 }, { maxScore: 1 }],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getSubKey", () => {
  it("tạo key dạng catId-subIdx", () => {
    expect(getSubKey(1, 0)).toBe("1-0");
    expect(getSubKey(2, 3)).toBe("2-3");
    expect(getSubKey(6, 2)).toBe("6-2");
  });
});

describe("judgeSubsKey / btcSubsKey", () => {
  it("tạo đúng localStorage key cho judge score", () => {
    expect(judgeSubsKey("team-abc", 1)).toBe("scoring_subs_team-abc_judge1");
    expect(judgeSubsKey("team-abc", 3)).toBe("scoring_subs_team-abc_judge3");
  });

  it("tạo đúng localStorage key cho BTC score", () => {
    expect(btcSubsKey("team-abc")).toBe("scoring_subs_team-abc_btc");
  });
});

describe("loadStoredSubs", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("trả về null khi localStorage trống", () => {
    const result = loadStoredSubs("some-key", [cat1], { 1: 3 });
    expect(result).toBeNull();
  });

  it("trả về null khi tổng stored không khớp với tổng API", () => {
    // Lưu sub-scores tổng = 3, nhưng API trả về total = 5
    const stored = { "1-0": 1, "1-1": 1, "1-2": 1 };
    localStorage.setItem("test-key", JSON.stringify(stored));

    const result = loadStoredSubs("test-key", [cat1], { 1: 5 });
    expect(result).toBeNull();
  });

  it("trả về stored subs khi tổng khớp với tổng API", () => {
    const stored = { "1-0": 1, "1-1": 1, "1-2": 1 }; // tổng = 3
    localStorage.setItem("test-key", JSON.stringify(stored));

    const result = loadStoredSubs("test-key", [cat1], { 1: 3 });
    expect(result).toEqual(stored);
  });

  it("trả về stored subs khi tổng khớp dù có floating point", () => {
    // 0.5 + 0.5 + 2.0 = 3.0
    const stored = { "1-0": 0.5, "1-1": 0.5, "1-2": 2 };
    localStorage.setItem("test-key", JSON.stringify(stored));

    const result = loadStoredSubs("test-key", [cat1], { 1: 3 });
    expect(result).toEqual(stored);
  });

  it("trả về null khi JSON bị lỗi", () => {
    localStorage.setItem("test-key", "not-valid-json{{{");
    const result = loadStoredSubs("test-key", [cat1], { 1: 3 });
    expect(result).toBeNull();
  });

  it("trả về null khi tổng API = 0 mà localStorage có data (stale)", () => {
    // Trường hợp: đã lưu điểm cũ, nhưng API trả về 0 (đội chưa được chấm)
    const stored = { "1-0": 1, "1-1": 1, "1-2": 1 };
    localStorage.setItem("test-key", JSON.stringify(stored));

    const result = loadStoredSubs("test-key", [cat1], { 1: 0 });
    expect(result).toBeNull();
  });
});

describe("Scenario bug cũ: greedy fill gộp điểm vào ô đầu", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Bug cũ: nhập [1, 1, 1] → save total=3 → load lại → fillSubs greedy → [3, 0, 0]
   * Fix mới: save [1,1,1] vào localStorage → load lại → loadStoredSubs → [1, 1, 1]
   */
  it("sau khi save [1,1,1] rồi load lại, mỗi ô vẫn giữ đúng giá trị", () => {
    const teamId = "team-001";
    const judge = 1;
    const key = judgeSubsKey(teamId, judge);

    // Simulate: judge nhập điểm 1/1/1 rồi save
    const subScoresBeforeSave: Record<string, number> = {
      "1-0": 1,
      "1-1": 1,
      "1-2": 1,
    };
    saveSubsToLocalStorage(key, [cat1], subScoresBeforeSave);

    // Simulate: load lại từ API (trả về total=3 cho cat1)
    const restored = loadStoredSubs(key, [cat1], { 1: 3 });

    expect(restored).not.toBeNull();
    expect(restored!["1-0"]).toBe(1); // ô 1 vẫn là 1, không phải 3
    expect(restored!["1-1"]).toBe(1); // ô 2 vẫn là 1, không phải 0
    expect(restored!["1-2"]).toBe(1); // ô 3 vẫn là 1, không phải 0
  });

  it("sau khi save [5, 8, 3] rồi load lại, giữ đúng phân bổ không đồng đều", () => {
    const teamId = "team-002";
    const judge = 2;
    const key = judgeSubsKey(teamId, judge);

    const subScores: Record<string, number> = { "1-0": 5, "1-1": 8, "1-2": 3 };
    saveSubsToLocalStorage(key, [cat1], subScores);

    const restored = loadStoredSubs(key, [cat1], { 1: 16 });

    expect(restored!["1-0"]).toBe(5);
    expect(restored!["1-1"]).toBe(8);
    expect(restored!["1-2"]).toBe(3);
  });

  it("BTC score: sau khi save [2, 1, 1] rồi load lại, ô con giữ đúng", () => {
    const teamId = "team-003";
    const key = btcSubsKey(teamId);

    const subScores: Record<string, number> = { "6-0": 2, "6-1": 1, "6-2": 1 };
    saveSubsToLocalStorage(key, [cat6], subScores);

    const restored = loadStoredSubs(key, [cat6], { 6: 4 });

    expect(restored!["6-0"]).toBe(2);
    expect(restored!["6-1"]).toBe(1);
    expect(restored!["6-2"]).toBe(1);
  });

  it("nếu judge khác nhau thì localStorage key tách biệt, không ảnh hưởng nhau", () => {
    const teamId = "team-004";

    // Judge 1 nhập [1, 1, 1]
    saveSubsToLocalStorage(judgeSubsKey(teamId, 1), [cat1], {
      "1-0": 1,
      "1-1": 1,
      "1-2": 1,
    });
    // Judge 2 nhập [5, 0, 0]
    saveSubsToLocalStorage(judgeSubsKey(teamId, 2), [cat1], {
      "1-0": 5,
      "1-1": 0,
      "1-2": 0,
    });

    const judge1 = loadStoredSubs(judgeSubsKey(teamId, 1), [cat1], { 1: 3 });
    const judge2 = loadStoredSubs(judgeSubsKey(teamId, 2), [cat1], { 1: 5 });

    expect(judge1!["1-0"]).toBe(1); // judge 1 ô đầu = 1
    expect(judge2!["1-0"]).toBe(5); // judge 2 ô đầu = 5
  });
});

describe("So sánh trực tiếp: greedy cũ vs localStorage fix", () => {
  beforeEach(() => localStorage.clear());

  /**
   * Greedy fillSubs cũ: đổ tổng từ trái sang, ô đầu ăn trước.
   * Cat1 có subs max [5, 10, 5]. Nếu total=3 → ô đầu lấy hết 3, ô sau = 0.
   */
  const fillSubsGreedy = (cat: Criteria, total: number) => {
    const filled: Record<string, number> = {};
    let remaining = total;
    for (let i = 0; i < cat.subs.length; i++) {
      const val = Math.min(remaining, cat.subs[i].maxScore);
      filled[getSubKey(cat.id, i)] = Math.round(val * 100) / 100;
      remaining = Math.round((remaining - val) * 100) / 100;
    }
    return filled;
  };

  it("greedy cũ: nhập [1,1,1] rồi load lại → ra [3,0,0] — đây là BUG", () => {
    const greedy = fillSubsGreedy(cat1, 3);
    expect(greedy["1-0"]).toBe(3); // bug: ô đầu chiếm hết
    expect(greedy["1-1"]).toBe(0);
    expect(greedy["1-2"]).toBe(0);
  });

  it("fix mới: nhập [1,1,1] save rồi load lại → vẫn ra [1,1,1] — ĐÚNG", () => {
    const key = judgeSubsKey("team-x", 1);
    saveSubsToLocalStorage(key, [cat1], { "1-0": 1, "1-1": 1, "1-2": 1 });

    const restored = loadStoredSubs(key, [cat1], { 1: 3 });
    expect(restored!["1-0"]).toBe(1);
    expect(restored!["1-1"]).toBe(1);
    expect(restored!["1-2"]).toBe(1);
  });

  it("greedy cũ: nhập [5,8,3] rồi load lại → ra [5,8,3] (may mắn vì ô đầu max=5 ≤ 5)", () => {
    // Khi tổng > maxScore ô đầu thì phân bổ sang ô sau
    const greedy = fillSubsGreedy(cat1, 16); // max cat1[0]=5
    expect(greedy["1-0"]).toBe(5);  // ô đầu lấy hết 5
    expect(greedy["1-1"]).toBe(10); // ô giữa lấy phần còn (10 còn lại, max 10)
    // Nhưng nếu user nhập 5/8/3 thì ô giữa bị gán 10 thay vì 8 → vẫn sai!
    expect(greedy["1-1"]).not.toBe(8); // ô giữa sai so với ý định nhập
  });

  it("fix mới: nhập [5,8,3] save rồi load lại → giữ đúng phân bổ", () => {
    const key = judgeSubsKey("team-y", 2);
    saveSubsToLocalStorage(key, [cat1], { "1-0": 5, "1-1": 8, "1-2": 3 });

    const restored = loadStoredSubs(key, [cat1], { 1: 16 });
    expect(restored!["1-0"]).toBe(5);
    expect(restored!["1-1"]).toBe(8);
    expect(restored!["1-2"]).toBe(3);
  });
});

describe("Tính toán tổng điểm", () => {
  it("tổng ô con đúng bằng sum của các giá trị nhập", () => {
    const subScores: Record<string, number> = {
      "1-0": 4,
      "1-1": 8,
      "1-2": 3,
    };
    const getSubScore = (catId: number, subIdx: number) =>
      subScores[getSubKey(catId, subIdx)] ?? 0;
    const getCategoryTotal = (cat: Criteria) =>
      cat.subs.reduce((sum, _, i) => sum + getSubScore(cat.id, i), 0);

    expect(getCategoryTotal(cat1)).toBe(15); // 4+8+3
  });

  it("điểm không vượt maxScore của ô con", () => {
    const clamp = (val: number, max: number) => Math.min(Math.max(0, val), max);

    expect(clamp(6, 5)).toBe(5);   // nhập 6 vào ô max 5 → chỉ lưu 5
    expect(clamp(-1, 5)).toBe(0);  // nhập âm → về 0
    expect(clamp(3, 5)).toBe(3);   // nhập bình thường
  });

  it("tổng điểm toàn bài = sum của tất cả mục", () => {
    const subScores: Record<string, number> = {
      "1-0": 1, "1-1": 1, "1-2": 1, // cat1 total = 3
      "6-0": 2, "6-1": 1, "6-2": 0, // cat6 total = 3
    };
    const cats = [cat1, cat6];
    const getSubScore = (catId: number, subIdx: number) =>
      subScores[getSubKey(catId, subIdx)] ?? 0;
    const grandTotal = cats.reduce(
      (sum, cat) => sum + cat.subs.reduce((s, _, i) => s + getSubScore(cat.id, i), 0),
      0,
    );

    expect(grandTotal).toBe(6); // 3 + 3
  });
});

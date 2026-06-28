import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";

import LeaderboardApi from "~/api-requests/leaderboard.requests";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";
import useAuth from "~/hooks/useAuth";
import { RoleType } from "~/constants/enums";

const thStyle: CSSProperties = {
  padding: "14px 18px",
  textAlign: "left",
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "var(--orange)",
  borderBottom: "2px solid rgba(251,140,5,.3)",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  padding: "14px 18px",
  fontSize: 15,
  color: "var(--text)",
  borderBottom: "1px solid rgba(255,255,255,.06)",
  verticalAlign: "middle",
};

const Leaderboard = () => {
  usePageTitle("Xếp Hạng Giải Thưởng");
  const socketRef = useSocket();
  const { user } = useAuth();
  const isMC = user?.role === RoleType.ADMIN || user?.role === RoleType.MC;

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: LeaderboardApi.getLeaderboard,
  });

  const rankings = data?.result?.rankings ?? [];
  const awards = data?.result?.awards ?? [];
  const sortedAwards = [...awards].sort((a, b) => a.displayOrder - b.displayOrder);

  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const onInit = ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
    };
    const onRevealed = ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
      setPendingId(null);
    };
    socket.on("leaderboard:init", onInit);
    socket.on("award:revealed", onRevealed);
    socket.on("award:reveal:error", () => setPendingId(null));
    return () => {
      socket.off("leaderboard:init", onInit);
      socket.off("award:revealed", onRevealed);
      socket.off("award:reveal:error");
    };
  }, [socketRef]);

  const handleReveal = useCallback(
    (awardId: string) => {
      if (pendingId) return;
      setPendingId(awardId);
      socketRef.current?.emit("award:reveal", { awardId });
    },
    [pendingId, socketRef],
  );

  const handleUnreveal = useCallback(
    (awardId: string) => {
      if (pendingId) return;
      setPendingId(awardId);
      socketRef.current?.emit("award:unreveal", { awardId });
    },
    [pendingId, socketRef],
  );

  if (isLoading)
    return (
      <div style={{ minHeight: "100vh", paddingTop: 108, textAlign: "center", color: "var(--dim)" }}>
        Đang tải...
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108 }}>
      {/* Title */}
      <section style={{ paddingBottom: 48 }}>
        <div className="con" style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, var(--orange))" }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".4em", textTransform: "uppercase", color: "var(--orange)" }}>
              LIVE RESULTS
            </span>
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, var(--orange), transparent)" }} />
          </div>
          <h1 className="st" style={{ marginBottom: 12 }}>
            BẢNG XẾP <em>HẠNG</em>
          </h1>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="con" style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Rankings Table */}
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "var(--bg2)", marginBottom: 36 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(251,140,5,.06)" }}>
                  <th style={{ ...thStyle, width: "8%" }}>Rank</th>
                  <th style={thStyle}>Đội</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {rankings.filter((r) => r.totalScore > 0).length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: "var(--dim)" }}>
                      Chưa có thông tin kết quả
                    </td>
                  </tr>
                )}
                {rankings
                  .filter((r) => r.totalScore > 0)
                  .map((row) => {
                    const isTop3 = row.rank <= 3;
                    const isFirst = row.rank === 1;
                    return (
                      <tr key={row.team.id}>
                        <td style={{ ...tdStyle, fontWeight: 800, fontSize: 18, color: isTop3 ? "var(--orange)" : "var(--dim)" }}>
                          #{row.rank}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, letterSpacing: ".03em" }}>
                            {row.team.name}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{row.team.concept}</div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: isFirst ? 800 : undefined, color: isFirst ? "var(--orange)" : undefined }}>
                          {row.totalScore.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Awards Table */}
          {awards.length > 0 && (
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "var(--bg2)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(251,140,5,.06)" }}>
                    <th style={{ ...thStyle, width: "40%" }}>Giải</th>
                    <th style={thStyle}>Tên đội/người nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.filter((a) => a.winners.length > 0).length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ ...tdStyle, textAlign: "center", color: "var(--dim)" }}>
                        Chưa có thông tin kết quả
                      </td>
                    </tr>
                  )}
                  {awards
                    .filter((a) => a.winners.length > 0)
                    .map((award) => {
                      const winnerNames = award.winners.map((w) => w.winnerName).filter(Boolean);
                      const winnerStyle: CSSProperties = { fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: ".03em", color: "var(--text)" };
                      return (
                        <tr key={award.id}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{award.name}</td>
                          <td style={tdStyle}>
                            {winnerNames.length === 1 && <span style={winnerStyle}>{winnerNames[0]}</span>}
                            {winnerNames.length >= 2 && (
                              <ol style={{ margin: 0, paddingLeft: 20, listStyleType: "decimal" }}>
                                {winnerNames.map((name, i) => (
                                  <li key={i} style={{ ...winnerStyle, fontSize: 17, marginBottom: i < winnerNames.length - 1 ? 4 : 0 }}>
                                    {name}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* MC Control Panel */}
      {isMC && (
        <section style={{ paddingBottom: 60 }}>
          <div className="con" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ borderRadius: 14, border: "1px solid rgba(251,140,5,.25)", background: "var(--bg2)", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".2em", color: "var(--orange)", textTransform: "uppercase" }}>
                  MC Control
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--dim)" }}>
                    {revealedIds.length}/{sortedAwards.length} đã công bố
                  </span>
                  <a
                    href="/screen"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "var(--orange)", textDecoration: "none", fontWeight: 600 }}
                  >
                    Mở màn hình chiếu ↗
                  </a>
                </div>
              </div>

              {/* Award list */}
              {sortedAwards.map((award) => {
                const isRevealed = revealedIds.includes(award.id);
                const isPending = pendingId === award.id;
                return (
                  <div
                    key={award.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderBottom: "1px solid rgba(255,255,255,.05)",
                      gap: 12,
                      background: isRevealed ? "rgba(251,140,5,.04)" : undefined,
                      transition: "background .2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{isRevealed ? "✅" : "⬜"}</span>
                      <span style={{ fontSize: 14, fontWeight: isRevealed ? 700 : 400, color: isRevealed ? "var(--text)" : "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {award.name}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      {!isRevealed ? (
                        <button
                          onClick={() => handleReveal(award.id)}
                          disabled={!!pendingId}
                          style={{
                            padding: "8px 16px",
                            fontSize: 13,
                            fontWeight: 700,
                            background: pendingId ? "rgba(251,140,5,.25)" : "var(--orange)",
                            color: "#000",
                            border: "none",
                            borderRadius: 8,
                            cursor: pendingId ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "all .15s",
                          }}
                        >
                          {isPending ? "⏳" : "🏆 Công bố"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnreveal(award.id)}
                          disabled={!!pendingId}
                          style={{
                            padding: "8px 16px",
                            fontSize: 13,
                            fontWeight: 700,
                            background: "transparent",
                            color: pendingId ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.45)",
                            border: "1px solid rgba(255,255,255,.15)",
                            borderRadius: 8,
                            cursor: pendingId ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "all .15s",
                          }}
                        >
                          {isPending ? "⏳" : "↩ Thu hồi"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {sortedAwards.length === 0 && (
                <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--dim)", fontSize: 14 }}>
                  Chưa có dữ liệu giải thưởng
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 600px) {
          .con { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;

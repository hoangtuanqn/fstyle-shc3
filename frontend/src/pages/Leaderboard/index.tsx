import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import LeaderboardApi from "~/api-requests/leaderboard.requests";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";
import useAuth from "~/hooks/useAuth";
import { RoleType } from "~/constants/enums";

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
    const onInit = ({ revealedAwardIds }: { revealedAwardIds: string[] }) => setRevealedIds(revealedAwardIds);
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
      <div style={{ minHeight: "100vh", paddingTop: 108, textAlign: "center", color: "var(--dim)", fontSize: 14 }}>
        Đang tải...
      </div>
    );

  const rankFiltered = rankings.filter((r) => r.totalScore > 0);
  const awardsWithWinners = awards.filter((a) => a.winners.length > 0);
  const revealedCount = sortedAwards.filter((a) => a.winners.length > 0 && revealedIds.includes(a.id)).length;
  const totalRevealable = sortedAwards.filter((a) => a.winners.length > 0).length;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      {/* ── Page header ── */}
      <div className="con" style={{ textAlign: "center", paddingBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 36, height: 1, background: "linear-gradient(90deg,transparent,var(--orange))" }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".42em", textTransform: "uppercase", color: "var(--orange)" }}>
            LIVE RESULTS
          </span>
          <span style={{ width: 36, height: 1, background: "linear-gradient(90deg,var(--orange),transparent)" }} />
        </div>
        <h1 className="st">BẢNG XẾP <em>HẠNG</em></h1>
      </div>

      {/* ── Two-column grid: Rankings | Awards ── */}
      <div
        className={`con grid grid-cols-1 gap-6 md:grid-cols-2 ${isMC ? "mb-10" : ""}`}
        style={{ alignItems: "start" }}
      >
        {/* Rankings */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 12, marginTop: 0 }}>
            Bảng xếp hạng
          </p>
          <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "var(--bg2)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 220 }}>
              <thead>
                <tr style={{ background: "rgba(251,140,5,.05)" }}>
                  {["#", "Đội", "Điểm"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 14px",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: "var(--orange)",
                        borderBottom: "1.5px solid rgba(251,140,5,.25)",
                        textAlign: i === 2 ? "right" : "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rankFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "20px 14px", textAlign: "center", color: "var(--dim)", fontSize: 13 }}>
                      Chưa có kết quả
                    </td>
                  </tr>
                ) : (
                  rankFiltered.map((row) => {
                    const isFirst = row.rank === 1;
                    const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
                    return (
                      <tr key={row.team.id} style={{ background: isFirst ? "rgba(251,140,5,.04)" : undefined }}>
                        <td style={{ padding: "12px 14px", fontSize: 18, borderBottom: "1px solid rgba(255,255,255,.05)", color: row.rank <= 3 ? "var(--orange)" : "var(--dim)", fontWeight: 800 }}>
                          {medals[row.rank] ?? `#${row.rank}`}
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 15, letterSpacing: ".02em", color: isFirst ? "var(--orange)" : "var(--text)" }}>
                            {row.team.name}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 1 }}>{row.team.concept}</div>
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.05)", textAlign: "right", fontFamily: "'Anton',sans-serif", fontSize: isFirst ? 20 : 16, color: isFirst ? "var(--orange)" : "var(--text)" }}>
                          {row.totalScore.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Awards */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 12, marginTop: 0 }}>
            Giải thưởng đã công bố
          </p>
          <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "var(--bg2)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 240 }}>
              <thead>
                <tr style={{ background: "rgba(251,140,5,.05)" }}>
                  {["Giải", "Người/Đội nhận"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 14px",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: "var(--orange)",
                        borderBottom: "1.5px solid rgba(251,140,5,.25)",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {awardsWithWinners.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ padding: "20px 14px", textAlign: "center", color: "var(--dim)", fontSize: 13 }}>
                      Chưa có kết quả
                    </td>
                  </tr>
                ) : (
                  awardsWithWinners.map((award) => {
                    const names = award.winners.map((w) => w.winnerName).filter(Boolean);
                    return (
                      <tr key={award.id}>
                        <td style={{ padding: "11px 14px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid rgba(255,255,255,.05)", color: "var(--text)" }}>
                          {award.name}
                        </td>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                          {names.length === 1 && (
                            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 15, letterSpacing: ".02em" }}>{names[0]}</span>
                          )}
                          {names.length >= 2 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              {names.map((n, i) => (
                                <span key={i} style={{ fontFamily: "'Anton',sans-serif", fontSize: 14, letterSpacing: ".02em" }}>{n}</span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── MC Control Panel ── */}
      {isMC && (
        <div className="con">
          <div style={{ borderRadius: 14, border: "1px solid rgba(251,140,5,.3)", background: "var(--bg2)", overflow: "hidden" }}>
            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3" style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              background: "rgba(251,140,5,.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", color: "var(--orange)", textTransform: "uppercase" }}>
                  MC Control
                </span>
                <span style={{ fontSize: 12, color: "var(--dim)", background: "rgba(255,255,255,.06)", padding: "2px 8px", borderRadius: 99 }}>
                  {revealedCount}/{totalRevealable} đã chiếu
                </span>
              </div>
              <a
                href="/screen"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--orange)",
                  textDecoration: "none",
                  padding: "5px 12px",
                  border: "1px solid rgba(251,140,5,.4)",
                  borderRadius: 7,
                }}
              >
                Mở màn hình ↗
              </a>
            </div>

            {/* Award rows */}
            <div>
              {sortedAwards.map((award) => {
                const hasWinners = award.winners.length > 0;
                const isRevealed = revealedIds.includes(award.id);
                const isPending = pendingId === award.id;
                const names = award.winners.map((w) => w.winnerName).filter(Boolean);

                return (
                  <div
                    key={award.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "13px 20px",
                      borderBottom: "1px solid rgba(255,255,255,.05)",
                      background: isRevealed ? "rgba(251,140,5,.03)" : undefined,
                    }}
                  >
                    {/* Status dot */}
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: isRevealed ? "#4ade80" : hasWinners ? "var(--orange)" : "rgba(255,255,255,.15)",
                    }} />

                    {/* Award info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isRevealed ? "var(--text)" : hasWinners ? "var(--text)" : "var(--dim)",
                        marginBottom: names.length > 0 ? 2 : 0,
                      }}>
                        {award.name}
                      </div>
                      {names.length > 0 && (
                        <div style={{ fontSize: 12, color: "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {names.join(" · ")}
                        </div>
                      )}
                      {!hasWinners && (
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.2)", fontStyle: "italic" }}>Chưa nhập người nhận</div>
                      )}
                    </div>

                    {/* Action button */}
                    <div style={{ flexShrink: 0 }}>
                      {!hasWinners && (
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,.2)", padding: "6px 12px" }}>—</span>
                      )}
                      {hasWinners && !isRevealed && (
                        <button
                          onClick={() => handleReveal(award.id)}
                          disabled={!!pendingId}
                          style={{
                            padding: "7px 16px",
                            fontSize: 13,
                            fontWeight: 700,
                            background: pendingId ? "rgba(251,140,5,.2)" : "var(--orange)",
                            color: "#000",
                            border: "none",
                            borderRadius: 8,
                            cursor: pendingId ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "opacity .15s",
                            opacity: pendingId && !isPending ? 0.4 : 1,
                          }}
                        >
                          {isPending ? "..." : "Công bố"}
                        </button>
                      )}
                      {hasWinners && isRevealed && (
                        <button
                          onClick={() => handleUnreveal(award.id)}
                          disabled={!!pendingId}
                          style={{
                            padding: "7px 14px",
                            fontSize: 12,
                            fontWeight: 600,
                            background: "transparent",
                            color: pendingId ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.35)",
                            border: "1px solid rgba(255,255,255,.12)",
                            borderRadius: 8,
                            cursor: pendingId ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "opacity .15s",
                          }}
                        >
                          {isPending ? "..." : "Thu hồi"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {sortedAwards.length === 0 && (
                <div style={{ padding: "28px 20px", textAlign: "center", color: "var(--dim)", fontSize: 13 }}>
                  Chưa có dữ liệu giải thưởng
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Leaderboard;

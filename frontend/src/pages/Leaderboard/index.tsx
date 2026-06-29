import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: LeaderboardApi.getLeaderboard,
  });

  const rankings = data?.result?.rankings ?? [];
  const awards = data?.result?.awards ?? [];
  const sortedAwards = [...awards].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const onInit = ({ revealedAwardIds }: { revealedAwardIds: string[] }) =>
      setRevealedIds(revealedAwardIds);
    const onRevealed = ({
      revealedAwardIds,
    }: {
      revealedAwardIds: string[];
    }) => {
      setRevealedIds(revealedAwardIds);
      setPendingId(null);
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    };
    socket.on("leaderboard:init", onInit);
    socket.on("award:revealed", onRevealed);
    socket.on("award:reveal:error", () => setPendingId(null));
    return () => {
      socket.off("leaderboard:init", onInit);
      socket.off("award:revealed", onRevealed);
      socket.off("award:reveal:error");
    };
  }, [socketRef, queryClient]);

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
      <div
        style={{
          minHeight: "100vh",
          paddingTop: 108,
          textAlign: "center",
          color: "var(--dim)",
          fontSize: 14,
        }}
      >
        Đang tải...
      </div>
    );

  const rankFiltered = rankings
    .filter((r) => r.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);
  const autoAwards = sortedAwards.filter((a) => a.type === "AUTO");
  return (
    <div style={{ minHeight: "100vh", paddingTop: 88, paddingBottom: 60 }}>
      {/* ── Page header ── */}
      <div className="con" style={{ textAlign: "center", paddingBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 36,
              height: 1,
              background: "linear-gradient(90deg,transparent,var(--orange))",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".42em",
              textTransform: "uppercase",
              color: "var(--orange)",
            }}
          >
            LIVE RESULTS
          </span>
          <span
            style={{
              width: 36,
              height: 1,
              background: "linear-gradient(90deg,var(--orange),transparent)",
            }}
          />
        </div>
        <h1 className="st">
          BẢNG XẾP <em>HẠNG</em>
        </h1>
      </div>

      {/* ── MC Control Panel ── */}
      {isMC && (
        <div className="con" style={{ marginTop: 10 }}>
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(251,140,5,.3)",
              background: "var(--bg2)",
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <div
              className="flex flex-wrap items-center justify-between gap-3"
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                background: "rgba(251,140,5,.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".28em",
                    color: "var(--orange)",
                    textTransform: "uppercase",
                  }}
                >
                  Công bố giải
                </span>
              </div>
            </div>

            {/* Award rows */}
            <div>
              {sortedAwards.map((award) => {
                const hasWinners = award.winners.length > 0;
                const isAuto = award.type === "AUTO";
                const isRevealed = revealedIds.includes(award.id);
                const isPending = pendingId === award.id;
                const apiNames = award.winners
                  .map((w) => w.winnerName)
                  .filter((n): n is string => !!n);
                type Entry = { name: string; score?: number };
                const entries: Entry[] = isAuto
                  ? (() => {
                      const idx = autoAwards.indexOf(award);
                      const isLast = idx === autoAwards.length - 1;
                      if (isLast) {
                        const remaining = rankFiltered.filter(
                          (r) => r.rank >= idx + 1,
                        );
                        return remaining.length > 0
                          ? remaining.map((r) => ({
                              name: r.team.name,
                              score: r.totalScore,
                            }))
                          : apiNames.map((n) => ({ name: n }));
                      }
                      const ranked = rankFiltered.find(
                        (r) => r.rank === idx + 1,
                      );
                      return ranked
                        ? [{ name: ranked.team.name, score: ranked.totalScore }]
                        : apiNames.map((n) => ({ name: n }));
                    })()
                  : apiNames.map((n) => ({ name: n }));
                const names = entries.map((e) => e.name);

                if (isAuto && names.length === 0) return null;

                return (
                  <div
                    key={award.id}
                    style={{
                      padding: "12px 20px",
                      borderBottom: "1px solid rgba(255,255,255,.05)",
                      background: isRevealed
                        ? "rgba(251,140,5,.03)"
                        : undefined,
                    }}
                  >
                    {/* Header: dot + name + button */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: isRevealed
                            ? "#4ade80"
                            : hasWinners || isAuto
                              ? "var(--orange)"
                              : "rgba(255,255,255,.15)",
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: isRevealed
                              ? "var(--text)"
                              : hasWinners || isAuto
                                ? "var(--text)"
                                : "var(--dim)",
                          }}
                        >
                          {award.name}
                        </span>
                        {isAuto && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: ".1em",
                              color: "var(--orange)",
                              background: "rgba(251,140,5,.12)",
                              border: "1px solid rgba(251,140,5,.25)",
                              borderRadius: 4,
                              padding: "1px 4px",
                              textTransform: "uppercase",
                              flexShrink: 0,
                            }}
                          >
                            Tự động
                          </span>
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {!isAuto && !hasWinners && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,.2)",
                              padding: "3px 8px",
                            }}
                          >
                            —
                          </span>
                        )}
                        {((!isAuto && hasWinners) || isAuto) && !isRevealed && (
                          <button
                            onClick={() => handleReveal(award.id)}
                            disabled={!!pendingId}
                            style={{
                              padding: "4px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              background: pendingId
                                ? "rgba(251,140,5,.2)"
                                : "var(--orange)",
                              color: "#000",
                              border: "none",
                              borderRadius: 6,
                              cursor: pendingId ? "not-allowed" : "pointer",
                              whiteSpace: "nowrap",
                              transition: "opacity .15s",
                              opacity: pendingId && !isPending ? 0.4 : 1,
                            }}
                          >
                            {isPending ? "..." : "Công bố"}
                          </button>
                        )}
                        {isRevealed && (
                          <button
                            onClick={() => handleUnreveal(award.id)}
                            disabled={!!pendingId}
                            style={{
                              padding: "4px 10px",
                              fontSize: 11,
                              fontWeight: 600,
                              background: "transparent",
                              color: pendingId
                                ? "rgba(255,255,255,.2)"
                                : "rgba(255,255,255,.35)",
                              border: "1px solid rgba(255,255,255,.12)",
                              borderRadius: 6,
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
                    {/* Winner names - vertical */}
                    {entries.length > 0 && (
                      <div style={{ paddingLeft: 18, marginTop: 7 }}>
                        {entries.map((entry, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 13,
                              color: "var(--dim)",
                              marginTop: i > 0 ? 2 : 0,
                            }}
                          >
                            <span>{entry.name} -</span>
                            {entry.score === undefined ? (
                              <span>Chưa nhập điểm</span>
                            ) : (
                              <span
                                style={{
                                  color: "rgba(255,255,255,.35)",
                                }}
                              >
                                {entry.score.toFixed(2)} điểm
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {!hasWinners && !isAuto && (
                      <div
                        style={{
                          paddingLeft: 18,
                          marginTop: 4,
                          fontSize: 11,
                          color: "rgba(255,255,255,.2)",
                          fontStyle: "italic",
                        }}
                      >
                        Chưa nhập người nhận
                      </div>
                    )}
                  </div>
                );
              })}

              {sortedAwards.length === 0 && (
                <div
                  style={{
                    padding: "28px 20px",
                    textAlign: "center",
                    color: "var(--dim)",
                    fontSize: 13,
                  }}
                >
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

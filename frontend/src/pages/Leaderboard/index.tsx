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
      <div className="min-h-screen pt-[108px] text-center text-[var(--dim)] text-[14px]">
        Đang tải...
      </div>
    );

  const rankFiltered = rankings
    .filter((r) => r.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);
  const autoAwards = sortedAwards.filter((a) => a.type === "AUTO");
  return (
    <div className="min-h-screen pt-[88px] pb-[60px]">
      {/* ── Page header ── */}
      <div className="con text-center pb-7">
        <div className="inline-flex items-center gap-[10px] mb-[14px]">
          <span className="w-9 h-px bg-[linear-gradient(90deg,transparent,var(--orange))]" />
          <span className="text-[10px] font-extrabold tracking-[.42em] uppercase text-[var(--orange)]">
            LIVE RESULTS
          </span>
          <span className="w-9 h-px bg-[linear-gradient(90deg,var(--orange),transparent)]" />
        </div>
        <h1 className="st">
          BẢNG XẾP <em>HẠNG</em>
        </h1>
      </div>

      {/* ── MC Control Panel ── */}
      {isMC && (
        <div className="con mt-[10px]">
          <div className="rounded-[14px] border border-[rgba(251,140,5,.3)] bg-[var(--bg2)] overflow-hidden">
            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-[14px] px-5 border-b border-[rgba(255,255,255,.06)] bg-[rgba(251,140,5,.04)]">
              <div className="flex items-center gap-[10px]">
                <span className="text-[10px] font-extrabold tracking-[.28em] text-[var(--orange)] uppercase">
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
                    className="py-3 px-5 border-b border-[rgba(255,255,255,.05)]"
                    style={{ background: isRevealed ? "rgba(251,140,5,.03)" : undefined }}
                  >
                    {/* Header: dot + name + button */}
                    <div className="flex items-center gap-[10px]">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: isRevealed
                            ? "#4ade80"
                            : hasWinners || isAuto
                              ? "var(--orange)"
                              : "rgba(255,255,255,.15)",
                        }}
                      />
                      <div className="flex-1 flex items-center gap-[6px] min-w-0">
                        <span
                          className="text-[14px] font-semibold"
                          style={{
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
                          <span className="text-[9px] font-bold tracking-[.1em] text-[var(--orange)] bg-[rgba(251,140,5,.12)] border border-[rgba(251,140,5,.25)] rounded-[4px] px-1 py-px uppercase shrink-0">
                            Tự động
                          </span>
                        )}
                      </div>
                      <div className="shrink-0">
                        {!isAuto && !hasWinners && (
                          <span className="text-[11px] text-[rgba(255,255,255,.2)] py-[3px] px-2">
                            —
                          </span>
                        )}
                        {((!isAuto && hasWinners) || isAuto) && !isRevealed && (
                          <button
                            onClick={() => handleReveal(award.id)}
                            disabled={!!pendingId}
                            className="py-1 px-[10px] text-[11px] font-bold text-black border-none rounded-[6px] whitespace-nowrap transition-opacity duration-150"
                            style={{
                              background: pendingId
                                ? "rgba(251,140,5,.2)"
                                : "var(--orange)",
                              cursor: pendingId ? "not-allowed" : "pointer",
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
                            className="py-1 px-[10px] text-[11px] font-semibold bg-transparent border border-[rgba(255,255,255,.12)] rounded-[6px] whitespace-nowrap transition-opacity duration-150"
                            style={{
                              color: pendingId
                                ? "rgba(255,255,255,.2)"
                                : "rgba(255,255,255,.35)",
                              cursor: pendingId ? "not-allowed" : "pointer",
                            }}
                          >
                            {isPending ? "..." : "Thu hồi"}
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Winner names - vertical */}
                    {entries.length > 0 && (
                      <div className="pl-[18px] mt-[7px]">
                        {entries.map((entry, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-[13px] text-[var(--dim)]${i > 0 ? " mt-[2px]" : ""}`}
                          >
                            <span>{entry.name} -</span>
                            {entry.score === undefined ? (
                              <span>Chưa nhập điểm</span>
                            ) : (
                              <span className="text-[rgba(255,255,255,.35)]">
                                {entry.score.toFixed(2)} điểm
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {!hasWinners && !isAuto && (
                      <div className="pl-[18px] mt-1 text-[11px] text-[rgba(255,255,255,.2)] italic">
                        Chưa nhập người nhận
                      </div>
                    )}
                  </div>
                );
              })}

              {sortedAwards.length === 0 && (
                <div className="py-7 px-5 text-center text-[var(--dim)] text-[13px]">
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

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import VotingApi from "~/api-requests/voting.requests";
import { RoleType } from "~/constants/enums";
import useAuth from "~/hooks/useAuth";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";
import type { CandidateType } from "~/types/voting";

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

type TeamInfo = {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  glowHover: string;
  topBar: string;
};

const VOTE_START = new Date("2026-07-01T16:00:00+07:00");
const VOTE_END = new Date("2026-07-04T23:00:00+07:00");

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const lightenHex = (hex: string, factor = 0.5): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * factor);
  const lg = Math.round(g + (255 - g) * factor);
  const lb = Math.round(b + (255 - b) * factor);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
};

const buildTeamInfo = (
  teamId: string,
  teamName: string,
  teamColor: string,
): TeamInfo => ({
  id: teamId,
  name: teamName,
  color: teamColor,
  glowColor: hexToRgba(teamColor, 0.25),
  glowHover: hexToRgba(teamColor, 0.5),
  topBar: `linear-gradient(90deg,${teamColor},${lightenHex(teamColor)},${teamColor})`,
});

const VoteCard = ({
  candidate,
  isVoted,
  canVote,
  isPending,
  onToggleVote,
}: {
  candidate: CandidateType;
  isVoted: boolean;
  canVote: boolean;
  isPending: boolean;
  onToggleVote: (id: string) => void;
}) => {
  const [hover, setHover] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [justUnvoted, setJustUnvoted] = useState(false);

  const teamId = candidate.teamId ?? "";
  const teamColor = candidate.teamColor ?? "#888888";
  const team: TeamInfo = buildTeamInfo(
    teamId,
    candidate.teamName ?? "Unknown",
    teamColor,
  );
  const disabled = !isVoted && !canVote;

  const handleVote = () => {
    if (disabled || isPending) return;
    if (isVoted) {
      setJustUnvoted(true);
      setTimeout(() => setJustUnvoted(false), 600);
    } else {
      setJustVoted(true);
      setTimeout(() => setJustVoted(false), 800);
    }
    onToggleVote(candidate.id);
  };

  return (
    <div
      className={cn(
        "relative rounded-[18px] overflow-hidden border border-white/[.08] bg-[var(--bg2)] transition-transform duration-[350ms] ease-[ease]",
        justVoted && "vote-pulse",
        hover ? "-translate-y-1" : "translate-y-0",
      )}
      style={{
        boxShadow: `0 0 30px ${team.glowColor}, 0 0 0 1px ${team.glowColor} inset`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ background: team.topBar }} />

      {/* Avatar */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${team.glowHover}, transparent 70%)`,
        }}
      >
        <img
          src={
            candidate.avatarUrls?.[0] ?? "/assets/images/avatar-emptiness.png"
          }
          alt={candidate.name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-[center_top] block transition-[transform,opacity] duration-[400ms] ease-[ease]",
            hover ? "scale-[1.03]" : "scale-100",
            candidate.avatarUrls?.[1] && hover ? "opacity-0" : "opacity-100",
          )}
        />
        {candidate.avatarUrls?.[1] && (
          <img
            src={candidate.avatarUrls[1]}
            alt={candidate.name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover object-[center_top] block transition-[transform,opacity] duration-[400ms] ease-[ease]",
              hover ? "scale-[1.03] opacity-100" : "scale-[1.06] opacity-0",
            )}
          />
        )}

        {/* Vote count badge */}
        <div
          className={cn(
            "absolute top-3 right-3 bg-black/70 border border-[rgba(254,230,34,.3)] rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-sm transition-transform duration-[400ms] ease-[cubic-bezier(.22,.8,.42,1)]",
            justVoted
              ? "scale-[1.3]"
              : justUnvoted
                ? "scale-[0.85]"
                : "scale-100",
          )}
        >
          <span className="text-sm">🔥</span>
          <span className="font-anton text-lg text-[var(--gold)] leading-none [text-shadow:0_0_12px_rgba(254,230,34,.6)]">
            {candidate.voteCount}
          </span>
        </div>

        {justVoted && (
          <div
            className="vote-burst absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 80%, rgba(254,230,34,.35), transparent 65%)",
            }}
          />
        )}

        {/* Team badge */}
        <div
          className="absolute bottom-3 left-3 bg-black/[.65] rounded-lg px-2.5 py-1 text-[9px] font-extrabold tracking-[.2em] uppercase backdrop-blur-sm"
          style={{ border: `1px solid ${team.color}`, color: team.color }}
        >
          {team.name}
        </div>
      </div>

      {/* Info + Vote */}
      <div className="px-[18px] pt-[18px] pb-5">
        <h3 className="font-anton text-[22px] tracking-[.03em] mb-1 text-[var(--text)]">
          {candidate.name}
        </h3>
        <p className="text-[11px] font-bold tracking-[.18em] uppercase text-[var(--dim)] mb-4">
          {team.name}
        </p>

        <button
          type="button"
          onClick={handleVote}
          disabled={disabled || isPending}
          className={cn(
            "font-montserrat w-full py-3 rounded-[10px] text-[11px] font-extrabold tracking-[.18em] uppercase transition-all duration-[300ms] ease-[cubic-bezier(.22,.8,.42,1)]",
            disabled || isPending ? "cursor-not-allowed" : "cursor-pointer",
            disabled && "opacity-35",
            justVoted
              ? "scale-[0.93]"
              : justUnvoted
                ? "scale-[0.97]"
                : "scale-100",
            isVoted
              ? "text-[#050301] bg-[var(--gold)] border border-[var(--gold)] shadow-[0_0_30px_rgba(254,230,34,.5)]"
              : "text-[var(--gold)] bg-[rgba(254,230,34,.08)] border border-[rgba(254,230,34,.25)] shadow-[0_0_10px_rgba(254,230,34,.1)]",
            !isVoted &&
              !disabled &&
              !isPending &&
              "hover:bg-[rgba(254,230,34,.15)] hover:shadow-[0_0_20px_rgba(254,230,34,.3)]",
          )}
        >
          {isPending
            ? "..."
            : disabled
              ? "HẾT LƯỢT"
              : isVoted
                ? "✦ ĐÃ VOTE ✦"
                : "★ VOTE"}
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  usePageTitle("Bình Chọn");
  useSocket();

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");

  const now = new Date();
  const votingStatus =
    now < VOTE_START ? "upcoming" : now > VOTE_END ? "ended" : "active";

  const { data: candidatesRes, isLoading } = useQuery({
    queryKey: ["voting-candidates"],
    queryFn: VotingApi.getCandidates,
  });

  const { data: myVotesRes } = useQuery({
    queryKey: ["voting-my-votes"],
    queryFn: VotingApi.getMyVotes,
    enabled:
      user?.role === RoleType.MEMBER || user?.role === RoleType.BTC_FSTYLE,
  });

  const voteMutation = useMutation({
    mutationFn: VotingApi.vote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting-candidates"] });
      queryClient.invalidateQueries({ queryKey: ["voting-my-votes"] });
      toast.success("Vote thành công!");
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Có lỗi xảy ra!",
      );
    },
  });

  const unvoteMutation = useMutation({
    mutationFn: VotingApi.removeVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting-candidates"] });
      queryClient.invalidateQueries({ queryKey: ["voting-my-votes"] });
      toast.success("Đã hủy vote!");
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Có lỗi xảy ra!",
      );
    },
  });

  const candidates = (candidatesRes?.result ?? [])
    .filter((c) => c.id !== user?.id)
    .map((c) => ({ ...c, voteCount: Number(c.voteCount) }));
  const myVotedIds = new Set(
    (myVotesRes?.result ?? []).map((v) => v.candidateId),
  );

  const handleToggleVote = (candidateId: string) => {
    if (myVotedIds.has(candidateId)) {
      unvoteMutation.mutate(candidateId);
    } else {
      voteMutation.mutate(candidateId);
    }
  };

  const filtered = candidates.filter(
    (c) => activeFilter === "all" || c.teamId === activeFilter,
  );

  const myReceivedVotes = Number(
    (candidatesRes?.result ?? []).find((c) => c.id === user?.id)?.voteCount ??
      0,
  );
  const myVoteCount = myVotedIds.size;
  const MAX_VOTES = 2;
  const isMember = user?.role === RoleType.MEMBER;

  const teamInfoMap = useMemo(() => {
    const map: Record<string, TeamInfo> = {};
    for (const c of candidates) {
      if (c.teamId && !map[c.teamId]) {
        map[c.teamId] = buildTeamInfo(
          c.teamId,
          c.teamName ?? "Unknown",
          c.teamColor ?? "#888888",
        );
      }
    }
    return map;
  }, [candidates]);

  const teamFilters = useMemo(
    () => [
      { id: "all", label: "TẤT CẢ", color: "var(--gold)" },
      ...Object.values(teamInfoMap).map((t) => ({
        id: t.id,
        label: t.name,
        color: t.color,
      })),
    ],
    [teamInfoMap],
  );

  const maxTotalVotes = isMember
    ? MAX_VOTES
    : MAX_VOTES * Object.keys(teamInfoMap).length;
  const remainingVotes = maxTotalVotes - myVoteCount;

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      {/* Header */}
      <section className="pt-[60px] pb-10">
        <div className="con flex flex-col items-center text-center gap-6">
          {/* Title */}
          <div>
            <span className="ey">Bình Chọn Thành Viên Yêu Thích</span>
            <h1
              className="font-anton tracking-[.03em] leading-[1.05] mb-3"
              style={{ fontSize: "clamp(36px, 8vw, 64px)" }}
            >
              VOTE{" "}
              <span className="text-[var(--gold)] [text-shadow:0_0_30px_rgba(254,230,34,.5)]">
                DASHBOARD
              </span>
            </h1>
            <p className="text-sm text-[var(--dim)] max-w-[360px] mx-auto">
              Bình chọn cho thành viên yêu thích - mỗi vote là một lời cổ vũ!
            </p>
          </div>

          {/* Voting period */}
          <div className="w-full max-w-[480px]">
            {/* Status pill */}
            <div className="flex justify-center mb-4">
              <span
                className={cn(
                  "font-montserrat text-[10px] font-black tracking-[.2em] uppercase px-4 py-1.5 rounded-full border",
                  votingStatus === "ended" &&
                    "text-[#D04047] border-[rgba(208,64,71,.4)] bg-[rgba(208,64,71,.08)]",
                  votingStatus === "upcoming" &&
                    "text-orange-400 border-orange-400/40 bg-orange-400/[.08]",
                  votingStatus === "active" &&
                    "text-[#5EAF7C] border-[rgba(94,175,124,.4)] bg-[rgba(94,175,124,.08)]",
                )}
              >
                {votingStatus === "ended"
                  ? "Đã kết thúc"
                  : votingStatus === "upcoming"
                    ? "Sắp bắt đầu"
                    : "Đang diễn ra"}
              </span>
            </div>

            {/* Date cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[rgba(254,230,34,.18)] rounded-xl p-4 bg-[rgba(254,230,34,.02)]">
                <p className="font-montserrat text-[9px] font-black tracking-[.25em] uppercase text-[var(--dim)] mb-2">
                  Bắt đầu
                </p>
                <p className="font-anton text-[28px] text-[var(--gold)] leading-none [text-shadow:0_0_15px_rgba(254,230,34,.3)]">
                  16:00
                </p>
                <p className="font-montserrat text-[11px] text-[var(--dim)] mt-1.5">
                  01 / 07 / 2026
                </p>
              </div>
              <div className="border border-[rgba(254,230,34,.18)] rounded-xl p-4 bg-[rgba(254,230,34,.02)]">
                <p className="font-montserrat text-[9px] font-black tracking-[.25em] uppercase text-[var(--dim)] mb-2">
                  Kết thúc
                </p>
                <p className="font-anton text-[28px] text-[var(--gold)] leading-none [text-shadow:0_0_15px_rgba(254,230,34,.3)]">
                  23:00
                </p>
                <p className="font-montserrat text-[11px] text-[var(--dim)] mt-1.5">
                  04 / 07 / 2026
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {isMember && (
              <div className="px-5 py-3 bg-[rgba(254,230,34,.06)] border border-[rgba(254,230,34,.2)] rounded-[14px] flex items-center gap-2.5">
                <span className="text-[18px]">🔥</span>
                <span className="font-anton text-[26px] text-[var(--gold)] leading-none [text-shadow:0_0_12px_rgba(254,230,34,.5)]">
                  {myReceivedVotes}
                </span>
                <span className="text-[10px] font-extrabold tracking-[.18em] uppercase text-[var(--dim)]">
                  NGƯỜI VOTE BẠN
                </span>
              </div>
            )}
            <div
              className={cn(
                "px-5 py-3 rounded-[14px] flex items-center gap-2.5 border",
                remainingVotes > 0
                  ? "bg-[rgba(94,175,124,.06)] border-[rgba(94,175,124,.25)]"
                  : "bg-[rgba(208,64,71,.06)] border-[rgba(208,64,71,.25)]",
              )}
            >
              <span className="text-[18px]">✋</span>
              <span
                className={cn(
                  "font-anton text-[26px] leading-none",
                  remainingVotes > 0 ? "text-[#5EAF7C]" : "text-[#D04047]",
                )}
              >
                {remainingVotes}/{maxTotalVotes}
              </span>
              <span className="text-[10px] font-extrabold tracking-[.18em] uppercase text-[var(--dim)]">
                LƯỢT VOTE CÒN LẠI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters - hidden for MEMBER role */}
      {!isMember && (
        <section className="pb-10">
          <div className="con">
            <div className="filter-chips flex gap-2 flex-wrap max-[500px]:justify-center">
              {teamFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className="font-montserrat px-[18px] py-2 rounded-[10px] text-[10px] font-extrabold tracking-[.18em] uppercase cursor-pointer transition-all duration-[250ms]"
                  style={{
                    border:
                      activeFilter === f.id
                        ? `1px solid ${f.color}`
                        : "1px solid rgba(255,255,255,.1)",
                    background:
                      activeFilter === f.id
                        ? "rgba(254,230,34,.08)"
                        : "rgba(255,255,255,.03)",
                    color: activeFilter === f.id ? f.color : "var(--dim)",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vote cards grid */}
      <section className="pb-20">
        <div className="con">
          {isLoading ? (
            <div className="text-center py-[60px] text-[var(--dim)] text-sm">
              Đang tải...
            </div>
          ) : (
            <>
              <div className="vote-grid grid grid-cols-1 min-[501px]:grid-cols-2 min-[769px]:grid-cols-3 min-[1025px]:grid-cols-4 gap-5 max-[500px]:max-w-[340px] max-[500px]:mx-auto">
                {filtered.map((candidate) => (
                  <VoteCard
                    key={candidate.id}
                    candidate={candidate}
                    isVoted={myVotedIds.has(candidate.id)}
                    canVote={remainingVotes > 0}
                    isPending={
                      voteMutation.isPending || unvoteMutation.isPending
                    }
                    onToggleVote={handleToggleVote}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-[60px] text-[var(--dim)] text-sm">
                  Không có thành viên nào trong đội này.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @keyframes votePulse {
          0% { box-shadow: 0 0 0 0 rgba(254,230,34,.5); }
          50% { box-shadow: 0 0 0 14px rgba(254,230,34,0); }
          100% { box-shadow: 0 0 0 0 rgba(254,230,34,0); }
        }
        @keyframes voteBurst {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
        .vote-pulse { animation: votePulse .7s ease-out; }
        .vote-burst { animation: voteBurst .8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;

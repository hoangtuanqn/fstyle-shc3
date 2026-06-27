import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import VotingApi from "~/api-requests/voting.requests";
import { RoleType } from "~/constants/enums";
import useAuth from "~/hooks/useAuth";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";
import type { CandidateType } from "~/types/voting";

type TeamInfo = {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  glowHover: string;
  topBar: string;
};

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

  const cardStyle: CSSProperties = {
    position: "relative",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    background: "var(--bg2)",
    boxShadow: `0 0 30px ${team.glowColor}, 0 0 0 1px ${team.glowColor} inset`,
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    transition: "transform .35s ease, box-shadow .35s ease",
  };

  return (
    <div
      className={justVoted ? "vote-pulse" : ""}
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: team.topBar }} />

      {/* Avatar section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          overflow: "hidden",
          background: `radial-gradient(circle at 50% 60%, ${team.glowHover}, transparent 70%)`,
        }}
      >
        {/* Primary image */}
        <img
          src={candidate.avatarUrls?.[0] ?? "/assets/images/avatar-emptiness.png"}
          alt={candidate.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            transform: hover ? "scale(1.03)" : "scale(1)",
            transition: "transform .4s ease, opacity .45s ease",
            opacity: candidate.avatarUrls?.[1] && hover ? 0 : 1,
          }}
        />
        {/* Secondary image (hover) */}
        {candidate.avatarUrls?.[1] && (
          <img
            src={candidate.avatarUrls[1]}
            alt={candidate.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              transform: hover ? "scale(1.03)" : "scale(1.06)",
              transition: "transform .4s ease, opacity .45s ease",
              opacity: hover ? 1 : 0,
            }}
          />
        )}

        {/* Vote count badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,.7)",
            border: "1px solid rgba(254,230,34,.3)",
            borderRadius: 10,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transform: justVoted
              ? "scale(1.3)"
              : justUnvoted
                ? "scale(0.85)"
                : "scale(1)",
            transition: "transform .4s cubic-bezier(.22,.8,.42,1)",
          }}
        >
          <span style={{ fontSize: 14 }}>🔥</span>
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 18,
              color: "var(--gold)",
              textShadow: "0 0 12px rgba(254,230,34,.6)",
              lineHeight: 1,
            }}
          >
            {candidate.voteCount}
          </span>
        </div>

        {/* Vote burst effect */}
        {justVoted && (
          <div
            className="vote-burst"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 50% 80%, rgba(254,230,34,.35), transparent 65%)",
            }}
          />
        )}

        {/* Team badge */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            background: "rgba(0,0,0,.65)",
            border: `1px solid ${team.color}`,
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: team.color,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {team.name}
        </div>
      </div>

      {/* Info + Vote */}
      <div style={{ padding: "18px 18px 20px" }}>
        <h3
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 22,
            letterSpacing: ".03em",
            marginBottom: 4,
            color: "var(--text)",
          }}
        >
          {candidate.name}
        </h3>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--dim)",
            marginBottom: 16,
          }}
        >
          {team.name}
        </p>

        <button
          type="button"
          onClick={handleVote}
          disabled={disabled || isPending}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            cursor: disabled || isPending ? "not-allowed" : "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            opacity: disabled ? 0.35 : 1,
            color: isVoted ? "#050301" : "var(--gold)",
            background: isVoted ? "var(--gold)" : "rgba(254,230,34,.08)",
            border: isVoted
              ? "1px solid var(--gold)"
              : "1px solid rgba(254,230,34,.25)",
            boxShadow: isVoted
              ? "0 0 30px rgba(254,230,34,.5)"
              : "0 0 10px rgba(254,230,34,.1)",
            transform: justVoted
              ? "scale(0.93)"
              : justUnvoted
                ? "scale(0.97)"
                : "scale(1)",
            transition: "all .3s cubic-bezier(.22,.8,.42,1)",
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isPending && !isVoted) {
              e.currentTarget.style.background = "rgba(254,230,34,.15)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(254,230,34,.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isPending && !isVoted) {
              e.currentTarget.style.background = "rgba(254,230,34,.08)";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(254,230,34,.1)";
            }
          }}
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
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 68 }}
    >
      {/* Header */}
      <section style={{ padding: "60px 0 40px", textAlign: "center" }}>
        <div className="con">
          <span className="ey">Bình Chọn Thành Viên Yêu Thích</span>
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: ".03em",
              lineHeight: 1.05,
              marginBottom: 10,
            }}
          >
            VOTE{" "}
            <span
              style={{
                color: "var(--gold)",
                textShadow: "0 0 30px rgba(254,230,34,.5)",
              }}
            >
              DASHBOARD
            </span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--dim)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Bình chọn cho thành viên bạn yêu thích nhất - mỗi vote là một lời cổ
            vũ!
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              marginTop: 28,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {isMember && (
              <div
                style={{
                  padding: "12px 24px",
                  background: "rgba(254,230,34,.06)",
                  border: "1px solid rgba(254,230,34,.2)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>🔥</span>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: 26,
                    color: "var(--gold)",
                    textShadow: "0 0 12px rgba(254,230,34,.5)",
                    lineHeight: 1,
                  }}
                >
                  {myReceivedVotes}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--dim)",
                  }}
                >
                  NGƯỜI VOTE BẠN
                </span>
              </div>
            )}

            <div
              style={{
                padding: "12px 24px",
                background:
                  remainingVotes > 0
                    ? "rgba(94,175,124,.06)"
                    : "rgba(208,64,71,.06)",
                border: `1px solid ${remainingVotes > 0 ? "rgba(94,175,124,.25)" : "rgba(208,64,71,.25)"}`,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>✋</span>
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: 26,
                  color: remainingVotes > 0 ? "#5EAF7C" : "#D04047",
                  lineHeight: 1,
                }}
              >
                {remainingVotes}/{maxTotalVotes}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--dim)",
                }}
              >
                LƯỢT VOTE CÒN LẠI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters - only show team tabs for non-MEMBER roles */}
      <section style={{ paddingBottom: 40 }}>
        <div className="con">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            {/* Team filter chips - hidden for MEMBER role */}
            {!isMember && (
              <div
                className="filter-chips"
                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              >
                {teamFilters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 10,
                      border:
                        activeFilter === f.id
                          ? `1px solid ${f.color}`
                          : "1px solid rgba(255,255,255,.1)",
                      background:
                        activeFilter === f.id
                          ? "rgba(254,230,34,.08)"
                          : "rgba(255,255,255,.03)",
                      color: activeFilter === f.id ? f.color : "var(--dim)",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      fontFamily: "'Montserrat', sans-serif",
                      cursor: "pointer",
                      transition: "all .25s",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vote cards grid */}
      <section style={{ paddingBottom: 80 }}>
        <div className="con">
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--dim)",
                fontSize: 14,
              }}
            >
              Đang tải...
            </div>
          ) : (
            <>
              <div
                className="vote-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                }}
              >
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
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "var(--dim)",
                    fontSize: 14,
                  }}
                >
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
        @media (max-width: 1024px) {
          .vote-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .vote-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .vote-grid { grid-template-columns: 1fr !important; max-width: 340px; margin: 0 auto; }
          .filter-chips { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

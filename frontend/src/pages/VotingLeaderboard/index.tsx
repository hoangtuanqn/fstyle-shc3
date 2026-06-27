import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";

import VotingApi from "~/api-requests/voting.requests";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";
import type { VoteLeaderboardCandidate } from "~/types/voting";

type TeamGroup = {
  teamId: string;
  teamName: string;
  teamColor: string;
  members: (VoteLeaderboardCandidate & { rank: number; percentage: number })[];
  teamVotes: number;
};

const thStyle: CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: 800,
  fontSize: 10,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
  verticalAlign: "middle",
};

const VotingLeaderboard = () => {
  usePageTitle("Xếp Hạng Vote");
  useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["voting-leaderboard"],
    queryFn: VotingApi.getVoteLeaderboard,
  });

  const totalVotes = data?.result?.totalVotes ?? 0;
  const candidates = data?.result?.candidates ?? [];

  const teamGroups = useMemo((): TeamGroup[] => {
    const grouped = new Map<string, VoteLeaderboardCandidate[]>();
    const teamMeta = new Map<
      string,
      { name: string; color: string; order: number }
    >();

    for (const c of candidates) {
      if (!c.teamId) continue;
      if (!grouped.has(c.teamId)) {
        grouped.set(c.teamId, []);
        teamMeta.set(c.teamId, {
          name: c.teamName,
          color: c.teamColor,
          order: c.teamDisplayOrder,
        });
      }
      grouped.get(c.teamId)!.push({ ...c, voteCount: Number(c.voteCount) });
    }

    return Array.from(grouped.entries())
      .sort((a, b) => teamMeta.get(a[0])!.order - teamMeta.get(b[0])!.order)
      .map(([teamId, members]) => {
        const meta = teamMeta.get(teamId)!;
        const sorted = members.sort((a, b) => b.voteCount - a.voteCount);
        const teamVotes = sorted.reduce((s, m) => s + m.voteCount, 0);
        return {
          teamId,
          teamName: meta.name,
          teamColor: meta.color,
          teamVotes,
          members: sorted.map((m, i) => ({
            ...m,
            rank: i + 1,
            percentage: teamVotes > 0 ? (m.voteCount / teamVotes) * 100 : 0,
          })),
        };
      });
  }, [candidates]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          paddingTop: 108,
          textAlign: "center",
          color: "var(--dim)",
        }}
      >
        Đang tải...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108 }}>
      {/* Header */}
      <section style={{ paddingBottom: 40 }}>
        <div className="con" style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 40,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, var(--orange))",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".4em",
                textTransform: "uppercase",
                color: "var(--orange)",
              }}
            >
              GIẢI NỖ LỰC
            </span>
            <span
              style={{
                width: 40,
                height: 1,
                background:
                  "linear-gradient(90deg, var(--orange), transparent)",
              }}
            />
          </div>
          <h1 className="st" style={{ marginBottom: 12 }}>
            BẢNG XẾP HẠNG <em>VOTE</em>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--dim)",
              maxWidth: 500,
              margin: "0 auto 24px",
            }}
          >
            Bình chọn thành viên nỗ lực nhất - kết quả realtime theo từng đội
          </p>

          {/* Total votes badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 28px",
              background: "rgba(254,230,34,.06)",
              border: "1px solid rgba(254,230,34,.2)",
              borderRadius: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>🔥</span>
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 28,
                color: "var(--gold)",
                textShadow: "0 0 12px rgba(254,230,34,.5)",
                lineHeight: 1,
              }}
            >
              {totalVotes}
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
              TỔNG LƯỢT VOTE
            </span>
          </div>
        </div>
      </section>

      {/* Team leaderboards */}
      <section style={{ paddingBottom: 80 }}>
        <div className="con">
          <div
            className="vote-lb-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {teamGroups.map((team) => {
              const hexToRgba = (hex: string, a: number) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r},${g},${b},${a})`;
              };
              const borderColor = hexToRgba(team.teamColor, 0.25);
              const glowColor = hexToRgba(team.teamColor, 0.15);
              const headerBg = hexToRgba(team.teamColor, 0.08);

              return (
                <div
                  key={team.teamId}
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${borderColor}`,
                    background: "var(--bg2)",
                    boxShadow: `0 0 30px ${glowColor}`,
                    overflow: "hidden",
                  }}
                >
                  {/* Team header */}
                  <div
                    style={{
                      padding: "18px 20px",
                      background: headerBg,
                      borderBottom: `1px solid ${borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 4,
                          height: 28,
                          borderRadius: 2,
                          background: team.teamColor,
                          boxShadow: `0 0 12px ${hexToRgba(team.teamColor, 0.5)}`,
                        }}
                      />
                      <h2
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          fontSize: 22,
                          letterSpacing: ".04em",
                          color: team.teamColor,
                          textShadow: `0 0 16px ${hexToRgba(team.teamColor, 0.4)}`,
                        }}
                      >
                        {team.teamName}
                      </h2>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        background: "rgba(0,0,0,.4)",
                        border: `1px solid ${borderColor}`,
                        borderRadius: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          fontSize: 20,
                          color: team.teamColor,
                          lineHeight: 1,
                        }}
                      >
                        {team.teamVotes}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: ".14em",
                          textTransform: "uppercase",
                          color: "var(--dim)",
                        }}
                      >
                        votes
                      </span>
                    </div>
                  </div>

                  {/* Ranking table */}
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              ...thStyle,
                              width: 50,
                              color: team.teamColor,
                              borderBottom: `1px solid ${borderColor}`,
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...thStyle,
                              color: team.teamColor,
                              borderBottom: `1px solid ${borderColor}`,
                            }}
                          >
                            Thành viên
                          </th>
                          <th
                            style={{
                              ...thStyle,
                              textAlign: "center",
                              width: 80,
                              color: team.teamColor,
                              borderBottom: `1px solid ${borderColor}`,
                            }}
                          >
                            Votes
                          </th>
                          <th
                            style={{
                              ...thStyle,
                              textAlign: "right",
                              width: 100,
                              color: team.teamColor,
                              borderBottom: `1px solid ${borderColor}`,
                            }}
                          >
                            Tỷ lệ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.members.map((m) => {
                          const isTop = m.rank <= 3 && m.voteCount > 0;
                          return (
                            <tr key={m.id}>
                              <td
                                style={{
                                  ...tdStyle,
                                  fontWeight: 800,
                                  fontSize: 16,
                                  color: isTop ? team.teamColor : "var(--dim)",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,.04)",
                                }}
                              >
                                {m.rank}
                              </td>
                              <td
                                style={{
                                  ...tdStyle,
                                  borderBottom:
                                    "1px solid rgba(255,255,255,.04)",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: isTop ? 700 : 500,
                                    color: isTop ? "var(--text)" : "var(--dim)",
                                  }}
                                >
                                  {m.name}
                                </span>
                              </td>
                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign: "center",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,.04)",
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "'Anton', sans-serif",
                                    fontSize: 18,
                                    color: isTop
                                      ? team.teamColor
                                      : "var(--dim)",
                                    textShadow: isTop
                                      ? `0 0 10px ${hexToRgba(team.teamColor, 0.4)}`
                                      : "none",
                                  }}
                                >
                                  {m.voteCount}
                                </span>
                              </td>
                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign: "right",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,.04)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <div
                                    style={{
                                      flex: 1,
                                      maxWidth: 60,
                                      height: 4,
                                      borderRadius: 2,
                                      background: "rgba(255,255,255,.06)",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${m.percentage}%`,
                                        height: "100%",
                                        borderRadius: 2,
                                        background: team.teamColor,
                                        boxShadow: `0 0 6px ${hexToRgba(team.teamColor, 0.5)}`,
                                        transition: "width .6s ease",
                                      }}
                                    />
                                  </div>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: isTop
                                        ? team.teamColor
                                        : "var(--dim)",
                                      minWidth: 42,
                                      textAlign: "right",
                                    }}
                                  >
                                    {m.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {team.members.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              style={{
                                ...tdStyle,
                                textAlign: "center",
                                color: "var(--dim)",
                              }}
                            >
                              Chưa có dữ liệu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {teamGroups.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--dim)",
                fontSize: 15,
              }}
            >
              Chưa có dữ liệu bình chọn.
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .vote-lb-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .con { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default VotingLeaderboard;

import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";

import LeaderboardApi from "~/api-requests/leaderboard.requests";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";

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
  useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: LeaderboardApi.getLeaderboard,
  });

  const rankings = data?.result?.rankings ?? [];
  const awards = data?.result?.awards ?? [];

  if (isLoading)
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

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108 }}>
      <section style={{ paddingBottom: 48 }}>
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
                background: "linear-gradient(90deg, transparent, var(--orange))",
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
              LIVE RESULTS
            </span>
            <span
              style={{
                width: 40,
                height: 1,
                background: "linear-gradient(90deg, var(--orange), transparent)",
              }}
            />
          </div>
          <h1 className="st" style={{ marginBottom: 12 }}>
            BẢNG XẾP <em>HẠNG</em>
          </h1>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="con" style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Rankings Table */}
          <div
            style={{
              overflowX: "auto",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.08)",
              background: "var(--bg2)",
              marginBottom: 36,
            }}
          >
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
                        <td
                          style={{
                            ...tdStyle,
                            fontWeight: 800,
                            fontSize: 18,
                            color: isTop3 ? "var(--orange)" : "var(--dim)",
                          }}
                        >
                          #{row.rank}
                        </td>
                        <td style={tdStyle}>
                          <div
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              fontSize: 18,
                              letterSpacing: ".03em",
                            }}
                          >
                            {row.team.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--dim)",
                              marginTop: 2,
                            }}
                          >
                            {row.team.concept}
                          </div>
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            fontWeight: isFirst ? 800 : undefined,
                            color: isFirst ? "var(--orange)" : undefined,
                          }}
                        >
                          {row.totalScore.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Awards Table — luôn hiện tên giải, chưa công bố thì hiện "Chưa có thông tin kết quả" */}
          {awards.length > 0 && (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.08)",
                background: "var(--bg2)",
              }}
            >
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
                      const winnerStyle: CSSProperties = {
                        fontFamily: "'Anton', sans-serif",
                        fontSize: 20,
                        letterSpacing: ".03em",
                        color: "var(--text)",
                      };
                      return (
                        <tr key={award.id}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{award.name}</td>
                          <td style={tdStyle}>
                            {winnerNames.length === 1 && (
                              <span style={winnerStyle}>{winnerNames[0]}</span>
                            )}
                            {winnerNames.length >= 2 && (
                              <ol style={{ margin: 0, paddingLeft: 20, listStyleType: "decimal" }}>
                                {winnerNames.map((name, i) => (
                                  <li
                                    key={i}
                                    style={{
                                      ...winnerStyle,
                                      fontSize: 17,
                                      marginBottom: i < winnerNames.length - 1 ? 4 : 0,
                                    }}
                                  >
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

      <style>{`
        @media (max-width: 600px) {
          .con { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;

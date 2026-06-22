import { useQuery } from '@tanstack/react-query';
import type { CSSProperties } from 'react';

import LeaderboardApi from '~/api-requests/leaderboard.requests';
import useSocket from '~/hooks/useSocket';

const thStyle: CSSProperties = {
  padding: '14px 18px',
  textAlign: 'left',
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--orange)',
  borderBottom: '2px solid rgba(251,140,5,.3)',
  whiteSpace: 'nowrap',
};

const tdStyle: CSSProperties = {
  padding: '14px 18px',
  fontSize: 15,
  color: 'var(--text)',
  borderBottom: '1px solid rgba(255,255,255,.06)',
  verticalAlign: 'middle',
};

const Leaderboard = () => {
  useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: LeaderboardApi.getLeaderboard,
  });

  const rankings = data?.result?.rankings ?? [];
  const awards = data?.result?.awards ?? [];
  const hasAny = rankings.length > 0 || awards.some((a) => a.winners.length > 0);

  if (isLoading)
    return (
      <div style={{ minHeight: '100vh', paddingTop: 108, textAlign: 'center', color: 'var(--dim)' }}>Đang tải...</div>
    );

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <section style={{ paddingBottom: 48 }}>
        <div className="con" style={{ textAlign: 'center' }}>
          <span className="ey">🔥 Heatwave SHC3 Apocalypse</span>
          <h1 className="st" style={{ marginBottom: 12 }}>
            BẢNG XẾP <em>HẠNG</em>
          </h1>
        </div>
      </section>

      {!hasAny && (
        <section style={{ paddingBottom: 80 }}>
          <div className="con" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--dim)', fontSize: 15 }}>Chưa có kết quả — BTC chưa công bố giải thưởng.</p>
          </div>
        </section>
      )}

      {hasAny && (
        <section style={{ paddingBottom: 80 }}>
          <div className="con" style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Rankings Table */}
            {rankings.length > 0 && (
              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,.08)',
                  background: 'var(--bg2)',
                  marginBottom: 36,
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                      <th style={{ ...thStyle, width: '8%' }}>Rank</th>
                      <th style={thStyle}>Đội</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Judge Avg</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>BTC</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((row) => {
                      const isTop3 = row.rank <= 3;
                      const isFirst = row.rank === 1;
                      return (
                        <tr key={row.team.id}>
                          <td
                            style={{
                              ...tdStyle,
                              fontWeight: 800,
                              fontSize: 18,
                              color: isTop3 ? 'var(--orange)' : 'var(--dim)',
                            }}
                          >
                            #{row.rank}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, letterSpacing: '.03em' }}>
                              {row.team.name}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 2 }}>{row.team.concept}</div>
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.judgeAvg}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.btcScore}</td>
                          <td
                            style={{
                              ...tdStyle,
                              textAlign: 'right',
                              fontWeight: isFirst ? 800 : undefined,
                              color: isFirst ? 'var(--orange)' : undefined,
                            }}
                          >
                            {row.totalScore}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Awards Table */}
            {awards.length > 0 && (
              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,.08)',
                  background: 'var(--bg2)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                      <th style={{ ...thStyle, width: '40%' }}>Giải</th>
                      <th style={thStyle}>Tên đội/người nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awards.map((award) => {
                      const hasWinners = award.winners.length > 0;
                      const winnerNames = award.winners
                        .map((w) => w.winnerName)
                        .filter(Boolean)
                        .join(', ');
                      return (
                        <tr key={award.id}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{award.name}</td>
                          <td
                            style={{
                              ...tdStyle,
                              fontFamily: hasWinners ? "'Anton', sans-serif" : undefined,
                              fontSize: hasWinners ? 20 : undefined,
                              letterSpacing: hasWinners ? '.03em' : undefined,
                              color: hasWinners ? 'var(--text)' : 'var(--dim)',
                            }}
                          >
                            {hasWinners ? winnerNames : 'Chưa công bố'}
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

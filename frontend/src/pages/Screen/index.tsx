import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { publicApi } from '~/utils/axiosInstance';
import type { AwardType } from '~/types/award';
import type { LeaderboardData } from '~/types/leaderboard';
import type { ApiResponse } from '~/types/auth';
import { AwardOverlay } from './AwardOverlay';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND as string;

const thS: CSSProperties = {
  padding: '16px 20px',
  textAlign: 'left',
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: 'var(--orange)',
  borderBottom: '2px solid rgba(251,140,5,.25)',
  whiteSpace: 'nowrap',
};

const tdS: CSSProperties = {
  padding: '18px 20px',
  color: 'var(--text)',
  borderBottom: '1px solid rgba(255,255,255,.06)',
  verticalAlign: 'middle',
};

const fetchPublicLeaderboard = async () => {
  const res = await publicApi.get<ApiResponse<LeaderboardData>>('/leaderboard/public');
  return res.data;
};

const Screen = () => {
  const queryClient = useQueryClient();
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [overlayAward, setOverlayAward] = useState<AwardType | null>(null);

  const { data } = useQuery({
    queryKey: ['leaderboard-public'],
    queryFn: fetchPublicLeaderboard,
    refetchInterval: 30_000,
  });

  const rankings = data?.result?.rankings ?? [];
  const awards = data?.result?.awards ?? [];
  const visibleRankings = rankings.filter((r) => r.totalScore > 0);
  const revealedAwards = awards
    .filter((a) => revealedIds.includes(a.id))
    .sort((a, b) => revealedIds.indexOf(a.id) - revealedIds.indexOf(b.id));

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('leaderboard:init', ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
    });

    socket.on('award:revealed', ({ awardId, revealedAwardIds }: { awardId: string; revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
      queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] });
      // Wait briefly for query to refresh, then find award from cache
      setTimeout(() => {
        const cached = queryClient.getQueryData<ApiResponse<LeaderboardData>>(['leaderboard-public']);
        const found = cached?.result?.awards.find((a) => a.id === awardId) ?? null;
        if (found) setOverlayAward(found);
      }, 500);
    });

    socket.on('scores:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] });
    });

    socket.on('awards:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <section style={{ padding: '60px 24px 40px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--orange))',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '.42em',
              textTransform: 'uppercase',
              color: 'var(--orange)',
            }}
          >
            LIVE RESULTS
          </span>
          <span
            style={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, var(--orange), transparent)',
            }}
          />
        </div>
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(40px, 7vw, 80px)',
            letterSpacing: '.04em',
            margin: 0,
            lineHeight: 1,
          }}
        >
          BẢNG XẾP{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>HẠNG</em>
        </h1>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 13,
            color: 'var(--dim)',
            letterSpacing: '.1em',
          }}
        >
          HEATWAVE SHOWCASE #3 · APOCALYPSE
        </p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Rankings table */}
        <div
          style={{
            overflowX: 'auto',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,.08)',
            background: 'var(--bg2)',
            marginBottom: 40,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                <th style={{ ...thS, width: '8%' }}>Rank</th>
                <th style={thS}>Đội</th>
                <th style={{ ...thS, textAlign: 'right' }}>Điểm TB</th>
              </tr>
            </thead>
            <tbody>
              {visibleRankings.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{ ...tdS, textAlign: 'center', color: 'var(--dim)', padding: 32 }}
                  >
                    Chưa có thông tin kết quả
                  </td>
                </tr>
              )}
              {visibleRankings.map((row) => {
                const isFirst = row.rank === 1;
                const isTop3 = row.rank <= 3;
                return (
                  <tr key={row.team.id}>
                    <td
                      style={{
                        ...tdS,
                        fontWeight: 900,
                        fontSize: 22,
                        color: isTop3 ? 'var(--orange)' : 'var(--dim)',
                      }}
                    >
                      {medals[row.rank] ?? `#${row.rank}`}
                    </td>
                    <td style={tdS}>
                      <div
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          fontSize: 22,
                          letterSpacing: '.03em',
                          color: isFirst ? 'var(--orange)' : 'var(--text)',
                        }}
                      >
                        {row.team.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 3 }}>
                        {row.team.concept}
                      </div>
                    </td>
                    <td
                      style={{
                        ...tdS,
                        textAlign: 'right',
                        fontFamily: "'Anton', sans-serif",
                        fontSize: isFirst ? 28 : 22,
                        color: isFirst ? 'var(--orange)' : 'var(--text)',
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

        {/* Revealed awards table */}
        {revealedAwards.length > 0 && (
          <div
            style={{
              overflowX: 'auto',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,.08)',
              background: 'var(--bg2)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                  <th style={{ ...thS, width: '40%' }}>Giải</th>
                  <th style={thS}>Tên đội / Người nhận</th>
                </tr>
              </thead>
              <tbody>
                {revealedAwards.map((award, idx) => {
                  const names = award.winners.map((w) => w.winnerName).filter(Boolean) as string[];
                  return (
                    <tr
                      key={award.id}
                      style={{ animation: `screen-up .5s ${idx * 0.07}s both` }}
                    >
                      <td style={{ ...tdS, fontWeight: 700, fontSize: 16 }}>{award.name}</td>
                      <td style={tdS}>
                        {names.length === 1 && (
                          <span
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              fontSize: 20,
                              letterSpacing: '.03em',
                            }}
                          >
                            {names[0]}
                          </span>
                        )}
                        {names.length >= 2 && (
                          <ol style={{ margin: 0, paddingLeft: 20 }}>
                            {names.map((n, i) => (
                              <li
                                key={i}
                                style={{
                                  fontFamily: "'Anton', sans-serif",
                                  fontSize: 18,
                                  marginBottom: i < names.length - 1 ? 4 : 0,
                                }}
                              >
                                {n}
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

      {overlayAward && (
        <AwardOverlay award={overlayAward} onDismiss={() => setOverlayAward(null)} />
      )}

      <style>{`
        @keyframes screen-up {
          from { opacity: 0; transform: translateY(20px) }
          to { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  );
};

export default Screen;

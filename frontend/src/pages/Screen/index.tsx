import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { publicApi } from '~/utils/axiosInstance';
import ParticleCanvas from '~/components/ParticleCanvas';
import type { AwardType } from '~/types/award';
import type { LeaderboardData } from '~/types/leaderboard';
import type { ApiResponse } from '~/types/auth';
import { AwardOverlay } from './AwardOverlay';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND as string;

const thS: CSSProperties = {
  padding: '16px 24px',
  textAlign: 'left',
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: 'var(--orange)',
  borderBottom: '2px solid rgba(251,140,5,.2)',
  whiteSpace: 'nowrap',
  background: 'rgba(251,140,5,.04)',
};

const tdS: CSSProperties = {
  padding: '18px 24px',
  color: 'var(--text)',
  borderBottom: '1px solid rgba(255,255,255,.05)',
  verticalAlign: 'middle',
};

const fetchPublicLeaderboard = async () => {
  const res = await publicApi.get<ApiResponse<LeaderboardData>>('/leaderboard/public');
  return res.data;
};

const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

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

    socket.on('award:revealed', ({ awardId, revealedAwardIds }: { awardId: string | null; revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
      queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] });
      if (awardId) {
        setTimeout(() => {
          const cached = queryClient.getQueryData<ApiResponse<LeaderboardData>>(['leaderboard-public']);
          const found = cached?.result?.awards.find((a) => a.id === awardId) ?? null;
          if (found) setOverlayAward(found);
        }, 500);
      }
    });

    socket.on('scores:updated', () => queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] }));
    socket.on('awards:updated', () => queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] }));

    return () => { socket.disconnect(); };
  }, [queryClient]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background layers (landing page style) ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: "url('/assets/images/bggg.png') center top / cover no-repeat",
        animation: 'hzoom 22s ease-in-out infinite alternate',
        filter: 'saturate(1.1) contrast(1.05)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: "url('/assets/images/vungtoi.png') center bottom / cover no-repeat",
        opacity: 0.45,
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(5,3,1,.5) 0%, rgba(5,3,1,.25) 30%, rgba(5,3,1,.55) 70%, rgba(5,3,1,.92) 100%)',
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        <ParticleCanvas />
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <section style={{ padding: '64px 24px 48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <span style={{ width: 56, height: 1, background: 'linear-gradient(90deg,transparent,var(--orange))' }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.46em', textTransform: 'uppercase', color: 'var(--orange)', textShadow: '0 0 20px rgba(251,140,5,.7)' }}>
              LIVE RESULTS
            </span>
            <span style={{ width: 56, height: 1, background: 'linear-gradient(90deg,var(--orange),transparent)' }} />
          </div>

          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(52px, 9vw, 110px)',
            letterSpacing: '.05em',
            margin: 0,
            lineHeight: 1,
            textShadow: '0 4px 40px rgba(0,0,0,.6)',
          }}>
            BẢNG XẾP <em style={{ color: 'var(--orange)', fontStyle: 'italic', textShadow: '0 0 40px rgba(251,140,5,.5)' }}>HẠNG</em>
          </h1>

          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: 'rgba(255,255,255,.4)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            Heatwave Showcase #3 · Apocalypse
          </p>
        </section>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 28px 100px' }}>

          {/* Rankings */}
          <div style={{
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,.09)',
            background: 'rgba(10,7,3,.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            marginBottom: 44,
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thS, width: '7%' }}>Rank</th>
                  <th style={thS}>Đội thi</th>
                  <th style={{ ...thS, textAlign: 'right' }}>Điểm TB</th>
                </tr>
              </thead>
              <tbody>
                {visibleRankings.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...tdS, textAlign: 'center', color: 'var(--dim)', padding: '36px 24px', fontSize: 14 }}>
                      Chưa có thông tin kết quả
                    </td>
                  </tr>
                )}
                {visibleRankings.map((row) => {
                  const isFirst = row.rank === 1;
                  const isTop3 = row.rank <= 3;
                  return (
                    <tr key={row.team.id} style={{ background: isFirst ? 'rgba(251,140,5,.04)' : undefined }}>
                      <td style={{ ...tdS, fontWeight: 900, fontSize: 26, color: isTop3 ? 'var(--orange)' : 'rgba(255,255,255,.3)' }}>
                        {medals[row.rank] ?? `#${row.rank}`}
                      </td>
                      <td style={tdS}>
                        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: '.03em', color: isFirst ? 'var(--orange)' : 'var(--text)', textShadow: isFirst ? '0 0 20px rgba(251,140,5,.4)' : 'none' }}>
                          {row.team.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 3, letterSpacing: '.04em' }}>
                          {row.team.concept}
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'right', fontFamily: "'Anton', sans-serif", fontSize: isFirst ? 34 : 26, color: isFirst ? 'var(--orange)' : 'var(--text)', textShadow: isFirst ? '0 0 20px rgba(251,140,5,.4)' : 'none' }}>
                        {row.totalScore.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Revealed awards */}
          {revealedAwards.length > 0 && (
            <div style={{
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,.09)',
              background: 'rgba(10,7,3,.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thS, width: '38%' }}>Giải thưởng</th>
                    <th style={thS}>Tên đội / Người nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {revealedAwards.map((award, idx) => {
                    const names = award.winners.map((w) => w.winnerName).filter(Boolean) as string[];
                    return (
                      <tr key={award.id} style={{ animation: `screen-up .45s ${idx * 0.06}s both` }}>
                        <td style={{ ...tdS, fontWeight: 700, fontSize: 15 }}>{award.name}</td>
                        <td style={tdS}>
                          {names.length === 1 && (
                            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: '.03em' }}>{names[0]}</span>
                          )}
                          {names.length >= 2 && (
                            <ol style={{ margin: 0, paddingLeft: 20 }}>
                              {names.map((n, i) => (
                                <li key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: 19, marginBottom: i < names.length - 1 ? 4 : 0 }}>{n}</li>
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
      </div>

      {overlayAward && <AwardOverlay award={overlayAward} onDismiss={() => setOverlayAward(null)} />}

      <style>{`
        @keyframes hzoom { from { transform: scale(1) } to { transform: scale(1.06) } }
        @keyframes screen-up { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
};

export default Screen;

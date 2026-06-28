import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Trophy } from 'lucide-react';

import { publicApi } from '~/utils/axiosInstance';
import ParticleCanvas from '~/components/ParticleCanvas';
import type { AwardType } from '~/types/award';
import type { LeaderboardData } from '~/types/leaderboard';
import type { ApiResponse } from '~/types/auth';
import { AwardOverlay } from './AwardOverlay';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND as string;

const MEDAL_MAP: Record<string, string> = {
  'quán quân': '/assets/images/gold-medal.png',
  'á quân': '/assets/images/silver-medal.png',
  'khuyến khích': '/assets/images/bronze-medal.png',
};

const getMedalImg = (name: string): string | null => {
  const n = name.toLowerCase();
  for (const [key, src] of Object.entries(MEDAL_MAP)) {
    if (n.includes(key)) return src;
  }
  return null;
};

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


const WaitingScreen = () => {
  const [dots, setDots] = useState('.');
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '.' : d + '.')), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '55vh',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radar rings + center orb */}
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 52 }}>
        {([0, 1, 2, 3] as const).map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px solid var(--orange)',
              animation: `radar-ping 2.8s ${i * 0.7}s ease-out infinite`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgba(10,6,2,.88)',
            border: '2px solid var(--orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'orb-pulse 2.2s ease-in-out infinite',
          }}
        >
          <Trophy size={40} strokeWidth={1.5} style={{ color: 'var(--orange)' }} />
        </div>
      </div>

      <h2
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(36px, 6vw, 72px)',
          letterSpacing: '.05em',
          color: 'var(--orange)',
          textShadow: '0 0 40px rgba(251,140,5,.6)',
          margin: '0 0 16px',
          animation: 'wait-up .7s both',
        }}
      >
        SẮP CÔNG BỐ
      </h2>

      <p
        style={{
          fontSize: 12,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,.3)',
          margin: 0,
          animation: 'wait-up .7s .15s both',
        }}
      >
        Đang chuẩn bị{dots}
      </p>

      {/* Scanline sweep */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(251,140,5,.18), transparent)',
          animation: 'scanline 4s linear infinite',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

const Screen = () => {
  const queryClient = useQueryClient();
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [displayedIds, setDisplayedIds] = useState<string[]>([]);
  const [overlayAward, setOverlayAward] = useState<AwardType | null>(null);

  const { data } = useQuery({
    queryKey: ['leaderboard-public'],
    queryFn: fetchPublicLeaderboard,
    refetchInterval: 30_000,
  });

  const rankings = data?.result?.rankings ?? [];
  const awards = data?.result?.awards ?? [];

  // Map AUTO awards → team names from live rankings (rank 1→Quán Quân, rank 2→Á Quân, rank 3/4→Khuyến Khích)
  const rankedTeams = [...rankings]
    .filter((r) => r.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);

  const autoNamesMap = new Map<string, string[]>();
  let teamCursor = 0;
  for (const award of [...awards].filter((a) => a.type === 'AUTO').sort((a, b) => a.displayOrder - b.displayOrder)) {
    const names: string[] = [];
    for (let i = 0; i < award.quantity && teamCursor < rankedTeams.length; i++) {
      names.push(rankedTeams[teamCursor].team.name);
      teamCursor++;
    }
    autoNamesMap.set(award.id, names);
  }

  const revealedAwards = awards
    .filter((a) => displayedIds.includes(a.id))
    .sort((a, b) => displayedIds.indexOf(b.id) - displayedIds.indexOf(a.id));

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('leaderboard:init', ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
      setDisplayedIds(revealedAwardIds);
    });

    socket.on('award:revealed', ({ awardId, revealedAwardIds }: { awardId: string | null; revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
      if (!awardId) {
        // unreveal: sync displayed to server list, dismiss overlay if its award was removed
        setDisplayedIds(revealedAwardIds);
        setOverlayAward((prev) => (prev && !revealedAwardIds.includes(prev.id) ? null : prev));
      }
      queryClient.invalidateQueries({ queryKey: ['leaderboard-public'] });
      if (awardId) {
        setTimeout(() => {
          const cached = queryClient.getQueryData<ApiResponse<LeaderboardData>>(['leaderboard-public']);
          const found = cached?.result?.awards.find((a) => a.id === awardId) ?? null;
          if (!found) return;
          if (found.type === 'AUTO') {
            const ranked = [...(cached?.result?.rankings ?? [])]
              .filter((r) => r.totalScore > 0)
              .sort((a, b) => b.totalScore - a.totalScore);
            const autoSorted = [...(cached?.result?.awards ?? [])]
              .filter((a) => a.type === 'AUTO')
              .sort((a, b) => a.displayOrder - b.displayOrder);
            let cur = 0;
            for (const a of autoSorted) {
              const computed = ranked.slice(cur, cur + a.quantity).map((r) => r.team.name);
              cur += a.quantity;
              if (a.id === awardId) {
                setOverlayAward({ ...found, winners: computed.map((name, i) => ({ slot: i + 1, winnerTeamId: null, winnerUserId: null, winnerName: name })) });
                return;
              }
            }
          }
          setOverlayAward(found);
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
        <section style={{ padding: '64px 24px 48px', textAlign: 'center', position: 'relative' }}>
          {/* Radial glow burst behind title */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 700, height: 340, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(251,140,5,.13) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'hdr-burst 1s .1s both',
          }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20, animation: 'hdr-badge .5s .05s both' }}>
            <span style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--orange))', animation: 'hdr-line-l .5s .3s both' }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.46em', textTransform: 'uppercase', color: 'var(--orange)', textShadow: '0 0 20px rgba(251,140,5,.7)' }}>
              LIVE RESULTS
            </span>
            <span style={{ height: 1, background: 'linear-gradient(90deg,var(--orange),transparent)', animation: 'hdr-line-r .5s .3s both' }} />
          </div>

          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(48px, 8.5vw, 104px)',
            letterSpacing: '.05em',
            margin: 0,
            lineHeight: 1,
            textShadow: '0 4px 40px rgba(0,0,0,.6)',
            animation: 'hdr-bang .75s .15s both',
          }}>
            CÔNG BỐ <em style={{
              color: 'var(--orange)',
              fontStyle: 'italic',
              textShadow: '0 0 40px rgba(251,140,5,.5)',
              animation: 'hdr-glow 3s 1.2s ease-in-out infinite',
            }}>GIẢI THƯỞNG</em>
          </h1>

          <p style={{ marginTop: 14, marginBottom: 0, fontSize: 13, color: 'rgba(255,255,255,.4)', letterSpacing: '.18em', textTransform: 'uppercase', animation: 'hdr-sub .6s .6s both' }}>
            Heatwave Showcase #3 · Apocalypse
          </p>
        </section>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 28px 100px' }}>

          {revealedAwards.length === 0 && <WaitingScreen />}

          {/* Revealed awards */}
          {revealedAwards.length > 0 && (
            <div style={{
              borderRadius: 16,
              border: '1px solid rgba(251,140,5,.22)',
              background: 'rgba(10,7,3,.68)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              overflow: 'hidden',
              boxShadow: '0 0 48px rgba(251,140,5,.08)',
              animation: 'awards-enter .6s both',
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
                    const names = award.type === 'AUTO'
                      ? (autoNamesMap.get(award.id) ?? [])
                      : award.winners.map((w) => w.winnerName).filter(Boolean) as string[];
                    return (
                      <tr key={award.id} style={{ animation: `screen-up .45s ${idx * 0.06}s both` }}>
                        <td style={{ ...tdS, fontWeight: 700, fontSize: 15 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            {getMedalImg(award.name) && (
                              <img
                                src={getMedalImg(award.name)!}
                                alt=""
                                style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }}
                              />
                            )}
                            <span>{award.name}</span>
                          </div>
                        </td>
                        <td style={tdS}>
                          {names.map((n, i) => (
                            <div key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: '.03em', marginBottom: i < names.length - 1 ? 6 : 0 }}>{n}</div>
                          ))}
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

      {overlayAward && (
        <AwardOverlay
          key={overlayAward.id}
          award={overlayAward}
          onDismiss={() => {
            setDisplayedIds((prev) => (overlayAward && !prev.includes(overlayAward.id) ? [...prev, overlayAward.id] : prev));
            setOverlayAward(null);
          }}
        />
      )}

      <style>{`
        @keyframes hzoom { from { transform: scale(1) } to { transform: scale(1.06) } }
        @keyframes screen-up { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
        @keyframes hdr-bang {
          0%   { opacity: 0; transform: scale(2.4) rotate(-1.5deg); filter: blur(10px); }
          35%  { opacity: 1; transform: scale(.94) rotate(0deg); filter: blur(0); }
          55%  { transform: scale(1.05); }
          75%  { transform: scale(.98); }
          100% { transform: scale(1); }
        }
        @keyframes hdr-badge { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        @keyframes hdr-line-l { from { width: 0; opacity: 0; } to { width: 56px; opacity: 1; } }
        @keyframes hdr-line-r { from { width: 0; opacity: 0; } to { width: 56px; opacity: 1; } }
        @keyframes hdr-sub { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes hdr-burst { from { opacity: 0; transform: translate(-50%,-50%) scale(.4); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes hdr-glow {
          0%, 100% { text-shadow: 0 0 40px rgba(251,140,5,.5); }
          50%       { text-shadow: 0 0 80px rgba(251,140,5,1), 0 0 140px rgba(251,140,5,.4), 0 2px 0 rgba(251,140,5,.3); }
        }
        @keyframes awards-enter { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes radar-ping {
          0%   { transform: scale(0.05); opacity: 0.85; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        @keyframes orb-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(251,140,5,.3), inset 0 0 16px rgba(251,140,5,.06); }
          50%       { box-shadow: 0 0 55px rgba(251,140,5,.85), inset 0 0 28px rgba(251,140,5,.15); }
        }
        @keyframes scanline {
          0%   { top: 5%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.5; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes wait-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

export default Screen;

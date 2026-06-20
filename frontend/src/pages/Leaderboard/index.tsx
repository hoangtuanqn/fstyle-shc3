import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

type AwardsData = {
  teamAwards: Record<string, string>;
  individualAwards: Record<string, string>;
};

const STORAGE_KEY = 'shc3-awards';

const teamRanks = [
  { key: 'first', label: 'Giải Nhất' },
  { key: 'second', label: 'Giải Nhì' },
  { key: 'third', label: 'Giải Ba' },
  { key: 'fourth', label: 'Giải Tư' },
  { key: 'favorite', label: 'Yêu Thích Nhất' },
];

const individualRanks = [
  { key: 'best-performer', label: 'Best Performer' },
  { key: 'best-dancer', label: 'Best Dancer' },
  { key: 'best-face', label: 'Best Face' },
  { key: 'best-energy', label: 'Best Energy' },
  { key: 'best-creativity', label: 'Best Creativity' },
];

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
  const [awards, setAwards] = useState<AwardsData>({ teamAwards: {}, individualAwards: {} });

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setAwards(JSON.parse(raw));
      } catch {}
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const ta = awards.teamAwards;
  const ia = awards.individualAwards;
  const hasTeam = Object.values(ta).some(Boolean);
  const hasIndividual = Object.values(ia).some(Boolean);
  const hasAny = hasTeam || hasIndividual;

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
            {/* Team Awards Table */}
            {hasTeam && (
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
                      <th style={{ ...thStyle, width: '40%' }}>Hạng giải</th>
                      <th style={thStyle}>Tên đội</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamRanks.map((rank) => {
                      const name = ta[rank.key];
                      if (!name) return null;
                      return (
                        <tr key={rank.key}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{rank.label}</td>
                          <td
                            style={{
                              ...tdStyle,
                              fontFamily: "'Anton', sans-serif",
                              fontSize: 20,
                              letterSpacing: '.03em',
                            }}
                          >
                            {name}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Individual Awards Table */}
            {hasIndividual && (
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
                      <th style={{ ...thStyle, width: '40%' }}>Giải cá nhân</th>
                      <th style={thStyle}>Tên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualRanks.map((rank) => {
                      const name = ia[rank.key];
                      if (!name) return null;
                      return (
                        <tr key={rank.key}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{rank.label}</td>
                          <td
                            style={{
                              ...tdStyle,
                              fontFamily: "'Anton', sans-serif",
                              fontSize: 20,
                              letterSpacing: '.03em',
                            }}
                          >
                            {name}
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

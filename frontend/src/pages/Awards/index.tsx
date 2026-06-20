import { useState } from 'react';
import type { CSSProperties } from 'react';

const TEAMS = ['SHIRO KURO', 'APEX AURA', 'SLATT', 'ANTI'] as const;

const teamColors: Record<string, { color: string; glow: string }> = {
  'SHIRO KURO': { color: 'var(--shiro)', glow: 'rgba(200,200,200,.15)' },
  'APEX AURA': { color: 'var(--apex)', glow: 'rgba(208,64,71,.15)' },
  SLATT: { color: 'var(--slatt)', glow: 'rgba(89,115,179,.15)' },
  ANTI: { color: 'var(--anti)', glow: 'rgba(94,175,124,.15)' },
};

type TeamAward = {
  label: string;
  emoji: string;
  key: string;
};

type IndividualAward = {
  label: string;
  emoji: string;
  key: string;
};

const teamAwards: TeamAward[] = [
  { label: 'Giải Nhất', emoji: '🥇', key: 'first' },
  { label: 'Giải Nhì', emoji: '🥈', key: 'second' },
  { label: 'Giải Ba', emoji: '🥉', key: 'third' },
  { label: 'Giải Tư', emoji: '4️⃣', key: 'fourth' },
];

const individualAwards: IndividualAward[] = [
  { label: 'Best Performer', emoji: '🌟', key: 'best-performer' },
  { label: 'Best Dancer', emoji: '💃', key: 'best-dancer' },
  { label: 'Best Face', emoji: '✨', key: 'best-face' },
  { label: 'Best Energy', emoji: '🔥', key: 'best-energy' },
  { label: 'Best Creativity', emoji: '🎨', key: 'best-creativity' },
];

export type AwardsData = {
  teamAwards: Record<string, string>;
  individualAwards: Record<string, string>;
};

const STORAGE_KEY = 'shc3-awards';

const loadAwards = (): AwardsData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { teamAwards: {}, individualAwards: {} };
};

const saveAwards = (data: AwardsData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.1)',
  background: 'rgba(255,255,255,.04)',
  color: 'var(--text)',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 14,
  outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FEE622' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
};

const Awards = () => {
  const [data, setData] = useState<AwardsData>(loadAwards);
  const [saved, setSaved] = useState(false);

  const updateTeamAward = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      teamAwards: { ...prev.teamAwards, [key]: value },
    }));
    setSaved(false);
  };

  const updateIndividualAward = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      individualAwards: { ...prev.individualAwards, [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    saveAwards(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const empty: AwardsData = { teamAwards: {}, individualAwards: {} };
    setData(empty);
    saveAwards(empty);
  };

  const usedTeams = new Set(Object.values(data.teamAwards).filter(Boolean));

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <section style={{ paddingBottom: 48 }}>
        <div className="con" style={{ textAlign: 'center' }}>
          <span className="ey">🔧 BTC Panel</span>
          <h1 className="st" style={{ marginBottom: 12 }}>
            NHẬP <em>GIẢI THƯỞNG</em>
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
            Nhập tên đội / cá nhân cho từng hạng giải — dữ liệu sẽ hiển thị trên trang Leaderboard
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="con" style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Team Awards */}
          <div
            style={{
              borderRadius: 16,
              border: '1px solid rgba(254,230,34,.15)',
              background: 'var(--bg2)',
              padding: '32px 28px',
              marginBottom: 28,
              boxShadow: '0 8px 40px rgba(0,0,0,.5)',
            }}
          >
            <h2
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 22,
                letterSpacing: '.04em',
                color: 'var(--gold)',
                marginBottom: 6,
              }}
            >
              🏆 GIẢI ĐỘI
            </h2>
            <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 28 }}>
              Chọn đội từ danh sách — mỗi đội chỉ được chọn một lần
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {teamAwards.map((award) => {
                const selectedTeam = data.teamAwards[award.key] || '';
                return (
                  <div key={award.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        minWidth: 140,
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{award.emoji}</span>
                      {award.label}
                    </div>
                    <select
                      value={selectedTeam}
                      onChange={(e) => updateTeamAward(award.key, e.target.value)}
                      style={{
                        ...selectStyle,
                        borderColor: selectedTeam
                          ? teamColors[selectedTeam]?.color || 'rgba(254,230,34,.3)'
                          : 'rgba(255,255,255,.1)',
                        background: selectedTeam
                          ? teamColors[selectedTeam]?.glow || 'rgba(254,230,34,.06)'
                          : 'rgba(255,255,255,.04)',
                      }}
                    >
                      <option value="" style={{ background: '#0a0703', color: '#888' }}>
                        — Chọn đội —
                      </option>
                      {TEAMS.map((team) => (
                        <option
                          key={team}
                          value={team}
                          disabled={usedTeams.has(team) && data.teamAwards[award.key] !== team}
                          style={{ background: '#0a0703', color: '#f2ede0' }}
                        >
                          {team}
                          {usedTeams.has(team) && data.teamAwards[award.key] !== team ? ' (đã chọn)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              {/* Yêu Thích — text input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                <div
                  style={{
                    minWidth: 140,
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>❤️</span>
                  Yêu Thích Nhất
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên đội..."
                  value={data.teamAwards['favorite'] || ''}
                  onChange={(e) => updateTeamAward('favorite', e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b8a';
                    e.target.style.boxShadow = '0 0 16px rgba(255,107,138,.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = e.target.value
                      ? 'rgba(255,107,138,.3)'
                      : 'rgba(255,255,255,.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Individual Awards */}
          <div
            style={{
              borderRadius: 16,
              border: '1px solid rgba(251,140,5,.15)',
              background: 'var(--bg2)',
              padding: '32px 28px',
              marginBottom: 28,
              boxShadow: '0 8px 40px rgba(0,0,0,.5)',
            }}
          >
            <h2
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 22,
                letterSpacing: '.04em',
                color: 'var(--orange)',
                marginBottom: 6,
              }}
            >
              🌟 GIẢI CÁ NHÂN
            </h2>
            <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 28 }}>
              Nhập tên thành viên nhận giải
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {individualAwards.map((award) => (
                <div key={award.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      minWidth: 140,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{award.emoji}</span>
                    {award.label}
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập tên..."
                    value={data.individualAwards[award.key] || ''}
                    onChange={(e) => updateIndividualAward(award.key, e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--orange)';
                      e.target.style.boxShadow = '0 0 16px rgba(251,140,5,.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = e.target.value
                        ? 'rgba(251,140,5,.3)'
                        : 'rgba(255,255,255,.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '14px 40px',
                borderRadius: 10,
                border: 'none',
                background: saved ? '#5EAF7C' : 'var(--gold)',
                color: '#050301',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all .3s',
                boxShadow: saved ? '0 0 30px rgba(94,175,124,.4)' : '0 0 20px rgba(254,230,34,.3)',
              }}
            >
              {saved ? '✓ ĐÃ LƯU' : '💾 LƯU GIẢI THƯỞNG'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                border: '1px solid rgba(208,64,71,.3)',
                background: 'rgba(208,64,71,.08)',
                color: 'var(--apex)',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all .3s',
              }}
            >
              🗑️ XÓA HẾT
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .con { padding: 0 16px !important; }
        }
        select option:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default Awards;

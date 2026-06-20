import { useState } from 'react';

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
    <div className="min-h-screen pt-[108px]">
      <section className="pb-12">
        <div className="con text-center">
          <span className="ey">🔧 BTC Panel</span>
          <h1 className="st mb-3">
            NHẬP <em className="st-em">GIẢI THƯỞNG</em>
          </h1>
          <p className="text-dim text-[14px] max-w-[500px] mx-auto">
            Nhập tên đội / cá nhân cho từng hạng giải — dữ liệu sẽ hiển thị trên trang Leaderboard
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="con max-w-[720px] mx-auto">
          {/* Team Awards */}
          <div className="rounded-2xl border border-[rgba(254,230,34,.15)] bg-bg2 px-7 py-8 mb-7 shadow-[0_8px_40px_rgba(0,0,0,.5)]">
            <h2 className="font-anton text-[22px] tracking-[.04em] text-gold mb-1.5">🏆 GIẢI ĐỘI</h2>
            <p className="text-[12px] text-dim mb-7">Chọn đội từ danh sách — mỗi đội chỉ được chọn một lần</p>

            <div className="flex flex-col gap-[18px]">
              {teamAwards.map((award) => {
                const selectedTeam = data.teamAwards[award.key] || '';
                return (
                  <div key={award.key} className="flex items-center gap-3.5">
                    <div className="min-w-[140px] text-[13px] font-bold text-text flex items-center gap-2">
                      <span className="text-[20px]">{award.emoji}</span>
                      {award.label}
                    </div>
                    <select
                      value={selectedTeam}
                      onChange={(e) => updateTeamAward(award.key, e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-[10px] font-montserrat text-[14px] text-text outline-none transition-[border-color,box-shadow] duration-200 cursor-pointer appearance-none pr-9 bg-no-repeat bg-[right_12px_center]"
                      style={{
                        borderColor: selectedTeam
                          ? teamColors[selectedTeam]?.color || 'rgba(254,230,34,.3)'
                          : 'rgba(255,255,255,.1)',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        background: selectedTeam
                          ? teamColors[selectedTeam]?.glow || 'rgba(254,230,34,.06)'
                          : 'rgba(255,255,255,.04)',
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FEE622' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      <option value="" className="bg-[#0a0703] text-[#888]">
                        — Chọn đội —
                      </option>
                      {TEAMS.map((team) => (
                        <option
                          key={team}
                          value={team}
                          disabled={usedTeams.has(team) && data.teamAwards[award.key] !== team}
                          className="bg-[#0a0703] text-text disabled:opacity-50"
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
              <div className="flex items-center gap-3.5 mt-1.5">
                <div className="min-w-[140px] text-[13px] font-bold text-text flex items-center gap-2">
                  <span className="text-[20px]">❤️</span>
                  Yêu Thích Nhất
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên đội..."
                  value={data.teamAwards['favorite'] || ''}
                  onChange={(e) => updateTeamAward('favorite', e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-[10px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] text-text font-montserrat text-[14px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#ff6b8a] focus:shadow-[0_0_16px_rgba(255,107,138,.2)]"
                  onBlur={(e) => {
                    e.target.style.borderColor = e.target.value
                      ? 'rgba(255,107,138,.3)'
                      : 'rgba(255,255,255,.1)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Individual Awards */}
          <div className="rounded-2xl border border-[rgba(251,140,5,.15)] bg-bg2 px-7 py-8 mb-7 shadow-[0_8px_40px_rgba(0,0,0,.5)]">
            <h2 className="font-anton text-[22px] tracking-[.04em] text-orange mb-1.5">🌟 GIẢI CÁ NHÂN</h2>
            <p className="text-[12px] text-dim mb-7">Nhập tên thành viên nhận giải</p>

            <div className="flex flex-col gap-[18px]">
              {individualAwards.map((award) => (
                <div key={award.key} className="flex items-center gap-3.5">
                  <div className="min-w-[140px] text-[13px] font-bold text-text flex items-center gap-2">
                    <span className="text-[20px]">{award.emoji}</span>
                    {award.label}
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập tên..."
                    value={data.individualAwards[award.key] || ''}
                    onChange={(e) => updateIndividualAward(award.key, e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-[10px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] text-text font-montserrat text-[14px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-orange focus:shadow-[0_0_16px_rgba(251,140,5,.2)]"
                    onBlur={(e) => {
                      e.target.style.borderColor = e.target.value
                        ? 'rgba(251,140,5,.3)'
                        : 'rgba(255,255,255,.1)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3.5 justify-center">
            <button
              type="button"
              onClick={handleSave}
              className={`px-10 py-3.5 rounded-[10px] border-none font-montserrat text-[12px] font-[800] tracking-[.14em] uppercase cursor-pointer transition-all duration-300 text-[#050301] ${
                saved
                  ? 'bg-[#5EAF7C] shadow-[0_0_30px_rgba(94,175,124,.4)]'
                  : 'bg-gold shadow-[0_0_20px_rgba(254,230,34,.3)]'
              }`}
            >
              {saved ? '✓ ĐÃ LƯU' : '💾 LƯU GIẢI THƯỞNG'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-7 py-3.5 rounded-[10px] border border-[rgba(208,64,71,.3)] bg-[rgba(208,64,71,.08)] text-apex font-montserrat text-[12px] font-[800] tracking-[.14em] uppercase cursor-pointer transition-all duration-300"
            >
              🗑️ XÓA HẾT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Awards;

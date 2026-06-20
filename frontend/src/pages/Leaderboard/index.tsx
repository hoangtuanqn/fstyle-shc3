import { useState, useEffect } from 'react';

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
    <div className="min-h-screen pt-[108px]">
      <section className="pb-12">
        <div className="con text-center">
          <span className="ey">🔥 Heatwave SHC3 Apocalypse</span>
          <h1 className="st mb-3">
            BẢNG XẾP <em className="st-em">HẠNG</em>
          </h1>
        </div>
      </section>

      {!hasAny && (
        <section className="pb-20">
          <div className="con text-center">
            <p className="text-dim text-[15px]">Chưa có kết quả — BTC chưa công bố giải thưởng.</p>
          </div>
        </section>
      )}

      {hasAny && (
        <section className="pb-20">
          <div className="con max-w-[700px] mx-auto">
            {/* Team Awards Table */}
            {hasTeam && (
              <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,.08)] bg-bg2 mb-9">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[rgba(251,140,5,.06)]">
                      <th className="px-[18px] py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[40%]">
                        Hạng giải
                      </th>
                      <th className="px-[18px] py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap">
                        Tên đội
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamRanks.map((rank) => {
                      const name = ta[rank.key];
                      if (!name) return null;
                      return (
                        <tr key={rank.key}>
                          <td className="px-[18px] py-3.5 text-[15px] text-text border-b border-[rgba(255,255,255,.06)] align-middle font-bold">
                            {rank.label}
                          </td>
                          <td className="px-[18px] py-3.5 text-[15px] text-text border-b border-[rgba(255,255,255,.06)] align-middle font-anton text-[20px] tracking-[.03em]">
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
              <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,.08)] bg-bg2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[rgba(251,140,5,.06)]">
                      <th className="px-[18px] py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[40%]">
                        Giải cá nhân
                      </th>
                      <th className="px-[18px] py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap">
                        Tên
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualRanks.map((rank) => {
                      const name = ia[rank.key];
                      if (!name) return null;
                      return (
                        <tr key={rank.key}>
                          <td className="px-[18px] py-3.5 text-[15px] text-text border-b border-[rgba(255,255,255,.06)] align-middle font-bold">
                            {rank.label}
                          </td>
                          <td className="px-[18px] py-3.5 text-[15px] text-text border-b border-[rgba(255,255,255,.06)] align-middle font-anton text-[20px] tracking-[.03em]">
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
    </div>
  );
};

export default Leaderboard;

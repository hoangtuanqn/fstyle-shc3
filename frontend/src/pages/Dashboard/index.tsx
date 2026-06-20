import { useState, useCallback } from 'react';

type TeamInfo = {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  glowHover: string;
  topBar: string;
};

const teamMap: Record<string, TeamInfo> = {
  shiro: {
    id: 'shiro',
    name: 'SHIRO KURO',
    color: 'var(--shiro)',
    glowColor: 'rgba(200,200,200,.25)',
    glowHover: 'rgba(200,200,200,.45)',
    topBar: 'linear-gradient(90deg,#444,#ddd,#444)',
  },
  apex: {
    id: 'apex',
    name: 'APEX AURA',
    color: 'var(--apex)',
    glowColor: 'rgba(208,64,71,.25)',
    glowHover: 'rgba(208,64,71,.5)',
    topBar: 'linear-gradient(90deg,#D04047,#ff9a9e,#D04047)',
  },
  slatt: {
    id: 'slatt',
    name: 'SLATT',
    color: 'var(--slatt)',
    glowColor: 'rgba(89,115,179,.25)',
    glowHover: 'rgba(89,115,179,.5)',
    topBar: 'linear-gradient(90deg,#5973B3,#a8baec,#5973B3)',
  },
  anti: {
    id: 'anti',
    name: 'ANTI',
    color: 'var(--anti)',
    glowColor: 'rgba(94,175,124,.25)',
    glowHover: 'rgba(94,175,124,.5)',
    topBar: 'linear-gradient(90deg,#5EAF7C,#a8dbb9,#5EAF7C)',
  },
};

type Member = {
  id: string;
  name: string;
  role: string;
  teamId: string;
  avatar: string;
  votes: number;
};

const initialMembers: Member[] = [
  { id: '1', name: 'Minh Khoa', role: 'Leader', teamId: 'shiro', avatar: '/assets/images/avatar-emptiness.png', votes: 12 },
  { id: '2', name: 'Thu Hà', role: 'Dancer', teamId: 'shiro', avatar: '/assets/images/avatar-emptiness.png', votes: 8 },
  { id: '3', name: 'Đức Anh', role: 'Choreographer', teamId: 'shiro', avatar: '/assets/images/avatar-emptiness.png', votes: 15 },
  { id: '4', name: 'Hoàng Yến', role: 'Leader', teamId: 'apex', avatar: '/assets/images/avatar-inner-conflict.png', votes: 20 },
  { id: '5', name: 'Quốc Bảo', role: 'Dancer', teamId: 'apex', avatar: '/assets/images/avatar-inner-conflict.png', votes: 6 },
  { id: '6', name: 'Ngọc Trâm', role: 'Performer', teamId: 'apex', avatar: '/assets/images/avatar-inner-conflict.png', votes: 11 },
  { id: '7', name: 'Thanh Tùng', role: 'Leader', teamId: 'slatt', avatar: '/assets/images/avatar-awakening.png', votes: 18 },
  { id: '8', name: 'Mai Linh', role: 'Dancer', teamId: 'slatt', avatar: '/assets/images/avatar-awakening.png', votes: 9 },
  { id: '9', name: 'Phúc An', role: 'Vocalist', teamId: 'slatt', avatar: '/assets/images/avatar-awakening.png', votes: 14 },
  { id: '10', name: 'Khánh Vy', role: 'Leader', teamId: 'anti', avatar: '/assets/images/avatar-letting-go.png', votes: 22 },
  { id: '11', name: 'Hải Đăng', role: 'Dancer', teamId: 'anti', avatar: '/assets/images/avatar-letting-go.png', votes: 7 },
  { id: '12', name: 'Bảo Ngọc', role: 'Performer', teamId: 'anti', avatar: '/assets/images/avatar-letting-go.png', votes: 16 },
];

const VoteCard = ({
  member,
  onVote,
}: {
  member: Member;
  onVote: (id: string) => void;
}) => {
  const [hover, setHover] = useState(false);
  const [voting, setVoting] = useState(false);
  const team = teamMap[member.teamId];

  const handleVote = () => {
    setVoting(true);
    onVote(member.id);
    setTimeout(() => setVoting(false), 600);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[18px] border border-[rgba(255,255,255,.08)] bg-bg2 transition-[transform,box-shadow] duration-400 [transition-timing-function:cubic-bezier(.22,.8,.42,1)]"
      style={{
        boxShadow: hover
          ? `0 18px 50px ${team.glowHover}, 0 0 0 1px ${team.glowHover} inset`
          : `0 0 30px ${team.glowColor}, 0 0 0 1px ${team.glowColor} inset`,
        transform: hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ background: team.topBar }} />

      {/* Avatar section */}
      <div
        className="relative w-full overflow-hidden [aspect-ratio:1]"
        style={{ background: `radial-gradient(circle at 50% 60%, ${team.glowHover}, transparent 70%)` }}
      >
        <img
          src={member.avatar}
          alt={member.name}
          className="block h-full w-full object-cover object-[center_top] transition-transform duration-500 ease-out"
          style={{ transform: hover ? 'scale(1.06)' : 'scale(1)' }}
        />

        {/* Vote count badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-[10px] border border-[rgba(254,230,34,.3)] bg-[rgba(0,0,0,.7)] px-3 py-1.5 backdrop-blur-[8px]"
          style={{
            transform: voting ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform .3s cubic-bezier(.22,.8,.42,1)',
          }}
        >
          <span className="text-[14px]">🔥</span>
          <span className="font-anton text-[18px] leading-none text-gold [text-shadow:0_0_12px_rgba(254,230,34,.6)]">
            {member.votes}
          </span>
        </div>

        {/* Team badge */}
        <div
          className="absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[9px] font-[800] uppercase tracking-[.2em] backdrop-blur-[8px] bg-[rgba(0,0,0,.65)]"
          style={{ border: `1px solid ${team.color}`, color: team.color }}
        >
          {team.name}
        </div>
      </div>

      {/* Info + Vote */}
      <div className="px-[18px] pt-[18px] pb-5">
        <h3 className="mb-1 font-anton text-[22px] tracking-[.03em] text-text">{member.name}</h3>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[.18em] text-dim">{member.role}</p>

        <button
          type="button"
          onClick={handleVote}
          className={`w-full cursor-pointer rounded-[10px] py-3 font-montserrat text-[11px] font-[800] uppercase tracking-[.18em] transition-all duration-300 [transition-timing-function:cubic-bezier(.22,.8,.42,1)] ${
            voting
              ? 'border border-gold bg-gold text-[#050301] shadow-[0_0_30px_rgba(254,230,34,.5)] scale-[0.96]'
              : 'border border-[rgba(254,230,34,.25)] bg-[rgba(254,230,34,.08)] text-gold shadow-[0_0_10px_rgba(254,230,34,.1)] hover:bg-[rgba(254,230,34,.15)] hover:shadow-[0_0_20px_rgba(254,230,34,.3)]'
          }`}
        >
          {voting ? '✦ ĐÃ VOTE ✦' : '★ VOTE'}
        </button>
      </div>
    </div>
  );
};

const teamFilters = [
  { id: 'all', label: 'TẤT CẢ', color: 'var(--gold)' },
  { id: 'shiro', label: 'SHIRO KURO', color: 'var(--shiro)' },
  { id: 'apex', label: 'APEX AURA', color: 'var(--apex)' },
  { id: 'slatt', label: 'SLATT', color: 'var(--slatt)' },
  { id: 'anti', label: 'ANTI', color: 'var(--anti)' },
];

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'votes' | 'name'>('votes');

  const handleVote = useCallback((id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, votes: m.votes + 1 } : m)),
    );
  }, []);

  const filtered = members
    .filter((m) => activeFilter === 'all' || m.teamId === activeFilter)
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      return a.name.localeCompare(b.name, 'vi');
    });

  const totalVotes = members.reduce((sum, m) => sum + m.votes, 0);

  const teamStats = Object.entries(teamMap).map(([id, team]) => {
    const teamVotes = members.filter((m) => m.teamId === id).reduce((s, m) => s + m.votes, 0);
    return { ...team, votes: teamVotes };
  });
  teamStats.sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-bg pt-[68px]">
      {/* Header */}
      <section className="pt-[60px] pb-10 text-center">
        <div className="con">
          <span className="ey">Bình Chọn Thành Viên Yêu Thích</span>
          <h1 className="font-anton text-[clamp(36px,5vw,64px)] leading-[1.05] tracking-[.03em]">
            VOTE{' '}
            <span className="text-gold [text-shadow:0_0_30px_rgba(254,230,34,.5)]">DASHBOARD</span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-[500px] text-[14px] text-dim">
            Bình chọn cho thành viên bạn yêu thích nhất — mỗi vote là một lời cổ vũ!
          </p>

          {/* Total votes counter */}
          <div className="mt-7 inline-flex items-center gap-2.5 rounded-[14px] border border-[rgba(254,230,34,.2)] bg-[rgba(254,230,34,.06)] px-7 py-3">
            <span className="text-[20px]">🏆</span>
            <span className="font-anton text-[28px] text-gold [text-shadow:0_0_16px_rgba(254,230,34,.5)]">
              {totalVotes}
            </span>
            <span className="text-[10px] font-[800] uppercase tracking-[.22em] text-dim">TỔNG VOTE</span>
          </div>
        </div>
      </section>

      {/* Team stats bar */}
      <section className="pb-8">
        <div className="con">
          <div className="grid grid-cols-4 gap-3.5 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
            {teamStats.map((team, i) => (
              <div
                key={team.id}
                className="flex items-center justify-between rounded-[14px] bg-bg2 px-[18px] py-4 transition-shadow duration-300"
                style={{
                  border: i === 0 ? `1px solid ${team.color}` : '1px solid rgba(255,255,255,.06)',
                  boxShadow: i === 0 ? `0 0 24px ${team.glowColor}` : 'none',
                }}
              >
                <div>
                  <div
                    className="mb-1 text-[9px] font-[800] uppercase tracking-[.2em]"
                    style={{ color: team.color }}
                  >
                    {i === 0 && '👑 '}
                    {team.name}
                  </div>
                  <div className="font-anton text-[26px] text-text">
                    {team.votes}
                    <span className="ml-1.5 font-montserrat text-[12px] text-dim">votes</span>
                  </div>
                </div>
                {/* Mini progress circle */}
                <div
                  className="flex h-[50px] w-[50px] items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(${team.color} ${(team.votes / Math.max(totalVotes, 1)) * 360}deg, rgba(255,255,255,.06) 0deg)`,
                  }}
                >
                  <div
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-bg2 text-[11px] font-[800]"
                    style={{ color: team.color }}
                  >
                    {totalVotes > 0 ? Math.round((team.votes / totalVotes) * 100) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-10">
        <div className="con">
          <div className="flex flex-wrap items-center justify-between gap-3.5">
            {/* Team filter chips */}
            <div className="flex flex-wrap gap-2 max-[500px]:justify-center">
              {teamFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className="cursor-pointer rounded-[10px] px-[18px] py-2 font-montserrat text-[10px] font-[800] uppercase tracking-[.18em] transition-all duration-[250ms]"
                  style={{
                    border:
                      activeFilter === f.id
                        ? `1px solid ${f.color}`
                        : '1px solid rgba(255,255,255,.1)',
                    background:
                      activeFilter === f.id ? 'rgba(254,230,34,.08)' : 'rgba(255,255,255,.03)',
                    color: activeFilter === f.id ? f.color : 'var(--dim)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort toggle */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSortBy('votes')}
                className={`cursor-pointer rounded-lg border-none px-3.5 py-2 font-montserrat text-[10px] font-[800] tracking-[.14em] transition-all duration-[250ms] ${
                  sortBy === 'votes'
                    ? 'bg-[rgba(254,230,34,.12)] text-gold'
                    : 'bg-transparent text-dim'
                }`}
              >
                🔥 TOP VOTE
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`cursor-pointer rounded-lg border-none px-3.5 py-2 font-montserrat text-[10px] font-[800] tracking-[.14em] transition-all duration-[250ms] ${
                  sortBy === 'name'
                    ? 'bg-[rgba(254,230,34,.12)] text-gold'
                    : 'bg-transparent text-dim'
                }`}
              >
                A→Z TÊN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vote cards grid */}
      <section className="pb-20">
        <div className="con">
          <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-[500px]:mx-auto max-[500px]:max-w-[340px] max-[500px]:grid-cols-1">
            {filtered.map((member) => (
              <VoteCard key={member.id} member={member} onVote={handleVote} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-[60px] text-center text-[14px] text-dim">
              Không có thành viên nào trong đội này.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

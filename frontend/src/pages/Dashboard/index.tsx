import { useState, useCallback } from 'react';
import type { CSSProperties } from 'react';

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

  const cardStyle: CSSProperties = {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,.08)',
    background: 'var(--bg2)',
    boxShadow: hover
      ? `0 18px 50px ${team.glowHover}, 0 0 0 1px ${team.glowHover} inset`
      : `0 0 30px ${team.glowColor}, 0 0 0 1px ${team.glowColor} inset`,
    transform: hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    transition: 'transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: team.topBar }} />

      {/* Avatar section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          overflow: 'hidden',
          background: `radial-gradient(circle at 50% 60%, ${team.glowHover}, transparent 70%)`,
        }}
      >
        <img
          src={member.avatar}
          alt={member.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform .5s ease',
          }}
        />

        {/* Vote count badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,.7)',
            border: '1px solid rgba(254,230,34,.3)',
            borderRadius: 10,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transform: voting ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform .3s cubic-bezier(.22,.8,.42,1)',
          }}
        >
          <span style={{ fontSize: 14 }}>🔥</span>
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 18,
              color: 'var(--gold)',
              textShadow: '0 0 12px rgba(254,230,34,.6)',
              lineHeight: 1,
            }}
          >
            {member.votes}
          </span>
        </div>

        {/* Team badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(0,0,0,.65)',
            border: `1px solid ${team.color}`,
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: team.color,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {team.name}
        </div>
      </div>

      {/* Info + Vote */}
      <div style={{ padding: '18px 18px 20px' }}>
        <h3
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 22,
            letterSpacing: '.03em',
            marginBottom: 4,
            color: 'var(--text)',
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
            marginBottom: 16,
          }}
        >
          {member.role}
        </p>

        <button
          type="button"
          onClick={handleVote}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 10,
            cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: voting ? '#050301' : 'var(--gold)',
            background: voting
              ? 'var(--gold)'
              : 'rgba(254,230,34,.08)',
            border: voting ? '1px solid var(--gold)' : '1px solid rgba(254,230,34,.25)',
            boxShadow: voting
              ? '0 0 30px rgba(254,230,34,.5)'
              : '0 0 10px rgba(254,230,34,.1)',
            transform: voting ? 'scale(0.96)' : 'scale(1)',
            transition: 'all .3s cubic-bezier(.22,.8,.42,1)',
          }}
          onMouseEnter={(e) => {
            if (!voting) {
              e.currentTarget.style.background = 'rgba(254,230,34,.15)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(254,230,34,.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!voting) {
              e.currentTarget.style.background = 'rgba(254,230,34,.08)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(254,230,34,.1)';
            }
          }}
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 68 }}>
      {/* Header */}
      <section style={{ padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="con">
          <span className="ey">Bình Chọn Thành Viên Yêu Thích</span>
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '.03em',
              lineHeight: 1.05,
              marginBottom: 10,
            }}
          >
            VOTE <span style={{ color: 'var(--gold)', textShadow: '0 0 30px rgba(254,230,34,.5)' }}>DASHBOARD</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--dim)', maxWidth: 500, margin: '0 auto' }}>
            Bình chọn cho thành viên bạn yêu thích nhất — mỗi vote là một lời cổ vũ!
          </p>

          {/* Total votes counter */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 28,
              padding: '12px 28px',
              background: 'rgba(254,230,34,.06)',
              border: '1px solid rgba(254,230,34,.2)',
              borderRadius: 14,
            }}
          >
            <span style={{ fontSize: 20 }}>🏆</span>
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 28,
                color: 'var(--gold)',
                textShadow: '0 0 16px rgba(254,230,34,.5)',
              }}
            >
              {totalVotes}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--dim)',
              }}
            >
              TỔNG VOTE
            </span>
          </div>
        </div>
      </section>

      {/* Team stats bar */}
      <section style={{ paddingBottom: 32 }}>
        <div className="con">
          <div
            className="team-stats-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
          >
            {teamStats.map((team, i) => (
              <div
                key={team.id}
                style={{
                  padding: '16px 18px',
                  background: 'var(--bg2)',
                  border: `1px solid ${i === 0 ? team.color : 'rgba(255,255,255,.06)'}`,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: i === 0 ? `0 0 24px ${team.glowColor}` : 'none',
                  transition: 'box-shadow .3s',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '.2em',
                      textTransform: 'uppercase',
                      color: team.color,
                      marginBottom: 4,
                    }}
                  >
                    {i === 0 && '👑 '}
                    {team.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 26,
                      color: 'var(--text)',
                    }}
                  >
                    {team.votes}
                    <span style={{ fontSize: 12, color: 'var(--dim)', marginLeft: 6, fontFamily: 'Montserrat' }}>
                      votes
                    </span>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: `conic-gradient(${team.color} ${(team.votes / Math.max(totalVotes, 1)) * 360}deg, rgba(255,255,255,.06) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'var(--bg2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      color: team.color,
                    }}
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
      <section style={{ paddingBottom: 40 }}>
        <div className="con">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            {/* Team filter chips */}
            <div className="filter-chips" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {teamFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    border:
                      activeFilter === f.id
                        ? `1px solid ${f.color}`
                        : '1px solid rgba(255,255,255,.1)',
                    background:
                      activeFilter === f.id ? 'rgba(254,230,34,.08)' : 'rgba(255,255,255,.03)',
                    color: activeFilter === f.id ? f.color : 'var(--dim)',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '.18em',
                    textTransform: 'uppercase',
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: 'pointer',
                    transition: 'all .25s',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort toggle */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => setSortBy('votes')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: sortBy === 'votes' ? 'rgba(254,230,34,.12)' : 'transparent',
                  color: sortBy === 'votes' ? 'var(--gold)' : 'var(--dim)',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '.14em',
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: 'pointer',
                  transition: 'all .25s',
                }}
              >
                🔥 TOP VOTE
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: sortBy === 'name' ? 'rgba(254,230,34,.12)' : 'transparent',
                  color: sortBy === 'name' ? 'var(--gold)' : 'var(--dim)',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '.14em',
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: 'pointer',
                  transition: 'all .25s',
                }}
              >
                A→Z TÊN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vote cards grid */}
      <section style={{ paddingBottom: 80 }}>
        <div className="con">
          <div
            className="vote-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}
          >
            {filtered.map((member) => (
              <VoteCard key={member.id} member={member} onVote={handleVote} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--dim)',
                fontSize: 14,
              }}
            >
              Không có thành viên nào trong đội này.
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .vote-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .team-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .vote-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .vote-grid { grid-template-columns: 1fr !important; max-width: 340px; margin: 0 auto; }
          .team-stats-grid { grid-template-columns: 1fr !important; }
          .filter-chips { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

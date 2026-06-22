import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import ScoringApi from '~/api-requests/scoring.requests';

type SubCriteria = {
  name: string;
  maxScore: number;
  plus: string;
  minus: string;
};

type Criteria = {
  id: number;
  name: string;
  maxScore: number;
  evaluator: string;
  accent: string;
  accentGlow: string;
  apiKey: 'ideaConcept' | 'choreography' | 'synchronization' | 'performance' | 'costume' | 'discipline';
  subs: SubCriteria[];
};

const criteriaData: Criteria[] = [
  {
    id: 1,
    name: 'Ý tưởng & Concept',
    maxScore: 20,
    evaluator: 'BGK',
    accent: '#FEE622',
    accentGlow: 'rgba(254,230,34,.12)',
    apiKey: 'ideaConcept',
    subs: [
      {
        name: 'Tính phù hợp với chủ đề',
        maxScore: 5,
        plus: 'Concept bám đúng chủ đề, thể hiện rõ tinh thần yêu cầu',
        minus: 'Lệch chủ đề, ý tưởng mơ hồ, không thể hiện được thông điệp',
      },
      {
        name: 'Tính sáng tạo',
        maxScore: 10,
        plus: 'Có góc nhìn mới, cách triển khai riêng, không bị trùng lặp quá nhiều',
        minus: 'Ý tưởng quá quen, dễ đoán, sao chép nhiều từ nguồn khác',
      },
      {
        name: 'Mức độ triển khai concept',
        maxScore: 5,
        plus: 'Concept được thể hiện đồng bộ qua nhạc, đội hình, động tác, outfit',
        minus: 'Chỉ có tên concept nhưng không được thể hiện trong bài',
      },
    ],
  },
  {
    id: 2,
    name: 'Choreography & Kỹ thuật biên đạo',
    maxScore: 25,
    evaluator: 'BGK',
    accent: '#FB8C05',
    accentGlow: 'rgba(251,140,5,.12)',
    apiKey: 'choreography',
    subs: [
      {
        name: 'Cấu trúc bài nhảy',
        maxScore: 5,
        plus: 'Bài có bố cục rõ, biết chia nhịp điểm rơi, build-up tốt',
        minus: 'Bài đều đều, thiếu cao trào, không có nhấn chính',
      },
      {
        name: 'Bắt nhạc',
        maxScore: 5,
        plus: 'Động tác khớp nhịp, bắt được âm thanh, nhấn rõ',
        minus: 'Lệch nhạc, bỏ nhịp, động tác không ăn vào beat',
      },
      {
        name: 'Độ khó',
        maxScore: 5,
        plus: 'Động tác có độ khó phù hợp, đa dạng, sạch sẽ',
        minus: 'Động tác đơn giản, lặp nhiều, thiếu thử thách',
      },
      {
        name: 'Chuyển động & liên kết động tác',
        maxScore: 5,
        plus: 'Chuyển động mượt, không bị gãy, nối phần tự nhiên',
        minus: 'Chuyển đoạn đứt, đứng chờ quá lâu, bị ngắt flow',
      },
      {
        name: 'Khả năng khai thác sân khấu',
        maxScore: 5,
        plus: 'Biết dùng không gian, level, layer, hướng di chuyển hợp lý',
        minus: 'Dàn đội hình hẹp, ít di chuyển, sân khấu bị "chết"',
      },
    ],
  },
  {
    id: 3,
    name: 'Đồng đều & Đội hình',
    maxScore: 20,
    evaluator: 'BGK',
    accent: '#5973B3',
    accentGlow: 'rgba(89,115,179,.12)',
    apiKey: 'synchronization',
    subs: [
      {
        name: 'Synchronization',
        maxScore: 8,
        plus: 'Đồng bộ tay/chân/nhịp tốt, nhìn team "ra một khối"',
        minus: 'Lệch timing, người nhanh người chậm, thiếu đồng đều',
      },
      {
        name: 'Đội hình & spacing',
        maxScore: 6,
        plus: 'Khoảng cách đẹp, đội hình rõ, không bị chồng chéo',
        minus: 'Dàn hàng lỗi, che nhau, spacing xấu, đứng rối',
      },
      {
        name: 'Sự phối hợp giữa các thành viên',
        maxScore: 6,
        plus: 'Chuyển formation nhịp nhàng, hỗ trợ nhau tốt',
        minus: 'Di chuyển lộn xộn, va chạm, thiếu phối hợp',
      },
    ],
  },
  {
    id: 4,
    name: 'Performance & Stage Presence',
    maxScore: 20,
    evaluator: 'BGK',
    accent: '#D04047',
    accentGlow: 'rgba(208,64,71,.12)',
    apiKey: 'performance',
    subs: [
      {
        name: 'Năng lượng biểu diễn',
        maxScore: 5,
        plus: 'Độ "ăn sân khấu" tốt, năng lượng giữ đều từ đầu đến cuối',
        minus: 'Thiếu lực, xuống năng lượng giữa bài, biểu diễn nhạt',
      },
      {
        name: 'Thần thái/biểu cảm',
        maxScore: 5,
        plus: 'Gương mặt, ánh mắt, body language phù hợp concept',
        minus: 'Căng cứng, đơ mặt, biểu cảm không khớp tiết mục',
      },
      {
        name: 'Tự tin & kiểm soát sân khấu',
        maxScore: 5,
        plus: 'Chủ động, vững, không lúng túng khi lên sân khấu',
        minus: 'Rụt rè, ngại máy quay, nhìn xuống nhiều, mất kiểm soát',
      },
      {
        name: 'Khả năng kết nối khán giả',
        maxScore: 5,
        plus: 'Tạo được điểm nhấn, kéo được sự chú ý của khán giả',
        minus: 'Không có interaction, tiết mục khó tạo cảm xúc',
      },
    ],
  },
  {
    id: 5,
    name: 'Hình ảnh – Trang phục – Đạo cụ',
    maxScore: 10,
    evaluator: 'BGK',
    accent: '#5EAF7C',
    accentGlow: 'rgba(94,175,124,.12)',
    apiKey: 'costume',
    subs: [
      {
        name: 'Phù hợp concept',
        maxScore: 4,
        plus: 'Outfit và màu sắc thể hiện rõ ý tưởng tiết mục',
        minus: 'Trang phục lệch concept, thiếu đồng bộ',
      },
      {
        name: 'Tính đồng bộ hình ảnh',
        maxScore: 3,
        plus: 'Team có visual thống nhất, nhìn vào nhận ra style riêng',
        minus: 'Mỗi người một kiểu, thiếu liên kết thị giác',
      },
      {
        name: 'Sử dụng đạo cụ / visual support',
        maxScore: 3,
        plus: 'Đạo cụ được dùng hợp lý, góp phần nâng bài',
        minus: 'Đạo cụ thừa, lạc quẻ, dùng không hiệu quả',
      },
    ],
  },
  {
    id: 6,
    name: 'Kỷ luật – Hợp tác – Tuân thủ quy định',
    maxScore: 5,
    evaluator: 'BTC',
    accent: '#d0d0d0',
    accentGlow: 'rgba(200,200,200,.1)',
    apiKey: 'discipline',
    subs: [
      {
        name: 'Đúng giờ / đúng tiến độ',
        maxScore: 2,
        plus: 'Nộp bài, rehearsal, check-in đúng deadline',
        minus: 'Trễ deadline, đến muộn, làm ảnh hưởng lịch chung',
      },
      {
        name: 'Tinh thần làm việc nhóm',
        maxScore: 2,
        plus: 'Có phân công rõ, hỗ trợ nhau, giao tiếp tốt',
        minus: 'Nội bộ lủng củng, thiếu trách nhiệm, đùn đẩy việc',
      },
      {
        name: 'Tuân thủ quy định chương trình',
        maxScore: 1,
        plus: 'Làm đúng luật, đúng format, đúng thời lượng',
        minus: 'Vi phạm thời lượng, vi phạm rule, gây ảnh hưởng BTC',
      },
    ],
  },
];

const totalMax = criteriaData.reduce((s, c) => s + c.maxScore, 0);

const thStyle: CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--orange)',
  borderBottom: '2px solid rgba(251,140,5,.3)',
  whiteSpace: 'nowrap',
};

const tdBase: CSSProperties = {
  padding: '12px 16px',
  fontSize: 13,
  color: 'var(--text)',
  borderBottom: '1px solid rgba(255,255,255,.06)',
  verticalAlign: 'top',
  lineHeight: 1.5,
};

const Scoring = () => {
  const queryClient = useQueryClient();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedJudge, setSelectedJudge] = useState<1 | 2 | 3>(1);

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedJudge(1);
  };
  const [subScores, setSubScores] = useState<Record<string, number>>({});

  const getSubKey = (catId: number, subIdx: number) => `${catId}-${subIdx}`;
  const getSubScore = (catId: number, subIdx: number) => subScores[getSubKey(catId, subIdx)] ?? 0;
  const setSubScore = (catId: number, subIdx: number, val: number, maxScore: number) => {
    setSubScores((prev) => ({
      ...prev,
      [getSubKey(catId, subIdx)]: Math.min(Math.max(0, val), maxScore),
    }));
  };
  const getCategoryTotal = (cat: Criteria) => cat.subs.reduce((sum, _, i) => sum + getSubScore(cat.id, i), 0);

  const { data: teamsRes } = useQuery({
    queryKey: ['scoring-teams'],
    queryFn: ScoringApi.getTeams,
  });

  const { data: teamScoresRes } = useQuery({
    queryKey: ['scoring-team-scores', selectedTeamId],
    queryFn: () => ScoringApi.getTeamScores(selectedTeamId!),
    enabled: !!selectedTeamId,
  });

  useEffect(() => {
    if (teamsRes?.result?.length && !selectedTeamId) {
      setSelectedTeamId(teamsRes.result[0].id);
    }
  }, [teamsRes, selectedTeamId]);

  useEffect(() => {
    if (!teamScoresRes?.result) {
      setSubScores({});
      return;
    }
    const { judgeScores: judgeRows, btcScore } = teamScoresRes.result;
    const judgeRow = judgeRows.find((r) => r.judgeNumber === selectedJudge);

    const filled: Record<string, number> = {};
    const fillSubs = (cat: Criteria, total: number) => {
      let remaining = total;
      for (let i = 0; i < cat.subs.length; i++) {
        const val = Math.min(remaining, cat.subs[i].maxScore);
        filled[getSubKey(cat.id, i)] = Math.round(val * 100) / 100;
        remaining = Math.round((remaining - val) * 100) / 100;
      }
    };

    for (let i = 0; i < 5; i++) {
      const cat = criteriaData[i];
      const val = judgeRow ? Number((judgeRow as Record<string, unknown>)[cat.apiKey] ?? 0) : 0;
      fillSubs(cat, val);
    }
    const disciplineVal = btcScore ? Number(btcScore.discipline) : 0;
    fillSubs(criteriaData[5], disciplineVal);

    setSubScores(filled);
  }, [teamScoresRes, selectedJudge]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAllScores = async () => {
    if (!selectedTeamId) return toast.error('Chọn đội trước!');
    setIsSaving(true);
    try {
      await Promise.all([
        ScoringApi.saveJudgeScores({
          teamId: selectedTeamId,
          data: {
            judgeNumber: selectedJudge,
            ideaConcept: getCategoryTotal(criteriaData[0]),
            choreography: getCategoryTotal(criteriaData[1]),
            synchronization: getCategoryTotal(criteriaData[2]),
            performance: getCategoryTotal(criteriaData[3]),
            costume: getCategoryTotal(criteriaData[4]),
          },
        }),
        ScoringApi.saveBtcScore({ teamId: selectedTeamId, data: { discipline: getCategoryTotal(criteriaData[5]) } }),
      ]);
      queryClient.invalidateQueries({ queryKey: ['scoring-teams'] });
      queryClient.invalidateQueries({ queryKey: ['scoring-team-scores', selectedTeamId] });
      toast.success('Lưu điểm thành công!');
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra!',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const grandTotal = criteriaData.reduce((sum, cat) => sum + getCategoryTotal(cat), 0);

  const teams = teamsRes?.result ?? [];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      {/* Header */}
      <section style={{ paddingBottom: 48 }}>
        <div className="con" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 40,
                height: 1,
                background: 'linear-gradient(90deg, transparent, var(--orange))',
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '.4em',
                textTransform: 'uppercase',
                color: 'var(--orange)',
              }}
            >
              SCORING PANEL
            </span>
            <span
              style={{
                width: 40,
                height: 1,
                background: 'linear-gradient(90deg, var(--orange), transparent)',
              }}
            />
          </div>
          <h1 className="st" style={{ marginBottom: 12 }}>
            TIÊU CHÍ <em>ĐÁNH GIÁ</em>
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: 14, maxWidth: 600, margin: '0 auto' }}>
            Bảng tiêu chí đánh giá onsite — Tổng điểm tối đa: {totalMax} điểm
          </p>
        </div>
      </section>

      {/* Selectors */}
      <section style={{ paddingBottom: 32 }}>
        <div className="con">
          {/* Team selector */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>
              Chọn đội
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: selectedTeamId === team.id ? team.color : 'rgba(255,255,255,.15)',
                    background: selectedTeamId === team.id ? `${team.color}22` : 'transparent',
                    color: selectedTeamId === team.id ? team.color : 'var(--dim)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {team.name}
                </button>
              ))}
              {teams.length === 0 && (
                <span style={{ fontSize: 13, color: 'var(--dim)' }}>Đang tải danh sách đội...</span>
              )}
            </div>
          </div>

          {/* Judge selector */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8 }}>
              Chọn BGK
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedJudge(n)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: selectedJudge === n ? 'var(--orange)' : 'rgba(255,255,255,.15)',
                    background: selectedJudge === n ? 'rgba(251,140,5,.15)' : 'transparent',
                    color: selectedJudge === n ? 'var(--orange)' : 'var(--dim)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  BGK {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section style={{ paddingBottom: 80 }}>
        <div className="con">
          <div
            className="scoring-table-wrap"
            style={{
              overflowX: 'auto',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,.08)',
              background: 'var(--bg2)',
              boxShadow: '0 8px 40px rgba(0,0,0,.5)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1050 }}>
              <thead>
                <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                  <th style={{ ...thStyle, width: '16%' }}>Điểm lớn</th>
                  <th style={{ ...thStyle, width: '5%', textAlign: 'center' }}>Tối đa</th>
                  <th style={{ ...thStyle, width: '14%' }}>Điểm con</th>
                  <th style={{ ...thStyle, width: '5%', textAlign: 'center' }}>Tối đa</th>
                  <th style={{ ...thStyle, width: '20%' }}>Cộng điểm khi…</th>
                  <th style={{ ...thStyle, width: '20%' }}>Trừ điểm khi…</th>
                  <th style={{ ...thStyle, width: '8%', textAlign: 'center' }}>Chấm điểm</th>
                  <th style={{ ...thStyle, width: '7%', textAlign: 'center' }}>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {criteriaData.map((cat) =>
                  cat.subs.map((sub, subIdx) => {
                    const key = `${cat.id}-${subIdx}`;
                    const isFirstRow = subIdx === 0;
                    const catBorderColor = `${cat.accent}26`;

                    return (
                      <tr
                        key={key}
                        style={{ transition: 'background .2s' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            cat.accentGlow.replace(/[\d.]+\)$/, '0.04)');
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                        }}
                      >
                        {isFirstRow && (
                          <>
                            <td
                              rowSpan={cat.subs.length}
                              style={{
                                ...tdBase,
                                fontFamily: "'Anton', sans-serif",
                                fontSize: 16,
                                letterSpacing: '.03em',
                                color: cat.accent,
                                background: cat.accentGlow,
                                borderBottom: `1px solid ${catBorderColor}`,
                                borderLeft: `3px solid ${cat.accent}`,
                              }}
                            >
                              {cat.id}. {cat.name}
                              <div style={{ marginTop: 8 }}>
                                <span
                                  style={{
                                    fontFamily: "'Anton', sans-serif",
                                    fontSize: 20,
                                    color: getCategoryTotal(cat) > 0 ? cat.accent : 'var(--dim)',
                                    textShadow: getCategoryTotal(cat) > 0 ? `0 0 10px ${cat.accent}44` : 'none',
                                  }}
                                >
                                  {getCategoryTotal(cat).toFixed(2)}
                                </span>
                                <span style={{ fontSize: 11, color: 'var(--dim)' }}> / {cat.maxScore}</span>
                              </div>
                            </td>
                            <td
                              rowSpan={cat.subs.length}
                              style={{
                                ...tdBase,
                                fontFamily: "'Anton', sans-serif",
                                fontSize: 20,
                                textAlign: 'center',
                                color: cat.accent,
                                textShadow: `0 0 14px ${cat.accent}66`,
                                background: cat.accentGlow,
                                borderBottom: `1px solid ${catBorderColor}`,
                              }}
                            >
                              {cat.maxScore}
                            </td>
                          </>
                        )}
                        <td
                          style={{
                            ...tdBase,
                            fontWeight: 600,
                            color: 'var(--text)',
                          }}
                        >
                          {sub.name}
                        </td>
                        <td
                          style={{
                            ...tdBase,
                            fontFamily: "'Anton', sans-serif",
                            fontSize: 16,
                            textAlign: 'center',
                            color: 'var(--dim)',
                          }}
                        >
                          {sub.maxScore}
                        </td>
                        <td style={{ ...tdBase, fontSize: 12, color: '#5EAF7C' }}>
                          <span style={{ opacity: 0.85 }}>＋</span> {sub.plus}
                        </td>
                        <td style={{ ...tdBase, fontSize: 12, color: '#D04047' }}>
                          <span style={{ opacity: 0.85 }}>−</span> {sub.minus}
                        </td>
                        <td style={{ ...tdBase, textAlign: 'center', verticalAlign: 'middle' }}>
                          {(() => {
                            const subVal = getSubScore(cat.id, subIdx);
                            const hasSub = subVal > 0;
                            return (
                              <input
                                type="number"
                                min={0}
                                max={sub.maxScore}
                                step={0.5}
                                value={subVal || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) setSubScore(cat.id, subIdx, val, sub.maxScore);
                                  else if (e.target.value === '') setSubScore(cat.id, subIdx, 0, sub.maxScore);
                                }}
                                placeholder={`/${sub.maxScore}`}
                                style={{
                                  width: 64,
                                  padding: '8px 6px',
                                  borderRadius: 8,
                                  border: `1px solid ${hasSub ? `${cat.accent}66` : 'rgba(255,255,255,.12)'}`,
                                  background: hasSub ? `${cat.accent}0D` : 'rgba(255,255,255,.04)',
                                  color: hasSub ? cat.accent : 'var(--dim)',
                                  fontFamily: "'Anton', sans-serif",
                                  fontSize: 18,
                                  textAlign: 'center',
                                  outline: 'none',
                                  transition: 'border-color .2s, background .2s, box-shadow .2s',
                                  boxShadow: hasSub ? `0 0 12px ${cat.accent}1A` : 'none',
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = cat.accent;
                                  e.target.style.boxShadow = `0 0 16px ${cat.accent}33`;
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = hasSub ? `${cat.accent}66` : 'rgba(255,255,255,.12)';
                                  e.target.style.boxShadow = hasSub ? `0 0 12px ${cat.accent}1A` : 'none';
                                }}
                              />
                            );
                          })()}
                        </td>
                        {isFirstRow && (
                          <td
                            rowSpan={cat.subs.length}
                            style={{
                              ...tdBase,
                              fontSize: 11,
                              fontWeight: 700,
                              textAlign: 'center',
                              textTransform: 'uppercase',
                              letterSpacing: '.12em',
                              verticalAlign: 'middle',
                              background: cat.accentGlow,
                              borderBottom: `1px solid ${catBorderColor}`,
                            }}
                          >
                            {cat.evaluator === 'BTC' ? (
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 6,
                                  background: 'rgba(251,140,5,.1)',
                                  border: '1px solid rgba(251,140,5,.25)',
                                  color: 'var(--orange)',
                                }}
                              >
                                BTC
                              </span>
                            ) : (
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 6,
                                  background: 'rgba(254,230,34,.08)',
                                  border: '1px solid rgba(254,230,34,.2)',
                                  color: 'var(--gold)',
                                }}
                              >
                                BGK
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  }),
                )}
                {/* Category subtotals */}
                <tr
                  style={{
                    background: 'rgba(254,230,34,.05)',
                    borderTop: '2px solid rgba(254,230,34,.2)',
                  }}
                >
                  <td
                    style={{
                      ...tdBase,
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 14,
                      color: 'var(--dim)',
                      borderBottom: '1px solid rgba(254,230,34,.15)',
                      paddingTop: 16,
                      paddingBottom: 16,
                    }}
                  >
                    ĐIỂM TỪNG MỤC
                  </td>
                  <td style={{ ...tdBase, borderBottom: '1px solid rgba(254,230,34,.15)' }} />
                  <td
                    colSpan={5}
                    style={{
                      ...tdBase,
                      borderBottom: '1px solid rgba(254,230,34,.15)',
                      paddingTop: 14,
                      paddingBottom: 14,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {criteriaData.map((cat) => (
                        <div
                          key={cat.id}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 8,
                            background: cat.accentGlow,
                            border: `1px solid ${cat.accent}33`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 11, color: cat.accent, fontWeight: 700 }}>{cat.id}.</span>
                          <span
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              fontSize: 18,
                              color: cat.accent,
                              textShadow: `0 0 10px ${cat.accent}44`,
                            }}
                          >
                            {getCategoryTotal(cat).toFixed(2)}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--dim)' }}>/ {cat.maxScore}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ ...tdBase, borderBottom: '1px solid rgba(254,230,34,.15)' }} />
                </tr>
                {/* Grand total */}
                <tr style={{ background: 'rgba(254,230,34,.06)' }}>
                  <td
                    style={{
                      ...tdBase,
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 22,
                      color: 'var(--gold)',
                      borderBottom: 'none',
                      textTransform: 'uppercase',
                      borderLeft: '3px solid var(--gold)',
                    }}
                  >
                    Tổng cộng
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 24,
                      textAlign: 'center',
                      color: 'var(--gold)',
                      textShadow: '0 0 20px rgba(254,230,34,.6)',
                      borderBottom: 'none',
                    }}
                  >
                    {totalMax}
                  </td>
                  <td colSpan={4} style={{ ...tdBase, borderBottom: 'none' }} />
                  <td
                    style={{
                      ...tdBase,
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 26,
                      textAlign: 'center',
                      borderBottom: 'none',
                      color: grandTotal > 0 ? 'var(--gold)' : 'var(--dim)',
                      textShadow: grandTotal > 0 ? '0 0 24px rgba(254,230,34,.6)' : 'none',
                    }}
                  >
                    {grandTotal.toFixed(2)}
                  </td>
                  <td style={{ ...tdBase, borderBottom: 'none' }} />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              onClick={handleSaveAllScores}
              disabled={!selectedTeamId || isSaving}
              style={{
                padding: '12px 32px',
                borderRadius: 10,
                border: '1px solid rgba(254,230,34,.4)',
                background: selectedTeamId ? 'rgba(254,230,34,.12)' : 'rgba(255,255,255,.04)',
                color: selectedTeamId ? 'var(--gold)' : 'var(--dim)',
                fontFamily: "'Anton', sans-serif",
                fontSize: 15,
                letterSpacing: '.1em',
                cursor: selectedTeamId ? 'pointer' : 'not-allowed',
                opacity: selectedTeamId ? 1 : 0.6,
                transition: 'all .2s',
              }}
            >
              {isSaving ? 'Đang lưu...' : 'LƯU ĐIỂM'}
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .scoring-table-wrap::-webkit-scrollbar { height: 6px; }
        .scoring-table-wrap::-webkit-scrollbar-track { background: rgba(255,255,255,.03); }
        .scoring-table-wrap::-webkit-scrollbar-thumb { background: rgba(254,230,34,.2); border-radius: 3px; }
        .scoring-table-wrap input[type="number"]::-webkit-outer-spin-button,
        .scoring-table-wrap input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .scoring-table-wrap input[type="number"] { -moz-appearance: textfield; }
        @media (max-width: 768px) {
          .con { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default Scoring;

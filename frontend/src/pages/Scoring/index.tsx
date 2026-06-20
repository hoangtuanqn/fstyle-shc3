import { useState, useMemo } from 'react';

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

const Scoring = () => {
  const [scores, setScores] = useState<Record<string, number | ''>>(() => {
    const init: Record<string, number | ''> = {};
    criteriaData.forEach((cat) => {
      cat.subs.forEach((_, subIdx) => {
        init[`${cat.id}-${subIdx}`] = '';
      });
    });
    return init;
  });

  const handleScoreChange = (key: string, value: string, max: number) => {
    if (value === '') {
      setScores((prev) => ({ ...prev, [key]: '' }));
      return;
    }
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setScores((prev) => ({ ...prev, [key]: Math.min(Math.max(0, num), max) }));
  };

  const categoryTotals = useMemo(() => {
    const map: Record<number, number> = {};
    criteriaData.forEach((cat) => {
      map[cat.id] = cat.subs.reduce((sum, _, i) => {
        const v = scores[`${cat.id}-${i}`];
        return sum + (typeof v === 'number' ? v : 0);
      }, 0);
    });
    return map;
  }, [scores]);

  const grandTotal = useMemo(
    () => Object.values(categoryTotals).reduce((s, v) => s + v, 0),
    [categoryTotals],
  );

  return (
    <div className="min-h-screen pt-[108px]">
      {/* Header */}
      <section className="pb-12">
        <div className="con text-center">
          <span className="ey">🔥 Heatwave SHC3 Apocalypse</span>
          <h1 className="st mb-3">
            TIÊU CHÍ <em className="st-em">ĐÁNH GIÁ</em>
          </h1>
          <p className="text-dim text-[14px] max-w-[600px] mx-auto">
            Bảng tiêu chí đánh giá onsite — Tổng điểm tối đa: {totalMax} điểm
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="pb-20">
        <div className="con">
          <div className="scrollbar-gold overflow-x-auto rounded-2xl border border-[rgba(255,255,255,.08)] bg-bg2 shadow-[0_8px_40px_rgba(0,0,0,.5)]">
            <table className="w-full border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-[rgba(251,140,5,.06)]">
                  <th className="px-4 py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[16%]">
                    Điểm lớn
                  </th>
                  <th className="px-4 py-3.5 text-center font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[5%]">
                    Tối đa
                  </th>
                  <th className="px-4 py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[14%]">
                    Điểm con
                  </th>
                  <th className="px-4 py-3.5 text-center font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[5%]">
                    Tối đa
                  </th>
                  <th className="px-4 py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[20%]">
                    Cộng điểm khi…
                  </th>
                  <th className="px-4 py-3.5 text-left font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[20%]">
                    Trừ điểm khi…
                  </th>
                  <th className="px-4 py-3.5 text-center font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[8%]">
                    Chấm điểm
                  </th>
                  <th className="px-4 py-3.5 text-center font-[800] text-[11px] tracking-[.14em] uppercase text-orange border-b-2 border-[rgba(251,140,5,.3)] whitespace-nowrap w-[7%]">
                    Đánh giá
                  </th>
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
                        className="transition-colors duration-200"
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
                              className="px-4 py-3 font-anton text-[16px] tracking-[.03em] align-top leading-[1.5]"
                              style={{
                                color: cat.accent,
                                background: cat.accentGlow,
                                borderBottom: `1px solid ${catBorderColor}`,
                                borderLeft: `3px solid ${cat.accent}`,
                              }}
                            >
                              {cat.id}. {cat.name}
                            </td>
                            <td
                              rowSpan={cat.subs.length}
                              className="px-4 py-3 font-anton text-[20px] text-center align-top leading-[1.5]"
                              style={{
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
                        <td className="px-4 py-3 text-[13px] text-text border-b border-[rgba(255,255,255,.06)] align-top leading-[1.5] font-semibold">
                          {sub.name}
                        </td>
                        <td className="px-4 py-3 font-anton text-[16px] text-center text-dim border-b border-[rgba(255,255,255,.06)] align-top leading-[1.5]">
                          {sub.maxScore}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#5EAF7C] border-b border-[rgba(255,255,255,.06)] align-top leading-[1.5]">
                          <span className="opacity-85">＋</span> {sub.plus}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#D04047] border-b border-[rgba(255,255,255,.06)] align-top leading-[1.5]">
                          <span className="opacity-85">−</span> {sub.minus}
                        </td>
                        <td className="px-4 py-3 text-center align-middle border-b border-[rgba(255,255,255,.06)]">
                          <input
                            type="number"
                            min={0}
                            max={sub.maxScore}
                            step={0.5}
                            value={scores[key]}
                            onChange={(e) => handleScoreChange(key, e.target.value, sub.maxScore)}
                            placeholder={`/${sub.maxScore}`}
                            className="no-spinner w-16 px-1.5 py-2 rounded-lg font-anton text-[18px] text-center outline-none transition-[border-color,background,box-shadow] duration-200"
                            style={{
                              border: `1px solid ${scores[key] !== '' ? `${cat.accent}66` : 'rgba(255,255,255,.12)'}`,
                              background: scores[key] !== '' ? `${cat.accent}0D` : 'rgba(255,255,255,.04)',
                              color: scores[key] !== '' ? cat.accent : 'var(--color-dim)',
                              boxShadow: scores[key] !== '' ? `0 0 12px ${cat.accent}1A` : 'none',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = cat.accent;
                              e.target.style.boxShadow = `0 0 16px ${cat.accent}33`;
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor =
                                scores[key] !== '' ? `${cat.accent}66` : 'rgba(255,255,255,.12)';
                              e.target.style.boxShadow =
                                scores[key] !== '' ? `0 0 12px ${cat.accent}1A` : 'none';
                            }}
                          />
                        </td>
                        {isFirstRow && (
                          <td
                            rowSpan={cat.subs.length}
                            className="px-4 py-3 text-[11px] font-bold text-center uppercase tracking-[.12em] align-middle leading-[1.5]"
                            style={{
                              background: cat.accentGlow,
                              borderBottom: `1px solid ${catBorderColor}`,
                            }}
                          >
                            {cat.evaluator === 'BTC' ? (
                              <span className="px-2.5 py-1 rounded-md bg-[rgba(251,140,5,.1)] border border-[rgba(251,140,5,.25)] text-orange">
                                BTC
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md bg-[rgba(254,230,34,.08)] border border-[rgba(254,230,34,.2)] text-gold">
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
                <tr className="bg-[rgba(254,230,34,.05)] border-t-2 border-t-[rgba(254,230,34,.2)]">
                  <td className="px-4 py-4 font-anton text-[14px] text-dim border-b border-b-[rgba(254,230,34,.15)] align-top leading-[1.5]">
                    ĐIỂM TỪNG MỤC
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text border-b border-b-[rgba(254,230,34,.15)] align-top leading-[1.5]" />
                  <td
                    colSpan={5}
                    className="px-4 py-3.5 border-b border-b-[rgba(254,230,34,.15)] align-top leading-[1.5]"
                  >
                    <div className="flex gap-2.5 flex-wrap">
                      {criteriaData.map((cat) => (
                        <div
                          key={cat.id}
                          className="px-3.5 py-1.5 rounded-lg flex items-center gap-2"
                          style={{
                            background: cat.accentGlow,
                            border: `1px solid ${cat.accent}33`,
                          }}
                        >
                          <span className="text-[11px] font-bold" style={{ color: cat.accent }}>
                            {cat.id}.
                          </span>
                          <span
                            className="font-anton text-[18px]"
                            style={{
                              color: cat.accent,
                              textShadow: `0 0 10px ${cat.accent}44`,
                            }}
                          >
                            {categoryTotals[cat.id]}
                          </span>
                          <span className="text-[11px] text-dim">/ {cat.maxScore}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text border-b border-b-[rgba(254,230,34,.15)] align-top leading-[1.5]" />
                </tr>
                {/* Grand total */}
                <tr className="bg-[rgba(254,230,34,.06)]">
                  <td className="px-4 py-3 font-anton text-[22px] text-gold border-b-0 uppercase border-l-[3px] border-l-gold align-top leading-[1.5]">
                    Tổng cộng
                  </td>
                  <td className="px-4 py-3 font-anton text-[24px] text-center text-gold [text-shadow:0_0_20px_rgba(254,230,34,.6)] border-b-0 align-top leading-[1.5]">
                    {totalMax}
                  </td>
                  <td colSpan={4} className="px-4 py-3 text-[13px] text-text border-b-0 align-top leading-[1.5]" />
                  <td
                    className="px-4 py-3 font-anton text-[26px] text-center border-b-0 align-top leading-[1.5]"
                    style={{
                      color: grandTotal > 0 ? 'var(--color-gold)' : 'var(--color-dim)',
                      textShadow: grandTotal > 0 ? '0 0 24px rgba(254,230,34,.6)' : 'none',
                    }}
                  >
                    {grandTotal}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text border-b-0 align-top leading-[1.5]" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scoring;

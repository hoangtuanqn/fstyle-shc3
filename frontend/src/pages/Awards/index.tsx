import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import AwardApi from '~/api-requests/award.requests';
import { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';
import useSocket from '~/hooks/useSocket';

import type { CSSProperties } from 'react';
import type { AwardType, AwardWinner } from '~/types/award';

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

const disabledInputStyle: CSSProperties = {
  ...inputStyle,
  opacity: 0.4,
  cursor: 'not-allowed',
};

const canEdit = (role: string, displayOrder: number): boolean => {
  if (role === RoleType.ADMIN) return true;
  if (role === RoleType.BTC_FSTYLE) return displayOrder >= 4 && displayOrder <= 8;
  return false;
};

const Awards = () => {
  useSocket();

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userRole = user?.role ?? '';

  const { data: awardsRes, isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: AwardApi.getAll,
  });
  const awards = awardsRes?.result ?? [];

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const getDraft = (awardId: string, slot: number, winners: AwardWinner[]) => {
    const key = `${awardId}-${slot}`;
    if (drafts[key] !== undefined) return drafts[key];
    const existing = winners.find((w) => w.slot === slot);
    return existing?.winnerName ?? '';
  };

  const setDraft = (awardId: string, slot: number, value: string) => {
    setDrafts((prev) => ({ ...prev, [`${awardId}-${slot}`]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: AwardApi.updateAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      toast.success('Đã cập nhật giải thưởng!');
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra!',
      );
    },
  });

  const autoCalcMutation = useMutation({
    mutationFn: AwardApi.autoCalculate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      toast.success('Tính giải tự động thành công!');
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra!',
      );
    },
  });

  const handleSaveAward = (award: AwardType) => {
    const winners: AwardWinner[] = [];
    for (let slot = 1; slot <= award.quantity; slot++) {
      const name = getDraft(award.id, slot, award.winners).trim();
      if (name) {
        winners.push({ slot, winnerTeamId: null, winnerUserId: null, winnerName: name });
      }
    }
    if (winners.length === 0) {
      toast.error('Cần nhập ít nhất 1 người/đội nhận giải!');
      return;
    }
    updateMutation.mutate({ awardId: award.id, data: { winners } });
  };

  const autoAwards = awards.filter((a) => a.type === 'AUTO');
  const manualAwards = awards.filter((a) => a.type === 'MANUAL');

  const renderWinnerInputs = (award: AwardType) => {
    const editable = canEdit(userRole, award.displayOrder);
    const slots = Array.from({ length: award.quantity }, (_, i) => i + 1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {slots.map((slot) => (
          <input
            key={slot}
            type="text"
            placeholder={
              award.winnerType === 'TEAM'
                ? `Nhập tên đội${award.quantity > 1 ? ` (${slot}/${award.quantity})` : ''}...`
                : `Nhập tên${award.quantity > 1 ? ` (${slot}/${award.quantity})` : ''}...`
            }
            value={getDraft(award.id, slot, award.winners)}
            onChange={(e) => setDraft(award.id, slot, e.target.value)}
            disabled={!editable}
            style={editable ? inputStyle : disabledInputStyle}
          />
        ))}
      </div>
    );
  };

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
          {isLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--dim)', padding: '40px 0', fontSize: 14 }}>
              Đang tải danh sách giải thưởng...
            </div>
          ) : (
            <>
              {/* Manual Awards */}
              {manualAwards.length > 0 && (
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
                    🏆 GIẢI THƯỞNG
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 28 }}>
                    Nhập tên đội / cá nhân nhận giải
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {manualAwards.map((award) => (
                      <div key={award.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div
                          style={{
                            minWidth: 160,
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--text)',
                            paddingTop: 10,
                          }}
                        >
                          {award.name}
                          {award.quantity > 1 && (
                            <span style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>
                              {' '}
                              ×{award.quantity}
                            </span>
                          )}
                          {award.prize && (
                            <div style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>{award.prize}</div>
                          )}
                        </div>
                        {renderWinnerInputs(award)}
                        {canEdit(userRole, award.displayOrder) && (
                          <button
                            onClick={() => handleSaveAward(award)}
                            disabled={updateMutation.isPending}
                            style={{
                              padding: '10px 18px',
                              borderRadius: 8,
                              border: 'none',
                              background: 'var(--gold)',
                              color: '#050301',
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              marginTop: 0,
                            }}
                          >
                            Lưu
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto Awards */}
              {autoAwards.length > 0 && (
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
                    ⚡ GIẢI TỰ ĐỘNG
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 28 }}>
                    Tính toán tự động từ điểm số BGK — chỉ Admin mới có thể kích hoạt
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {autoAwards.map((award) => (
                      <div key={award.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div
                          style={{
                            minWidth: 160,
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--text)',
                            paddingTop: 4,
                          }}
                        >
                          {award.name}
                          {award.quantity > 1 && (
                            <span style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>
                              {' '}
                              ×{award.quantity}
                            </span>
                          )}
                          {award.prize && (
                            <div style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>{award.prize}</div>
                          )}
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {award.winners.length > 0 ? (
                            award.winners.map((w) => (
                              <div key={w.slot} style={{ fontSize: 14, color: 'var(--gold)' }}>
                                {award.quantity > 1 && (
                                  <span style={{ color: 'var(--dim)', fontSize: 11 }}>{w.slot}. </span>
                                )}
                                {w.winnerName}
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: 14, color: 'var(--dim)', fontStyle: 'italic' }}>Chưa tính</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                {userRole === RoleType.ADMIN && (
                  <button
                    type="button"
                    onClick={() => autoCalcMutation.mutate()}
                    disabled={autoCalcMutation.isPending}
                    style={{
                      padding: '14px 40px',
                      borderRadius: 10,
                      border: 'none',
                      background: autoCalcMutation.isPending ? 'rgba(89,115,179,.6)' : 'rgba(89,115,179,1)',
                      color: '#fff',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      cursor: autoCalcMutation.isPending ? 'not-allowed' : 'pointer',
                      transition: 'all .3s',
                      boxShadow: '0 0 20px rgba(89,115,179,.3)',
                    }}
                  >
                    {autoCalcMutation.isPending ? 'Đang tính...' : '⚡ TÍNH GIẢI TỰ ĐỘNG'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .con { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default Awards;

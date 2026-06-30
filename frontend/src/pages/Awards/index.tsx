import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import AwardApi from "~/api-requests/award.requests";
import { RoleType } from "~/constants/enums";
import useAuth from "~/hooks/useAuth";
import useSocket from "~/hooks/useSocket";
import usePageTitle from "~/hooks/usePageTitle";

import type { AwardType, AwardWinner } from "~/types/award";

// Must match BTC_FSTYLE_EDITABLE_RANGE in backend/src/services/award.service.ts
const canEdit = (role: string, displayOrder: number): boolean => {
  if (role === RoleType.ADMIN) return true;
  if (role === RoleType.BTC_FSTYLE)
    return displayOrder >= 4 && displayOrder <= 8;
  return false;
};

const Awards = () => {
  usePageTitle("Nhập Giải Thưởng");
  useSocket();

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userRole = user?.role ?? "";

  const { data: awardsRes, isLoading } = useQuery({
    queryKey: ["awards"],
    queryFn: AwardApi.getAll,
  });
  const awards = awardsRes?.result ?? [];

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const getDraft = (awardId: string, slot: number, winners: AwardWinner[]) => {
    const key = `${awardId}-${slot}`;
    if (drafts[key] !== undefined) return drafts[key];
    const existing = winners.find((w) => w.slot === slot);
    return existing?.winnerName ?? "";
  };

  const setDraft = (awardId: string, slot: number, value: string) => {
    setDrafts((prev) => ({ ...prev, [`${awardId}-${slot}`]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: AwardApi.updateAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Đã cập nhật giải thưởng!");
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Có lỗi xảy ra!",
      );
    },
  });

  const handleSaveAward = (award: AwardType) => {
    const winners: AwardWinner[] = [];
    for (let slot = 1; slot <= award.quantity; slot++) {
      const name = getDraft(award.id, slot, award.winners).trim();
      if (name) {
        winners.push({
          slot,
          winnerTeamId: null,
          winnerUserId: null,
          winnerName: name,
        });
      }
    }
    if (winners.length === 0) {
      toast.error("Cần nhập ít nhất 1 người/đội nhận giải!");
      return;
    }
    updateMutation.mutate({ awardId: award.id, data: { winners } });
  };

  const manualAwards = awards.filter(
    (a) => a.type === "MANUAL" && canEdit(userRole, a.displayOrder),
  );

  const renderWinnerInputs = (award: AwardType) => {
    const slots = Array.from({ length: award.quantity }, (_, i) => i + 1);

    return (
      <div className="flex flex-col gap-2 flex-1">
        {slots.map((slot) => (
          <input
            key={slot}
            type="text"
            placeholder={
              award.winnerType === "TEAM"
                ? `Nhập tên đội${award.quantity > 1 ? ` (${slot}/${award.quantity})` : ""}...`
                : `Nhập tên${award.quantity > 1 ? ` (${slot}/${award.quantity})` : ""}...`
            }
            value={getDraft(award.id, slot, award.winners)}
            onChange={(e) => setDraft(award.id, slot, e.target.value)}
            className="w-full py-[10px] px-[14px] rounded-[10px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] text-[var(--text)] text-[14px] outline-none transition-[border-color,box-shadow] duration-200 font-montserrat"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-[108px]">
      <section className="pb-12">
        <div className="con text-center">
          <div className="inline-flex items-center gap-[10px] mb-[18px]">
            <span className="w-10 h-px bg-[linear-gradient(90deg,transparent,var(--gold))]" />
            <span className="text-[10px] font-extrabold tracking-[.4em] uppercase text-[var(--gold)]">
              BTC PANEL
            </span>
            <span className="w-10 h-px bg-[linear-gradient(90deg,var(--gold),transparent)]" />
          </div>
          <h1 className="st mb-3">
            NHẬP <em>GIẢI THƯỞNG</em>
          </h1>
          <p className="text-[var(--dim)] text-[14px] max-w-[500px] mx-auto">
            Nhập tên đội / cá nhân cho từng hạng giải - dữ liệu sẽ hiển thị trên
            trang Leaderboard
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="con max-w-[720px] mx-auto">
          {isLoading ? (
            <div className="text-center text-[var(--dim)] py-[40px] text-[14px]">
              Đang tải danh sách giải thưởng...
            </div>
          ) : (
            <>
              {/* Manual Awards */}
              {manualAwards.length > 0 && (
                <div className="rounded-2xl border border-[rgba(254,230,34,.15)] bg-[var(--bg2)] py-8 px-7 mb-7 shadow-[0_8px_40px_rgba(0,0,0,.5)]">
                  <h2
                    className="text-[22px] tracking-[.04em] text-[var(--gold)] mb-1.5 font-anton"
                  >
                    GIẢI THƯỞNG
                  </h2>
                  <p className="text-[12px] text-[var(--dim)] mb-7">
                    Nhập tên đội / cá nhân nhận giải
                  </p>

                  <div className="flex flex-col gap-[18px]">
                    {manualAwards.map((award) => (
                      <div
                        key={award.id}
                        className="flex items-start gap-[14px]"
                      >
                        <div className="min-w-[160px] text-[13px] font-bold text-[var(--text)] pt-[10px]">
                          {award.name}
                          {award.quantity > 1 && (
                            <span className="text-[11px] text-[var(--dim)] font-normal">
                              {" "}
                              ×{award.quantity}
                            </span>
                          )}
                          {award.prize && (
                            <div className="text-[11px] text-[var(--dim)] font-normal">
                              {award.prize}
                            </div>
                          )}
                        </div>
                        {renderWinnerInputs(award)}
                        <button
                          onClick={() => handleSaveAward(award)}
                          disabled={updateMutation.isPending}
                          className="py-[10px] px-[18px] rounded-lg border-none bg-[var(--gold)] text-[#050301] text-[11px] font-extrabold cursor-pointer whitespace-nowrap font-montserrat"
                        >
                          Lưu
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

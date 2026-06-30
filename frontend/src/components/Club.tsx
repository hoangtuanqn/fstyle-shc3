const Club = () => {
  return (
    <section id="club" className="sec bg-[var(--bg)]">
      <div className="con">
        <div className="club-grid grid grid-cols-2 gap-20 items-center">
          {/* CỘT TRÁI */}
          <div className="rv">
            <img src="/assets/images/logo-chunhat.png" alt="FStyle Crew" className="h-16 mb-7 block" />
            <span className="ey">Câu Lạc Bộ</span>
            <h2 className="st mb-6">
              FStyle <em>Crew</em>
            </h2>

            <p className="text-[16px] leading-[1.85] text-[var(--dim)] mb-[18px]">
              CLB Văn hoá Nghệ thuật của Trường Đại học FPT TP. HCM, Đơn vị Tổ chức chính của Heatwave Showcase.
            </p>
            <p className="text-[16px] leading-[1.85] text-[var(--dim)]">
              Với kinh nghiệm triển khai biểu diễn, thi đấu và tổ chức sự kiện, CLB đảm nhận từ nội dung, nhân sự
              đến điều phối sân khấu, góp phần lan tỏa văn hóa nghệ thuật đường phố trong cộng đồng sinh viên.
            </p>

            <span
              className="inline-block bg-[var(--gold)] text-[var(--bg)] text-[17px] tracking-[.12em] py-[14px] px-[34px] rounded-lg shadow-[0_0_40px_rgba(254,230,34,.5),0_0_80px_rgba(254,230,34,.15)] mt-9 font-anton"
            >
              NEVER STOP TRYING !
            </span>
          </div>

          {/* CỘT PHẢI */}
          <div className="rv d2">
            <img
              src="/assets/images/nhom-nguoi-bi-an.png"
              alt="FStyle Crew"
              className="w-full block rounded-[20px] border border-[rgba(254,230,34,.15)] shadow-[0_0_60px_rgba(254,230,34,.1)]"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .club-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
};

export default Club;

const Club = () => {
  return (
    <section id="club" className="sec bg-bg">
      <div className="con">
        <div className="grid grid-cols-2 gap-20 items-center max-lg:grid-cols-1 max-lg:gap-12">
          {/* CỘT TRÁI */}
          <div className="rv">
            <img src="/assets/images/logo-chunhat.png" alt="FStyle Crew" className="h-16 mb-7 block" />
            <span className="ey">Câu Lạc Bộ</span>
            <h2 className="st mb-6">
              FStyle <em className="st-em">Crew</em>
            </h2>

            <p className="paragraph">
              FStyle Crew là câu lạc bộ vũ đạo trực thuộc FPT University HCM — nơi quy tụ những người trẻ đam mê
              chuyển động, sáng tạo và bứt phá giới hạn của bản thân.
            </p>
            <p className="paragraph">
              Từ những bước nhảy đầu tiên đến những sân khấu lớn, FStyle luôn theo đuổi tinh thần học hỏi không ngừng,
              biến mỗi buổi tập thành một hành trình trưởng thành.
            </p>
            <p className="text-[16px] leading-[1.85] text-dim">
              Heatwave Showcase là minh chứng cho ngọn lửa ấy — nơi đam mê được thắp sáng và chia sẻ với cộng đồng.
            </p>

            <span className="inline-block bg-gold text-bg font-anton text-[17px] tracking-[.12em] px-[34px] py-[14px] rounded-lg shadow-[0_0_40px_rgba(254,230,34,.5),0_0_80px_rgba(254,230,34,.15)] mt-9">
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
    </section>
  );
};

export default Club;

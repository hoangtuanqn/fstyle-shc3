import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import axios from "axios";

import AuthApi from "~/api-requests/auth.requests";
import ParticleCanvas from "~/components/ParticleCanvas";
import { RoleType } from "~/constants/enums";
import { setUser } from "~/features/userSlice";
import { useAppDispatch } from "~/hooks/useRedux";
import usePageTitle from "~/hooks/usePageTitle";
import LocalStorage from "~/utils/localStorage";

const redirectByRole: Record<string, string> = {
  [RoleType.ADMIN]: "/scoring",
  [RoleType.MC]: "/leaderboard",
  [RoleType.BTC_FSTYLE]: "/dashboard",
  [RoleType.MEMBER]: "/dashboard",
};

const Login = () => {
  usePageTitle("Đăng Nhập");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await AuthApi.login({ email, password });
      if (!data.result) {
        toast.error("Phản hồi từ server không hợp lệ!");
        return;
      }

      LocalStorage.setItem("logged_in", "true");
      dispatch(setUser(data.result));
      toast.success(data.message);
      const role = data.result.role;
      navigate(redirectByRole[role] ?? "/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-10 px-5">
      {/* Background layers */}
      <div
        className="absolute inset-0 bg-[url('/assets/images/bggg.png')] bg-[center_top] bg-cover bg-no-repeat animate-[hzoom_22s_ease-in-out_infinite_alternate] [filter:saturate(1.2)_contrast(1.05)_brightness(0.4)]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,3,1,.6)_0%,rgba(5,3,1,.85)_50%,rgba(5,3,1,.95)_100%)]"
      />
      <ParticleCanvas />

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[420px] bg-[rgba(10,7,3,0.88)] border border-[rgba(254,230,34,.18)] rounded-[16px] pt-[48px] px-[36px] pb-[40px] shadow-[0_0_80px_rgba(254,230,34,.08),0_24px_60px_rgba(0,0,0,.6)] animate-[fu_.6s_both]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/assets/images/logo-chunhat.png"
              alt="FStyle Crew"
              className="h-[69px] max-w-full inline-block mb-[18px]"
            />
          </Link>
          <h1
            className="text-[28px] tracking-[.04em] text-[var(--gold)] [text-shadow:0_0_24px_rgba(254,230,34,.4)] m-0 font-anton"
          >
            ĐĂNG NHẬP
          </h1>
          <p className="text-[12px] text-[var(--dim)] mt-2 tracking-[.04em]">
            Heatwave Showcase #3 - APOCALYPSE
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-[10px] font-extrabold tracking-[.3em] text-[var(--orange)] uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
            autoFocus
            className="w-full py-[14px] px-4 bg-[rgba(0,0,0,.5)] border border-[rgba(254,230,34,.16)] rounded-[10px] text-[var(--text)] text-[14px] outline-none [transition:border-color_.25s,box-shadow_.25s] font-montserrat"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(254,230,34,.45)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(254,230,34,.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(254,230,34,.16)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-[10px] font-extrabold tracking-[.3em] text-[var(--orange)] uppercase mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full pt-[14px] pr-[48px] pb-[14px] pl-4 bg-[rgba(0,0,0,.5)] border border-[rgba(254,230,34,.16)] rounded-[10px] text-[var(--text)] text-[14px] outline-none [transition:border-color_.25s,box-shadow_.25s] font-montserrat"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(254,230,34,.45)";
                e.currentTarget.style.boxShadow =
                  "0 0 16px rgba(254,230,34,.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(254,230,34,.16)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[14px] top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-[var(--dim)] text-[13px] font-semibold tracking-[.05em] [transition:color_.2s] font-montserrat"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--gold)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
            >
              {showPassword ? "ẨN" : "HIỆN"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-[15px] border-0 rounded-[10px] text-[13px] font-extrabold uppercase tracking-[.2em] [transition:background_.3s,transform_.15s,box-shadow_.3s] font-montserrat"
          style={{
            background: loading ? "rgba(254,230,34,.15)" : "var(--gold)",
            color: loading ? "var(--gold)" : "#050301",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 0 30px rgba(254,230,34,.3)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#ffe94a";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(254,230,34,.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "var(--gold)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(254,230,34,.3)";
            }
          }}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[12px] text-[var(--dim)] no-underline tracking-[.04em] [transition:color_.2s]"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
          >
            ← Quay về trang chủ
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-[11px] text-[rgba(242,237,224,.22)]">
          <div>© 2026 FStyle Crew · FPT University HCM</div>
          <div className="text-[rgba(242,237,224,.4)] mt-[6px]">
            Phát triển bởi{" "}
            <a
              href="https://www.facebook.com/fcodeclub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gold)] no-underline font-bold"
            >
              F-Code
            </a>{" "}
            x{" "}
            <a
              href="https://www.facebook.com/mstsoftware.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gold)] no-underline font-bold"
            >
              MST Software
            </a>
          </div>
        </div>
      </form>

      <style>{`
        input::placeholder {
          color: rgba(242, 237, 224, 0.25);
        }
      `}</style>
    </section>
  );
};

export default Login;

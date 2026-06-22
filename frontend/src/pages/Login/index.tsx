import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import axios from "axios";

import AuthApi from "~/api-requests/auth.requests";
import ParticleCanvas from "~/components/ParticleCanvas";
import { RoleType } from "~/constants/enums";
import { setUser } from "~/features/userSlice";
import { useAppDispatch } from "~/hooks/useRedux";
import LocalStorage from "~/utils/localStorage";

const redirectByRole: Record<string, string> = {
  [RoleType.ADMIN]: "/scoring",
  [RoleType.MC]: "/leaderboard",
  [RoleType.BTC_FSTYLE]: "/dashboard",
  [RoleType.MEMBER]: "/dashboard",
};

const Login = () => {
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
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "40px 20px",
      }}
    >
      {/* Background layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url('/assets/images/bggg.png') center top / cover no-repeat",
          animation: "hzoom 22s ease-in-out infinite alternate",
          filter: "saturate(1.2) contrast(1.05) brightness(0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(5,3,1,.6) 0%, rgba(5,3,1,.85) 50%, rgba(5,3,1,.95) 100%)",
        }}
      />
      <ParticleCanvas />

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
          background: "rgba(10,7,3,0.88)",
          border: "1px solid rgba(254,230,34,.18)",
          borderRadius: 16,
          padding: "48px 36px 40px",
          boxShadow:
            "0 0 80px rgba(254,230,34,.08), 0 24px 60px rgba(0,0,0,.6)",
          animation: "fu .6s both",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/">
            <img
              src="/assets/images/logo-ngang.png"
              alt="FStyle Crew"
              style={{
                height: 36,
                maxWidth: "100%",
                display: "inline-block",
                marginBottom: 18,
              }}
            />
          </Link>
          <h1
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 28,
              letterSpacing: ".04em",
              color: "var(--gold)",
              textShadow: "0 0 24px rgba(254,230,34,.4)",
              margin: 0,
            }}
          >
            ĐĂNG NHẬP
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "var(--dim)",
              marginTop: 8,
              letterSpacing: ".04em",
            }}
          >
            Heatwave Showcase #3 - APOCALYPSE
          </p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".3em",
              color: "var(--orange)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
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
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(0,0,0,.5)",
              border: "1px solid rgba(254,230,34,.16)",
              borderRadius: 10,
              color: "var(--text)",
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
              outline: "none",
              transition: "border-color .25s, box-shadow .25s",
            }}
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
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".3em",
              color: "var(--orange)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Mật khẩu
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "14px 48px 14px 16px",
                background: "rgba(0,0,0,.5)",
                border: "1px solid rgba(254,230,34,.16)",
                borderRadius: 10,
                color: "var(--text)",
                fontSize: 14,
                fontFamily: "Montserrat, sans-serif",
                outline: "none",
                transition: "border-color .25s, box-shadow .25s",
              }}
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
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--dim)",
                fontSize: 13,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                letterSpacing: ".05em",
                transition: "color .2s",
              }}
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
          style={{
            width: "100%",
            padding: "15px 0",
            background: loading ? "rgba(254,230,34,.15)" : "var(--gold)",
            border: "none",
            borderRadius: 10,
            color: loading ? "var(--gold)" : "#050301",
            fontSize: 13,
            fontWeight: 800,
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background .3s, transform .15s, box-shadow .3s",
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
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: "var(--dim)",
              textDecoration: "none",
              letterSpacing: ".04em",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
          >
            ← Quay về trang chủ
          </Link>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 11,
            color: "rgba(242,237,224,.22)",
          }}
        >
          <div>© 2026 FStyle Crew · FPT University HCM</div>
          <div style={{ color: "rgba(242,237,224,.4)", marginTop: 6 }}>
            Phát triển bởi{" "}
            <a
              href="https://www.facebook.com/fcodeclub"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              F-Code
            </a>{" "}
            x{" "}
            <a
              href="https://www.facebook.com/mstsoftware.vn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: 700,
              }}
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

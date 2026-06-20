import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';

import AuthApi from '~/api-requests/auth.requests';
import ParticleCanvas from '~/components/ParticleCanvas';
import { setUser } from '~/features/userSlice';
import { useAppDispatch } from '~/hooks/useRedux';
import LocalStorage from '~/utils/localStorage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        toast.error('Phản hồi từ server không hợp lệ!');
        return;
      }
      const { access_token, refresh_token, ...user } = data.result;

      LocalStorage.setItem('access_token', access_token);
      LocalStorage.setItem('refresh_token', refresh_token);
      LocalStorage.setItem('role', user.role);

      dispatch(setUser(user));
      toast.success(data.message);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-10">
      {/* Background layers */}
      <div className="absolute inset-0 animate-hzoom bg-[url('/assets/images/bggg.png')] bg-cover bg-top saturate-[1.2] contrast-[1.05] brightness-[0.4]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,3,1,.6)_0%,rgba(5,3,1,.85)_50%,rgba(5,3,1,.95)_100%)]" />
      <ParticleCanvas />

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[420px] animate-fu rounded-2xl border border-[rgba(254,230,34,.18)] bg-[rgba(10,7,3,0.88)] px-9 pt-12 pb-10 shadow-[0_0_80px_rgba(254,230,34,.08),0_24px_60px_rgba(0,0,0,.6)]"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/">
            <img
              src="/assets/images/logo-ngang.png"
              alt="FStyle Crew"
              className="mb-[18px] inline-block h-9 max-w-full"
            />
          </Link>
          <h1 className="font-anton text-[28px] tracking-[.04em] text-gold [text-shadow:0_0_24px_rgba(254,230,34,.4)]">
            ĐĂNG NHẬP
          </h1>
          <p className="mt-2 text-[12px] tracking-[.04em] text-dim">Heatwave Showcase #3 — APOCALYPSE</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-2 block text-[10px] font-[800] uppercase tracking-[.3em] text-orange">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
            autoFocus
            className="w-full rounded-[10px] border border-[rgba(254,230,34,.16)] bg-[rgba(0,0,0,.5)] px-4 py-[14px] font-montserrat text-[14px] text-text outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[rgba(254,230,34,.45)] focus:shadow-[0_0_16px_rgba(254,230,34,.12)]"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="mb-2 block text-[10px] font-[800] uppercase tracking-[.3em] text-orange">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-[10px] border border-[rgba(254,230,34,.16)] bg-[rgba(0,0,0,.5)] py-[14px] pr-12 pl-4 font-montserrat text-[14px] text-text outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[rgba(254,230,34,.45)] focus:shadow-[0_0_16px_rgba(254,230,34,.12)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer border-none bg-none font-montserrat text-[13px] font-semibold tracking-[.05em] text-dim transition-colors duration-200 hover:text-gold"
            >
              {showPassword ? 'ẨN' : 'HIỆN'}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-[10px] border-none py-[15px] font-montserrat text-[13px] font-[800] uppercase tracking-[.2em] transition-[background,transform,box-shadow] duration-300 ${
            loading
              ? 'cursor-not-allowed bg-[rgba(254,230,34,.15)] text-gold shadow-none'
              : 'cursor-pointer bg-gold text-[#050301] shadow-[0_0_30px_rgba(254,230,34,.3)] hover:bg-[#ffe94a] hover:-translate-y-px hover:shadow-[0_0_40px_rgba(254,230,34,.5)]'
          }`}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[12px] tracking-[.04em] text-dim no-underline transition-colors duration-200 hover:text-gold"
          >
            ← Quay về trang chủ
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-[11px] tracking-[.04em] text-dim">
          © 2026 F-Code Club · FPT University HCM
        </div>
      </form>
    </section>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';

import AuthApi from '~/api-requests/auth.requests';
import { clearUser } from '~/features/userSlice';
import { useAppDispatch } from '~/hooks/useRedux';
import useAuth from '~/hooks/useAuth';
import usePageTitle from '~/hooks/usePageTitle';

const ChangePassword = () => {
  usePageTitle('Đổi Mật Khẩu');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user && user.isFirstLogin === 0) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    try {
      const data = await AuthApi.changePassword({ newPassword, confirmPassword });
      toast.success(data.message);
      dispatch(clearUser());
      navigate('/login', { replace: true });
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 48px 14px 16px',
    background: 'rgba(0,0,0,.5)',
    border: '1px solid rgba(254,230,34,.16)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: 14,
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    transition: 'border-color .25s, box-shadow .25s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '.3em',
    color: 'var(--orange)',
    textTransform: 'uppercase',
    marginBottom: 8,
  };

  const toggleBtn: React.CSSProperties = {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--dim)',
    fontSize: 13,
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    letterSpacing: '.05em',
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '40px 20px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 420,
          background: 'rgba(10,7,3,0.95)',
          border: '1px solid rgba(254,230,34,.25)',
          borderRadius: 16,
          padding: '48px 36px 40px',
          boxShadow: '0 0 80px rgba(254,230,34,.1), 0 24px 60px rgba(0,0,0,.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(251,140,5,.12)',
              border: '1px solid rgba(251,140,5,.3)',
              marginBottom: 18,
              fontSize: 24,
            }}
          >
            🔑
          </div>
          <h1
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 26,
              letterSpacing: '.04em',
              color: 'var(--gold)',
              margin: 0,
            }}
          >
            ĐỔI MẬT KHẨU
          </h1>
          <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10, lineHeight: 1.6 }}>
            Đây là lần đầu bạn đăng nhập.
            <br />
            Vui lòng đổi mật khẩu mới trước khi tiếp tục.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Mật khẩu mới</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              required
              minLength={8}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(254,230,34,.45)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(254,230,34,.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(254,230,34,.16)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button type="button" onClick={() => setShowNew((v) => !v)} style={toggleBtn}>
              {showNew ? 'ẨN' : 'HIỆN'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Xác nhận mật khẩu</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(254,230,34,.45)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(254,230,34,.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(254,230,34,.16)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} style={toggleBtn}>
              {showConfirm ? 'ẨN' : 'HIỆN'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px 0',
            background: loading ? 'rgba(254,230,34,.15)' : 'var(--gold)',
            border: 'none',
            borderRadius: 10,
            color: loading ? 'var(--gold)' : '#050301',
            fontSize: 13,
            fontWeight: 800,
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 0 30px rgba(254,230,34,.3)',
          }}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
        </button>
      </form>
    </section>
  );
};

export default ChangePassword;

// frontend/src/pages/Members/index.tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import UserApi from '~/api-requests/user.requests';
import { RoleType } from '~/constants/enums';
import usePageTitle from '~/hooks/usePageTitle';
import type { CreateUserInput, UpdateUserInput, UserAdminType } from '~/types/user';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin (BTC F-Code)',
  BTC_FSTYLE: 'BTC FStyle',
  MC: 'MC',
  MEMBER: 'Thành viên',
};

const ROLE_OPTIONS = [
  { value: '', label: 'Tất cả role' },
  { value: 'ADMIN', label: 'Admin (BTC F-Code)' },
  { value: 'BTC_FSTYLE', label: 'BTC FStyle' },
  { value: 'MC', label: 'MC' },
  { value: 'MEMBER', label: 'Thành viên' },
];

type DialogState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; user: UserAdminType }
  | { type: 'reset'; user: UserAdminType }
  | { type: 'delete'; user: UserAdminType }
  | { type: 'created'; email: string; rawPassword: string }
  | { type: 'resetDone'; name: string; rawPassword: string };

const inputSt: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(0,0,0,.5)',
  border: '1px solid rgba(254,230,34,.2)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'Montserrat, sans-serif',
  outline: 'none',
};

const selectSt: React.CSSProperties = { ...inputSt, cursor: 'pointer' };
const labelSt: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '.2em',
  textTransform: 'uppercase',
  color: 'var(--orange)',
  marginBottom: 6,
};

function CopyBox({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <code
        style={{
          flex: 1,
          padding: '8px 12px',
          background: 'rgba(0,0,0,.4)',
          border: '1px solid rgba(254,230,34,.2)',
          borderRadius: 6,
          fontSize: 14,
          color: 'var(--gold)',
          fontFamily: 'monospace',
          letterSpacing: '.04em',
          userSelect: 'all',
        }}
      >
        {value}
      </code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        style={{
          padding: '8px 14px',
          background: copied ? 'rgba(94,175,124,.15)' : 'rgba(254,230,34,.08)',
          border: `1px solid ${copied ? 'rgba(94,175,124,.4)' : 'rgba(254,230,34,.3)'}`,
          borderRadius: 6,
          color: copied ? '#5EAF7C' : 'var(--gold)',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all .2s',
        }}
      >
        {copied ? '✓ Đã copy' : 'Copy'}
      </button>
    </div>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0,0,0,.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(10,7,3,0.98)',
          border: '1px solid rgba(254,230,34,.2)',
          borderRadius: 14,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: 20, letterSpacing: '.04em', color: 'var(--gold)', margin: 0 }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Members = () => {
  usePageTitle('Quản lý thành viên');
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });

  // Form state for create/edit
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<RoleType>(RoleType.MEMBER);
  const [formTeamId, setFormTeamId] = useState('');

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['admin-users', searchText, filterRole, filterTeam],
    queryFn: () => UserApi.getAll({ search: searchText || undefined, role: filterRole || undefined, teamId: filterTeam || undefined }),
  });

  const { data: teamsRes } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: UserApi.getTeams,
    staleTime: Infinity,
  });

  const userList = usersRes?.result ?? [];
  const teamList = teamsRes?.result ?? [];

  const teamOptions = [{ id: '', name: 'Tất cả team' }, ...teamList];

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateUserInput) => UserApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDialog({ type: 'created', email: data.result.user!.email, rawPassword: data.result.rawPassword });
    },
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => UserApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Cập nhật thành công!');
      setDialog({ type: 'none' });
    },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Đã xóa tài khoản!');
      setDialog({ type: 'none' });
    },
    onError: handleError,
  });

  const resetMutation = useMutation({
    mutationFn: (id: string) => UserApi.resetPassword(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      const user = userList.find((u) => u.id === id);
      setDialog({ type: 'resetDone', name: user?.name ?? '', rawPassword: data.result.rawPassword });
    },
    onError: handleError,
  });

  const openCreate = () => {
    setFormName(''); setFormEmail(''); setFormRole(RoleType.MEMBER); setFormTeamId(teamList[0]?.id ?? '');
    setDialog({ type: 'create' });
  };

  const openEdit = (user: UserAdminType) => {
    setFormName(user.name); setFormEmail(user.email); setFormRole(user.role); setFormTeamId(user.teamId ?? '');
    setDialog({ type: 'edit', user });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: formName,
      email: formEmail,
      role: formRole,
      teamId: formRole === RoleType.MEMBER ? formTeamId || null : null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dialog.type !== 'edit') return;
    updateMutation.mutate({
      id: dialog.user.id,
      data: {
        name: formName,
        email: formEmail,
        role: formRole,
        teamId: formRole === RoleType.MEMBER ? formTeamId || null : null,
      },
    });
  };

  const UserForm = ({ onSubmit, isPending }: { onSubmit: (e: React.FormEvent) => void; isPending: boolean }) => (
    <form onSubmit={onSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelSt}>Tên</label>
        <input style={inputSt} value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Nguyễn Văn A" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelSt}>Email</label>
        <input style={inputSt} type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="email@gmail.com" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelSt}>Role</label>
        <select
          style={selectSt}
          value={formRole}
          onChange={(e) => { setFormRole(e.target.value as RoleType); if (e.target.value !== 'MEMBER') setFormTeamId(''); }}
        >
          {['ADMIN', 'BTC_FSTYLE', 'MC', 'MEMBER'].map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>
      {formRole === RoleType.MEMBER && (
        <div style={{ marginBottom: 20 }}>
          <label style={labelSt}>Team</label>
          <select style={selectSt} value={formTeamId} onChange={(e) => setFormTeamId(e.target.value)} required>
            <option value="">-- Chọn team --</option>
            {teamList.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          padding: '13px 0',
          background: isPending ? 'rgba(254,230,34,.15)' : 'var(--gold)',
          border: 'none',
          borderRadius: 8,
          color: isPending ? 'var(--gold)' : '#050301',
          fontSize: 12,
          fontWeight: 800,
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          cursor: isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? 'Đang xử lý...' : 'Xác nhận'}
      </button>
    </form>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 88, paddingBottom: 60 }}>
      <div className="con">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.3em', color: 'var(--orange)', textTransform: 'uppercase' }}>
              Admin Panel
            </span>
            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '.03em', margin: '4px 0 0' }}>
              QUẢN LÝ THÀNH VIÊN
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => UserApi.exportExcel()}
              style={{
                padding: '10px 18px',
                background: 'rgba(94,175,124,.1)',
                border: '1px solid rgba(94,175,124,.35)',
                borderRadius: 8,
                color: '#5EAF7C',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
              }}
            >
              ↓ Export Excel
            </button>
            <button
              type="button"
              onClick={openCreate}
              style={{
                padding: '10px 18px',
                background: 'var(--gold)',
                border: 'none',
                borderRadius: 8,
                color: '#050301',
                fontSize: 12,
                fontWeight: 800,
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
                letterSpacing: '.1em',
              }}
            >
              + Thêm tài khoản
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 20,
            padding: '14px 16px',
            background: 'var(--bg2)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: 10,
          }}
        >
          <input
            style={{ ...inputSt, flex: 1, minWidth: 180, padding: '8px 12px' }}
            placeholder="Tìm theo tên hoặc email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select style={{ ...selectSt, width: 160, padding: '8px 12px' }} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select style={{ ...selectSt, width: 160, padding: '8px 12px' }} value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
            {teamOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(254,230,34,.05)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  {['STT', 'Tên', 'Email', 'Role', 'Team', 'Trạng thái', 'Hành động'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 14px',
                        textAlign: 'left',
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '.18em',
                        textTransform: 'uppercase',
                        color: 'var(--orange)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--dim)' }}>Đang tải...</td>
                  </tr>
                ) : userList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--dim)' }}>Không có kết quả</td>
                  </tr>
                ) : (
                  userList.map((user, i) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,.05)', transition: 'background .15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 14px', color: 'var(--dim)' }}>{i + 1}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text)' }}>{user.name}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--dim)', fontSize: 12 }}>{user.email}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 5,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '.1em',
                            textTransform: 'uppercase',
                            background: user.role === 'ADMIN' ? 'rgba(208,64,71,.15)' : user.role === 'MEMBER' ? 'rgba(89,115,179,.15)' : 'rgba(251,140,5,.12)',
                            color: user.role === 'ADMIN' ? '#D04047' : user.role === 'MEMBER' ? '#5973B3' : 'var(--orange)',
                            border: `1px solid ${user.role === 'ADMIN' ? 'rgba(208,64,71,.3)' : user.role === 'MEMBER' ? 'rgba(89,115,179,.3)' : 'rgba(251,140,5,.25)'}`,
                          }}
                        >
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--dim)', fontSize: 12 }}>{user.teamName ?? '—'}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 5,
                            fontSize: 10,
                            fontWeight: 700,
                            background: user.isFirstLogin === 1 ? 'rgba(251,140,5,.12)' : 'rgba(94,175,124,.1)',
                            color: user.isFirstLogin === 1 ? 'var(--orange)' : '#5EAF7C',
                            border: `1px solid ${user.isFirstLogin === 1 ? 'rgba(251,140,5,.3)' : 'rgba(94,175,124,.3)'}`,
                          }}
                        >
                          {user.isFirstLogin === 1 ? 'Chưa đổi MK' : 'Đã kích hoạt'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            style={{ padding: '5px 10px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 5, color: 'var(--text)', fontSize: 11, cursor: 'pointer' }}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => setDialog({ type: 'reset', user })}
                            style={{ padding: '5px 10px', background: 'rgba(251,140,5,.08)', border: '1px solid rgba(251,140,5,.25)', borderRadius: 5, color: 'var(--orange)', fontSize: 11, cursor: 'pointer' }}
                          >
                            Reset MK
                          </button>
                          <button
                            type="button"
                            onClick={() => setDialog({ type: 'delete', user })}
                            style={{ padding: '5px 10px', background: 'rgba(208,64,71,.08)', border: '1px solid rgba(208,64,71,.25)', borderRadius: 5, color: '#D04047', fontSize: 11, cursor: 'pointer' }}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!isLoading && (
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.05)', fontSize: 11, color: 'var(--dim)' }}>
              {userList.length} tài khoản
            </div>
          )}
        </div>
      </div>

      {/* ── Dialogs ── */}

      {dialog.type === 'create' && (
        <Dialog title="Thêm tài khoản" onClose={() => setDialog({ type: 'none' })}>
          <UserForm onSubmit={handleCreateSubmit} isPending={createMutation.isPending} />
        </Dialog>
      )}

      {dialog.type === 'edit' && (
        <Dialog title="Sửa tài khoản" onClose={() => setDialog({ type: 'none' })}>
          <UserForm onSubmit={handleEditSubmit} isPending={updateMutation.isPending} />
        </Dialog>
      )}

      {dialog.type === 'created' && (
        <Dialog title="✓ Tạo tài khoản thành công" onClose={() => setDialog({ type: 'none' })}>
          <p style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 14 }}>
            Lưu lại thông tin đăng nhập trước khi đóng:
          </p>
          <div style={{ marginBottom: 12 }}>
            <label style={labelSt}>Email</label>
            <CopyBox value={dialog.email} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelSt}>Mật khẩu ban đầu</label>
            <CopyBox value={dialog.rawPassword} />
          </div>
          <button
            type="button"
            onClick={() => setDialog({ type: 'none' })}
            style={{ width: '100%', padding: '12px', background: 'var(--gold)', border: 'none', borderRadius: 8, color: '#050301', fontSize: 12, fontWeight: 800, cursor: 'pointer', letterSpacing: '.1em' }}
          >
            Đã lưu, đóng lại
          </button>
        </Dialog>
      )}

      {dialog.type === 'reset' && (
        <Dialog title="Reset mật khẩu" onClose={() => setDialog({ type: 'none' })}>
          <p style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 20 }}>
            Xác nhận reset mật khẩu cho <strong style={{ color: 'var(--text)' }}>{dialog.user.name}</strong>?
            <br />
            <span style={{ color: 'var(--orange)', fontSize: 12 }}>Tài khoản sẽ bị yêu cầu đổi mật khẩu ở lần đăng nhập tiếp theo.</span>
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setDialog({ type: 'none' })}
              style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: 'var(--dim)', fontSize: 12, cursor: 'pointer' }}
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={resetMutation.isPending}
              onClick={() => resetMutation.mutate(dialog.user.id)}
              style={{ flex: 1, padding: '12px', background: 'rgba(251,140,5,.9)', border: 'none', borderRadius: 8, color: '#050301', fontSize: 12, fontWeight: 800, cursor: resetMutation.isPending ? 'not-allowed' : 'pointer' }}
            >
              {resetMutation.isPending ? '...' : 'Xác nhận reset'}
            </button>
          </div>
        </Dialog>
      )}

      {dialog.type === 'resetDone' && (
        <Dialog title="✓ Reset thành công" onClose={() => setDialog({ type: 'none' })}>
          <p style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 14 }}>
            Mật khẩu mới của <strong style={{ color: 'var(--text)' }}>{dialog.name}</strong>:
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={labelSt}>Mật khẩu mới</label>
            <CopyBox value={dialog.rawPassword} />
          </div>
          <button
            type="button"
            onClick={() => setDialog({ type: 'none' })}
            style={{ width: '100%', padding: '12px', background: 'var(--gold)', border: 'none', borderRadius: 8, color: '#050301', fontSize: 12, fontWeight: 800, cursor: 'pointer', letterSpacing: '.1em' }}
          >
            Đã lưu, đóng lại
          </button>
        </Dialog>
      )}

      {dialog.type === 'delete' && (
        <Dialog title="Xóa tài khoản" onClose={() => setDialog({ type: 'none' })}>
          <p style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 20 }}>
            Xác nhận xóa tài khoản <strong style={{ color: '#D04047' }}>{dialog.user.name}</strong>?
            <br />
            <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12 }}>Hành động này không thể hoàn tác.</span>
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setDialog({ type: 'none' })}
              style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: 'var(--dim)', fontSize: 12, cursor: 'pointer' }}
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(dialog.user.id)}
              style={{ flex: 1, padding: '12px', background: '#D04047', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 800, cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer' }}
            >
              {deleteMutation.isPending ? '...' : 'Xóa'}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Members;

import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

import type { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';
import LocalStorage from '~/utils/localStorage';

type ProtectedRouteProps = {
  roleAccess?: RoleType[];
};

const ProtectedRoute = ({ roleAccess }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated, fetchUser } = useAuth();

  const hasToken = !!LocalStorage.getItem('logged_in');

  useEffect(() => {
    if (hasToken && !isAuthenticated) {
      fetchUser();
    }
  }, [hasToken, isAuthenticated, fetchUser]);

  if (isLoading && hasToken) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--gold)',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 14,
          letterSpacing: '.1em',
        }}
      >
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isFirstLogin === 1) {
    return <Navigate to="/change-password" replace />;
  }

  if (roleAccess && user && !roleAccess.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

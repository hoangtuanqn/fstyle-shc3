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
        className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--gold)] text-[14px] tracking-[.1em] font-montserrat"
      >
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roleAccess && user && !roleAccess.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

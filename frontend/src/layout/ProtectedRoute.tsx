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

  const hasToken = !!LocalStorage.getItem('access_token');

  useEffect(() => {
    if (hasToken && !isAuthenticated && !isLoading) {
      fetchUser();
    }
  }, [hasToken, isAuthenticated, isLoading, fetchUser]);

  if (isLoading && hasToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg text-gold font-montserrat text-sm tracking-[.1em]">
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

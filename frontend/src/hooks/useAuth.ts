import { useCallback } from 'react';

import AuthApi from '~/api-requests/auth.requests';
import { clearUser, getInfo } from '~/features/userSlice';
import { useAppDispatch, useAppSelector } from '~/hooks/useRedux';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.user);

  const fetchUser = useCallback(() => dispatch(getInfo()), [dispatch]);

  const logout = useCallback(async () => {
    try {
      await AuthApi.logout();
    } catch {
      // Still clear locally even if API call fails
    }
    dispatch(clearUser());
  }, [dispatch]);

  return { user, isLoading, isAuthenticated, fetchUser, logout };
};

export default useAuth;

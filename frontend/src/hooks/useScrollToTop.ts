import { useEffect } from 'react';
import { useLocation } from 'react-router';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: pathname === '/' ? 'smooth' : 'instant' });
  }, [pathname]);
};

export default useScrollToTop;

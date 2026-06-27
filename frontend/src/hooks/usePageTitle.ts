import { useEffect } from 'react';

const BASE = 'F-Style SHC3';

const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
};

export default usePageTitle;

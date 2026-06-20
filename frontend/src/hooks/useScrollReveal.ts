import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);
}

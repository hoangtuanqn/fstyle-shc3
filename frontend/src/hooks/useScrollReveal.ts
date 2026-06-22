import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );

    const observe = () => {
      document.querySelectorAll('.rv:not(.on)').forEach((el) => ob.observe(el));
    };

    observe();

    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { ob.disconnect(); mo.disconnect(); };
  }, []);
}

import { useState, useEffect } from 'react';

export function useCountdown(target: number) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const calc = () => {
    const d = target - Date.now();
    if (d <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
    return {
      days: pad(Math.floor(d / 86400000)),
      hours: pad(Math.floor((d % 86400000) / 3600000)),
      minutes: pad(Math.floor((d % 3600000) / 60000)),
      seconds: pad(Math.floor((d % 60000) / 1000)),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

import { useEffect, useState, useRef } from 'react';

const CountUpNumber = ({ value, duration = 1500, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasAnimated.current) return;

    const timeout = setTimeout(() => {
      hasAnimated.current = true;
      const startTime = performance.now();
      const startValue = 0;
      const endValue = value;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(startValue + (endValue - startValue) * eased));
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, []); // ✅ runs once only, never re-triggers on scroll

  return <span ref={ref}>{displayValue}</span>;
};

export default CountUpNumber;

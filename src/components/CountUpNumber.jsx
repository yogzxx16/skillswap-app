import { useEffect, useState, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

const CountUpNumber = ({ value, duration = 2, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        delay,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        }
      });
      return controls.stop;
    }
  }, [value, duration, delay, isInView]);

  return <span ref={ref}>{displayValue}</span>;
};

export default CountUpNumber;

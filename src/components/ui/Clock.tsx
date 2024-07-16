import React, { useEffect, useRef } from "react";

import styles from "../../style/ui/clock.module.scss";

const Clock = () => {
  const hrRef = useRef<HTMLDivElement | null>(null);
  const mnRef = useRef<HTMLDivElement | null>(null);
  const scRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const day = new Date();
      const hh = day.getHours() * 30;
      const mm = day.getMinutes() * 6;
      const ss = day.getSeconds() * 6;

      if (hrRef.current) {
        hrRef.current.style.transform = `rotateZ(${hh + mm / 12}deg)`;
      }
      if (mnRef.current) {
        mnRef.current.style.transform = `rotateZ(${mm}deg)`;
      }
      if (scRef.current) {
        scRef.current.style.transform = `rotateZ(${ss}deg)`;
      }
    };

    const intervalId = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className={styles.clock}>
        <div className={`${styles.hour}`}>
          <div className={`${styles.hr}`} ref={hrRef}></div>
        </div>
        <div className={`${styles.min}`}>
          <div className={`${styles.mn}`} ref={mnRef}></div>
        </div>
        <div className={`${styles.sec}`}>
          <div className={`${styles.sc}`} ref={scRef}></div>
        </div>
      </div>
      <h3>Good Afternoon</h3>
    </>
  );
};

export default Clock;

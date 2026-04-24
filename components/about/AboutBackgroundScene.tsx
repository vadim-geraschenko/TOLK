"use client";

import styles from "./about.module.css";

export function AboutBackgroundScene({
  frameRef,
  leftCloudRef,
  rightCloudRef,
  frameReady,
}: {
  frameRef: React.RefObject<HTMLImageElement | null>;
  leftCloudRef: React.RefObject<HTMLDivElement | null>;
  rightCloudRef: React.RefObject<HTMLDivElement | null>;
  frameReady: boolean;
}) {
  return (
    <div className={styles.backgroundMedia} aria-hidden="true">
      <img
        className={[
          styles.backgroundFrame,
          frameReady ? styles.backgroundFrameIsReady : "",
        ]
          .filter(Boolean)
          .join(" ")}
        ref={frameRef}
        alt=""
      />
      <div className={styles.backgroundCloudWrap} ref={leftCloudRef}>
        <img className={styles.backgroundCloud} src="/assets/about/clouds.png" alt="" />
      </div>
      <div className={`${styles.backgroundCloudWrap} ${styles.cloudRight}`} ref={rightCloudRef}>
        <img className={styles.backgroundCloud} src="/assets/about/clouds.png" alt="" />
      </div>
      <div className={styles.backgroundGrain} />
    </div>
  );
}

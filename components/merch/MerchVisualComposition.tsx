"use client";

import { useEffect, useRef } from "react";

import type { MerchImage } from "../../content/merch";
import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import styles from "./merch.module.css";

const cx = bindStyles(styles);

type MerchVisualCompositionProps = {
  heroImage?: MerchImage;
  detailImage?: MerchImage;
  secondaryImages: MerchImage[];
};

export function MerchVisualComposition({
  heroImage,
  detailImage,
  secondaryImages,
}: MerchVisualCompositionProps) {
  const compositionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const root = compositionRef.current;
    if (!root || !media.matches) return;

    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const applyTilt = () => {
      frame = 0;
      const x = pointerX / window.innerWidth - 0.5;
      const y = pointerY / window.innerHeight - 0.5;

      root.style.setProperty("--tilt-x", `${(-y * 4.4).toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${(x * 5.6).toFixed(2)}deg`);
      root.style.setProperty("--tilt-z", `${(x * 0.8).toFixed(2)}deg`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!frame) frame = window.requestAnimationFrame(applyTilt);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cx("visual-composition")} ref={compositionRef}>
      {heroImage ? (
        <figure className={cx("hero-photo", "tilt-photo")}>
          <img
            src={withBasePath(heroImage.src)}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            decoding="async"
            fetchPriority="high"
          />
        </figure>
      ) : null}

      {detailImage ? (
        <figure className={cx("detail-photo", "tilt-photo")}>
          <img
            src={withBasePath(detailImage.src)}
            alt={detailImage.alt}
            width={detailImage.width}
            height={detailImage.height}
            decoding="async"
          />
        </figure>
      ) : null}

      {secondaryImages.map((image, index) => (
        <figure
          key={image.src}
          className={cx("support-photo", "tilt-photo", `support-photo-${index + 1}`)}
        >
          <img
            src={withBasePath(image.src)}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}

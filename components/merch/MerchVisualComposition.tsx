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

    const applyPush = () => {
      frame = 0;
      // # хай: радиус влияния курсора; больше значение — больше карточек реагируют одновременно.
      const radius = Math.min(window.innerWidth * 0.48, 580);

      root
        .querySelectorAll<HTMLElement>("[data-push-depth]")
        .forEach((card) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = centerX - pointerX;
          const deltaY = centerY - pointerY;
          const distance = Math.hypot(deltaX, deltaY);
          const maxOffset = Number(card.dataset.pushDepth || 1);

          if (distance < 1 || distance > radius) {
            card.style.setProperty("--push-x", "0px");
            card.style.setProperty("--push-y", "0px");
            return;
          }

          // # хай: степень затухания; 1 мягче и дальнобойнее, 3 резче и локальнее.
          const falloff = (1 - distance / radius) ** 2;
          const offset = maxOffset * falloff;

          card.style.setProperty(
            "--push-x",
            `${((deltaX / distance) * offset).toFixed(2)}px`,
          );
          card.style.setProperty(
            "--push-y",
            `${((deltaY / distance) * offset).toFixed(2)}px`,
          );
        });
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!frame) frame = window.requestAnimationFrame(applyPush);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cx("visual-composition")} ref={compositionRef}>
      {heroImage ? (
        <figure
          className={cx("hero-photo", "motion-photo")}
          data-push-depth="7"
        >
          {/* # хай: data-push-depth выше задает максимальный сдвиг главного фото в пикселях. */}
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
        <figure
          className={cx("detail-photo", "motion-photo")}
          data-push-depth="3"
        >
          {/* # хай: data-push-depth выше задает максимальный сдвиг фото с вышивкой в пикселях. */}
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
          className={cx(
            "support-photo",
            "motion-photo",
            `support-photo-${index + 1}`,
          )}
          data-push-depth={[4, 3, 5, 3][index] ?? 16}
        >
          {/* # хай: data-push-depth выше задает максимальный сдвиг; порядок массива соответствует merch_3...merch_6. */}
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

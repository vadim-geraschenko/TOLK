"use client";

import { useState } from "react";

import type { MerchImage } from "../../content/merch";
import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import styles from "./merch.module.css";

const cx = bindStyles(styles);

type MerchGalleryProps = {
  images: MerchImage[];
  title: string;
};

export function MerchGallery({ images, title }: MerchGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  if (!activeImage) return null;

  return (
    <section className={cx("gallery")} aria-label={`Фотографии товара ${title}`}>
      <div className={cx("gallery-frame")}>
        <img
          src={withBasePath(activeImage.src)}
          alt={activeImage.alt}
          width={activeImage.width}
          height={activeImage.height}
          decoding="async"
          fetchPriority="high"
        />

        {hasMultipleImages ? (
          <div className={cx("gallery-controls")} aria-label="Управление каруселью">
            <button type="button" onClick={showPrevious} aria-label="Предыдущее фото">
              Назад
            </button>
            <span>
              {activeIndex + 1} / {images.length}
            </span>
            <button type="button" onClick={showNext} aria-label="Следующее фото">
              Вперёд
            </button>
          </div>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className={cx("thumbs")} role="list" aria-label="Миниатюры товара">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              className={cx("thumb", index === activeIndex ? "is-active" : "")}
              onClick={() => setActiveIndex(index)}
              aria-label={`Показать фото ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <img
                src={withBasePath(image.src)}
                alt=""
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

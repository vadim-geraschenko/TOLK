import { merchProducts } from "../../content/merch";
import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import { Button } from "../site/Button";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { MerchVisualComposition } from "./MerchVisualComposition";
import styles from "./merch.module.css";

const cx = bindStyles(styles);

const navItems = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Выпуски", href: "/episodes" },
  { label: "Очные чтения", href: "#" },
  { label: "Мерч", href: "/merch", isActive: true },
  { label: "Telegram", href: "#", isSocial: true },
  { label: "YouTube", href: "#", isSocial: true },
  { label: "Boosty", href: "#", isSocial: true },
];

const patchPath = `
  M 112 62
  C 184 46, 310 46, 382 56
  C 454 66, 490 94, 492 136
  C 494 188, 438 222, 354 228
  C 270 236, 178 222, 98 206
  C 54 198, 38 164, 48 120
  C 58 90, 76 70, 112 62
  Z
`;

export function MerchPage() {
  const featuredProduct = merchProducts[0];
  const heroImage = featuredProduct?.images[0];
  const detailImage = featuredProduct?.images[1];
  const secondaryImages = featuredProduct?.images.slice(2, 6) ?? [];

  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} />

      <main className={cx("main")}>
        {featuredProduct ? (
          <section
            className={cx("container", "merch-hero")}
            aria-labelledby="featured-merch"
          >
            <MerchVisualComposition
              heroImage={heroImage}
              detailImage={detailImage}
              secondaryImages={secondaryImages}
            />

            <article className={cx("product-panel")}>
              <div className={cx("product-meta")}>
                <span>{featuredProduct.status}</span>
                <strong>{featuredProduct.priceLabel}</strong>
              </div>

              <div className={cx("product-copy")}>
                <h2 id="featured-merch">{featuredProduct.title}</h2>
                <p className={cx("subtitle")}>{featuredProduct.subtitle}</p>

                {detailImage ? (
                  <figure className={cx("mobile-detail")}>
                    <svg
                      className={cx("detail-patch")}
                      viewBox="0 0 520 260"
                      aria-hidden="true"
                    >
                      <defs>
                        <clipPath id="patchClip" clipPathUnits="userSpaceOnUse">
                          <path d={patchPath} />
                        </clipPath>
                      </defs>

                      <image
                        href={withBasePath(detailImage.src)}
                        x="48"
                        y="18"
                        width="440"
                        height="220"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#patchClip)"
                      />

                      <path
                        className={cx("detail-patch-border")}
                        d={patchPath}
                      />
                    </svg>
                    <svg
                      className={cx("detail-overlay")}
                      viewBox="0 0 520 260"
                      aria-hidden="true"
                    >
                      <g className={cx("detail-callout")}>
                        <text x="8" y="57">
                          <tspan x="8" dy="0">
                            Белая
                          </tspan>
                          <tspan x="8" dy="24">
                            вышивка
                          </tspan>
                        </text>
                        <polyline points="82,50 112,50 156,84" />
                        <circle cx="162" cy="87" r="4" />
                      </g>

                      <g className={cx("detail-callout")}>
                        <text x="512" y="50" textAnchor="end">
                          <tspan x="512" dy="0">
                            100%
                          </tspan>
                          <tspan x="512" dy="24">
                            хлопок
                          </tspan>
                        </text>
                        <polyline points="480,45 392,45 334,84" />
                        <circle cx="328" cy="87" r="4" />
                      </g>

                      <g className={cx("detail-callout")}>
                        <text x="8" y="220">
                          240 GSM
                        </text>
                        <polyline points="102,215 122,215 167,169" />
                        <circle cx="172" cy="163" r="4" />
                      </g>

                      <g className={cx("detail-callout")}>
                        <text x="512" y="220" textAnchor="end">
                          <tspan x="512" dy="0">
                            Железный
                          </tspan>
                          <tspan x="512" dy="24">
                            аргумент
                          </tspan>
                        </text>
                        <polyline points="484,238 396,238 332,177" />
                        <circle cx="328" cy="172" r="4" />
                      </g>
                    </svg>
                  </figure>
                ) : null}

                <p className={cx("story-copy", "story-copy-intro")}>
                  Если вы вдруг думали, что мы никогда не сделаем мерч, то вы
                  неправы.
                </p>
                <p className={cx("story-copy", "story-copy-material")}>
                  Футболка выполнена из плотного черного хлопка плотностью 240
                  GSM. На груди — белая вышивка с фразой «Вы не правы».
                </p>
                <p className={cx("story-copy", "story-copy-sizes")}>
                  Размеры уточняются при заказе. Пишите, обсудим и подберем
                  подходящий.
                </p>
              </div>

              {secondaryImages.length > 0 ? (
                <div
                  className={cx("mobile-gallery")}
                  aria-label="Дополнительные фото мерча"
                >
                  {secondaryImages.map((image, index) => (
                    <figure
                      key={image.src}
                      className={cx(
                        "mobile-gallery-card",
                        `mobile-gallery-card-${index + 1}`,
                      )}
                    >
                      <img
                        src={withBasePath(image.src)}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        loading="eager"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              ) : null}

              {secondaryImages.length > 0 ? (
                <section className={cx("mobile-story")} aria-label="О футболке">
                  <p className={cx("mobile-story-lead")}>
                    Если вы вдруг думали, что мы никогда не сделаем мерч, то вы
                    неправы.
                  </p>

                  <div className={cx("mobile-story-star")} aria-hidden="true" />

                  <div className={cx("mobile-story-grid")}>
                    <figure
                      className={cx(
                        "mobile-story-media",
                        "mobile-story-media-wide",
                      )}
                    >
                      <img
                        src={withBasePath(
                          secondaryImages[3]?.src ?? secondaryImages[0].src,
                        )}
                        alt={secondaryImages[3]?.alt ?? secondaryImages[0].alt}
                        width={
                          secondaryImages[3]?.width ?? secondaryImages[0].width
                        }
                        height={
                          secondaryImages[3]?.height ??
                          secondaryImages[0].height
                        }
                        loading="eager"
                        decoding="async"
                      />
                    </figure>

                    <article className={cx("mobile-story-card")}>
                      <span className={cx("mobile-story-kicker")}>Материал</span>
                      <strong className={cx("mobile-story-title")}>240 GSM</strong>
                      <p className={cx("mobile-story-note")}>
                        Плотный черный хлопок, который держит форму.
                      </p>
                    </article>

                    {secondaryImages[0] ? (
                      <figure className={cx("mobile-story-media")}>
                        <img
                          src={withBasePath(secondaryImages[0].src)}
                          alt={secondaryImages[0].alt}
                          width={secondaryImages[0].width}
                          height={secondaryImages[0].height}
                          loading="eager"
                          decoding="async"
                        />
                      </figure>
                    ) : null}

                    {secondaryImages[1] ? (
                      <figure className={cx("mobile-story-media")}>
                        <img
                          src={withBasePath(secondaryImages[1].src)}
                          alt={secondaryImages[1].alt}
                          width={secondaryImages[1].width}
                          height={secondaryImages[1].height}
                          loading="eager"
                          decoding="async"
                        />
                      </figure>
                    ) : null}

                    <article className={cx("mobile-story-card")}>
                      <span className={cx("mobile-story-kicker")}>Деталь</span>
                      <strong className={cx("mobile-story-title")}>Вышивка</strong>
                      <p className={cx("mobile-story-note")}>
                        Белая фраза «Вы не правы» на груди.
                      </p>
                    </article>

                    <article className={cx("mobile-story-card")}>
                      <span className={cx("mobile-story-kicker")}>Посадка</span>
                      <strong className={cx("mobile-story-title")}>Размер</strong>
                      <p className={cx("mobile-story-note")}>
                        Напишите нам, и мы подберем подходящий.
                      </p>
                    </article>

                    {secondaryImages[2] ? (
                      <figure className={cx("mobile-story-media")}>
                        <img
                          src={withBasePath(secondaryImages[2].src)}
                          alt={secondaryImages[2].alt}
                          width={secondaryImages[2].width}
                          height={secondaryImages[2].height}
                          loading="eager"
                          decoding="async"
                        />
                      </figure>
                    ) : null}
                  </div>
                </section>
              ) : null}
              <div className={cx("actions")}>
                <Button
                  cx={cx}
                  href={featuredProduct.ctaHref}
                  label={featuredProduct.ctaLabel}
                />
              </div>
            </article>
          </section>
        ) : null}
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />
    </div>
  );
}

import { merchProducts } from "../../content/merch";
import { bindStyles } from "../../lib/bind-styles";
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
          <section className={cx("container", "merch-hero")} aria-labelledby="featured-merch">
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
                <p>
                  Если вы вдруг думали, что мы никогда не сделаем мерч, то вы
                  неправы.
                </p>
                <p>
                  Футболка выполнена из плотного черного хлопка плотностью
                  240 GSM. На груди — белая вышивка с фразой «Вы не правы».
                </p>
                <p>
                  Размеры уточняются при заказе. Пишите, обсудим и подберем
                  подходящий.
                </p>
              </div>

              <div className={cx("actions")}>
                <Button cx={cx} href={featuredProduct.ctaHref} label={featuredProduct.ctaLabel} />
              </div>

              <ul className={cx("details")} aria-label="Характеристики товара">
                {featuredProduct.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          </section>
        ) : null}
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />
    </div>
  );
}

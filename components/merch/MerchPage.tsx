import { merchProducts } from "../../content/merch";
import { bindStyles } from "../../lib/bind-styles";
import { Button } from "../site/Button";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { MerchGallery } from "./MerchGallery";
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
  const upcomingProducts = merchProducts.slice(1);

  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} />

      <main className={cx("main")}>
        <section className={cx("container", "hero")}>
          <div className={cx("hero-copy")}>
            <p className={cx("kicker")}>Мерч TOLK</p>
            <h1>Вещи для разговоров о вечном и личном</h1>
            <p>
              Пока в линейке один предмет, зато настоящий: футболка «Вы не правы».
              Страница уже готова к новым дропам и дополнительным фотографиям.
            </p>
          </div>
        </section>

        {featuredProduct ? (
          <section className={cx("container", "product-section")} aria-labelledby="featured-merch">
            <MerchGallery images={featuredProduct.images} title={featuredProduct.title} />

            <article className={cx("product-card")}>
              <div className={cx("product-meta")}>
                <span>{featuredProduct.status}</span>
                <span>{featuredProduct.priceLabel}</span>
              </div>

              <div className={cx("product-copy")}>
                <p className={cx("kicker")}>Первый предмет</p>
                <h2 id="featured-merch">{featuredProduct.title}</h2>
                <p className={cx("subtitle")}>{featuredProduct.subtitle}</p>
                <p>{featuredProduct.description}</p>
              </div>

              <ul className={cx("details")} aria-label="Детали товара">
                {featuredProduct.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>

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

        <section className={cx("container", "future-section")}>
          <div>
            <p className={cx("kicker")}>Дальше</p>
            <h2>Новые предметы можно добавить без перестройки страницы</h2>
          </div>

          <div className={cx("future-grid")}>
            {upcomingProducts.length > 0 ? (
              upcomingProducts.map((product) => (
                <article key={product.slug} className={cx("future-card")}>
                  <h3>{product.title}</h3>
                  <p>{product.subtitle}</p>
                </article>
              ))
            ) : (
              <article className={cx("future-card", "is-empty")}>
                <h3>Следующий дроп</h3>
                <p>Место под будущий мерч TOLK: книги, принты, худи или новые футболки.</p>
              </article>
            )}
          </div>
        </section>
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />
    </div>
  );
}

import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import { Button } from "../site/Button";
import { EventStatusBadge } from "../site/EventStatusBadge";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import styles from "./readings.module.css";

const cx = bindStyles(styles);

const navItems = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Выпуски", href: "/episodes" },
  { label: "Очные чтения", href: "/readings", isActive: true },
  { label: "Мерч", href: "/merch" },
  { label: "Telegram", href: "#", isSocial: true },
  { label: "YouTube", href: "#", isSocial: true },
  { label: "Boosty", href: "#", isSocial: true },
];

const details = [
  ["Дата", "13 апреля 2025 · 18:00"],
  ["Адрес", "Москва, Спартаковская площадь, 14 стр. 3"],
  ["Формат", "Камерная запись в студии"],
  ["После записи", "Вопросы и общее обсуждение"],
];

const notes = [
  "Количество мест сильно ограничено: это не лекционный зал, а приглашение на живую студийную запись.",
];

const photos = [
  {
    src: "/readings/assets/shumno-table.webp",
    alt: "Стол с микрофонами в подкаст-студии Shumno",
    width: 600,
    height: 900,
  },
  {
    src: "/readings/assets/shumno-microphones.webp",
    alt: "Микрофоны в студии записи Shumno",
    width: 600,
    height: 400,
  },
  {
    src: "/readings/assets/shumno-recorder.webp",
    alt: "Рекордер и микрофоны на студийном столе",
    width: 600,
    height: 400,
  },
];

export function ReadingsPage() {
  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} />

      <main className={cx("main")}>
        <section
          className={cx("screen", "container")}
          aria-labelledby="readings-title"
        >
          <div className={cx("screen-grid")}>
            <div className={cx("hero-copy")}>
              <div className={cx("hero-meta")}>
                <p className={cx("eyebrow")}>Очные чтения</p>
                <div className={cx("status-list")} aria-label="Статус события">
                  <EventStatusBadge>Событие прошло</EventStatusBadge>
                </div>
              </div>
              <h1 id="readings-title">
                Читаем Библию. Бог решает убить человечество
              </h1>
              <p className={cx("lead")}>
                Запись следующих чтений планируется 13-го апреля, в 18:00 в
                Москве. Мероприятие, как и в прошлый раз, будет очень камерным:
                фактически мы приглашаем вас в нашу студию записи.
              </p>
              <figure className={cx("photo", "hero-mobile-photo")}>
                <img
                  src={withBasePath(photos[0].src)}
                  alt={photos[0].alt}
                  width={photos[0].width}
                  height={photos[0].height}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className={cx("actions")}>
                <Button cx={cx} href="#" label="Приобрести билет" />
                <Button
                  cx={cx}
                  href="https://boosty.to/bibletolk"
                  label="Материалы на Boosty"
                />
              </div>
              <p className={cx("boosty-note")}>
                Записи секций вопросов с очных встреч доступны подписчикам
                Boosty.
              </p>
            </div>

            <aside className={cx("details")} aria-label="Детали встречи">
              {details.map(([label, value]) => (
                <div className={cx("detail-row")} key={label}>
                  <span>/ {label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </aside>

            <div className={cx("notes")} aria-label="О формате">
              {notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>

            <div
              className={cx("photo-strip")}
              aria-label="Материалы со студийных записей"
            >
              {photos.map((photo) => (
                <figure className={cx("photo")} key={photo.src}>
                  <img
                    src={withBasePath(photo.src)}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />
    </div>
  );
}

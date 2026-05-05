"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Episode } from "../../content/episodes";
import type { EpisodeKind } from "../../content/episodes.overrides";
import { bindStyles } from "../../lib/bind-styles";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { EpisodeFeedCard } from "./EpisodeFeedCard";
import styles from "./episodes-catalog.module.css";

const cx = bindStyles(styles);
const EPISODES_PAGE_SIZE = 8;
const EPISODE_KIND_LABELS: Record<EpisodeKind, string> = {
  episode: "Выпуск",
  special: "Спецвыпуск",
  "stream-record": "Запись стрима",
  video: "Видео",
  shorts: "Shorts",
};

const TABS: Array<{ key: "all" | EpisodeKind; label: string }> = [
  { key: "all", label: "Все" },
  { key: "episode", label: "Выпуски" },
  { key: "special", label: "Спецвыпуски" },
  { key: "video", label: "Видео" },
  { key: "stream-record", label: "Стримы" },
  { key: "shorts", label: "Shorts" },
];

type EpisodesCatalogPageProps = {
  episodes: Episode[];
};

function getTabKey(tab?: string): "all" | EpisodeKind {
  const keys = new Set(TABS.map((item) => item.key));
  const fallback: "all" | EpisodeKind = "episode";
  return keys.has((tab as "all" | EpisodeKind) ?? fallback)
    ? ((tab as "all" | EpisodeKind) ?? fallback)
    : fallback;
}

function filterEpisodes(list: Episode[], tab: "all" | EpisodeKind): Episode[] {
  if (tab === "all") return list;
  if (tab === "episode") {
    return list.filter((episode) => episode.kind === "episode" || episode.kind === "special");
  }
  return list.filter((episode) => episode.kind === tab);
}

function toTabHref(key: "all" | EpisodeKind): string {
  return `/episodes?tab=${encodeURIComponent(key)}`;
}

function toCatalogHref(tab: "all" | EpisodeKind, page: number): string {
  const params = new URLSearchParams();
  params.set("tab", tab);
  params.set("page", String(Math.max(1, page)));
  return `/episodes?${params.toString()}#episodes-feed`;
}

export function EpisodesCatalogPage({ episodes }: EpisodesCatalogPageProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") ?? undefined;
  const pageParam = searchParams.get("page");
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const activeTab = getTabKey(tabParam);
  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const filtered = filterEpisodes(episodes, activeTab);
  const visibleCount = safePage * EPISODES_PAGE_SIZE;
  const visible = filtered.slice(0, visibleCount);
  const visibleItems = visible.length;
  const totalItems = filtered.length;
  const hasMore = filtered.length > visible.length;
  const navItems = [
    { label: "Главная", href: "/" },
    { label: "О нас", href: "/about" },
    { label: "Выпуски", href: "/episodes", isActive: true },
    { label: "Очные чтения", href: "#" },
    { label: "Мерч", href: "#" },
    { label: "Telegram", href: "#", isSocial: true },
    { label: "YouTube", href: "#", isSocial: true },
    { label: "Boosty", href: "#", isSocial: true },
  ];

  return (
    <div className={cx("root", "page-shell")} id="episodes-top">
      <SiteHeader navItems={navItems} />

      <main className={cx("main")}>
        <section className={cx("container", "top")}>
          <h1>Лента выпусков</h1>
          <p className={cx("subtitle")}>Прототип страницы выпусков в формате YouTube-ленты</p>
          <nav className={cx("tabs")} aria-label="Категории выпусков">
            {TABS.map((item) => (
              <Link
                key={item.key}
                aria-current={activeTab === item.key ? "page" : undefined}
                className={cx("tab", activeTab === item.key ? "is-active" : "")}
                href={toTabHref(item.key)}
                scroll={false}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        <section className={cx("container", "feed")} id="episodes-feed" aria-live="polite">
          {visible.map((episode) => (
            <EpisodeFeedCard
              key={episode.slug}
              className={cx("feed-card")}
              episode={episode}
              metaSuffix={EPISODE_KIND_LABELS[episode.kind]}
            />
          ))}

          {hasMore ? (
            <div className={cx("feed-more")}>
              <p className={cx("feed-more-status")}>
                Показано {visibleItems} из {totalItems}
              </p>
              <Link
                className={cx("more-button")}
                href={toCatalogHref(activeTab, safePage + 1)}
                scroll={false}
                aria-controls="episodes-feed"
              >
                <span className={cx("button-label")}>Показать ещё</span>
                <span className={cx("stars")} aria-hidden="true">
                  <span className={cx("star", "star-lg", "star-1")} />
                  <span className={cx("star", "star-sm", "star-2")} />
                  <span className={cx("star", "star-lg", "star-3")} />
                  <span className={cx("star", "star-sm", "star-4")} />
                  <span className={cx("star", "star-lg", "star-5")} />
                  <span className={cx("star", "star-sm", "star-6")} />
                  <span className={cx("star", "star-sm", "star-7")} />
                </span>
              </Link>
            </div>
          ) : (
            <div className={cx("feed-more")}>
              <p className={cx("feed-more-status")}>Показано {visibleItems} из {totalItems}</p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />
      <a href="#episodes-top" className={cx("to-top")} aria-label="Наверх">
        ↑
      </a>
    </div>
  );
}

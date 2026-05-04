/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BASE_PATH, withBasePath } from "../../lib/base-path";
import styles from "./SiteHeader.module.css";

type NavItem = {
  label: string;
  href: string;
  isActive?: boolean;
  isSocial?: boolean;
};

type SiteHeaderProps = {
  navItems: NavItem[];
};

export function SiteHeader({ navItems }: SiteHeaderProps) {
  const [isHiddenOnMobile, setIsHiddenOnMobile] = useState(false);
  const prevYRef = useRef(0);
  const pathname = usePathname();
  const currentPathname =
    BASE_PATH && pathname.startsWith(BASE_PATH)
      ? pathname.slice(BASE_PATH.length) || "/"
      : pathname;

  const isCurrentLink = (item: NavItem): boolean => {
    if (item.isActive) return true;
    if (!item.href.startsWith("/")) return false;
    if (item.href === "/") return currentPathname === "/";
    return currentPathname === item.href || currentPathname.startsWith(`${item.href}/`);
  };

  useEffect(() => {
    const mobileMedia = window.matchMedia("(max-width: 47.5rem)");
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const TOP_ZONE_PX = 72;
    const DELTA_THRESHOLD_PX = 10;

    const handleScroll = () => {
      if (!mobileMedia.matches || reducedMotionMedia.matches) {
        setIsHiddenOnMobile(false);
        prevYRef.current = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - prevYRef.current;
      prevYRef.current = currentY;

      if (currentY <= TOP_ZONE_PX) {
        setIsHiddenOnMobile(false);
        return;
      }

      if (Math.abs(delta) < DELTA_THRESHOLD_PX) return;

      if (delta > 0) {
        setIsHiddenOnMobile(true);
      } else {
        setIsHiddenOnMobile(false);
      }
    };

    prevYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    mobileMedia.addEventListener("change", handleScroll);
    reducedMotionMedia.addEventListener("change", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mobileMedia.removeEventListener("change", handleScroll);
      reducedMotionMedia.removeEventListener("change", handleScroll);
    };
  }, []);

  return (
    <header
      className={[
        styles.siteHeader,
        isHiddenOnMobile ? styles.hiddenOnMobile : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.container}>
        <a className={styles.brand} href={withBasePath("/")} aria-label="TOLK — перейти на главную">
          <div className={styles.brandMark}>T</div>
          <div className={styles.brandCopy}>
            <strong>TOLK</strong>
            <span>Библия для всех: разговоры о вечном и личном</span>
          </div>
        </a>
        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => {
            const isCurrent = isCurrentLink(item);
            const className = [
              styles.navLink,
              isCurrent ? styles.isActive : "",
              item.isSocial ? styles.social : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <a
                key={`${item.label}-${item.href}`}
                href={withBasePath(item.href)}
                className={className}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

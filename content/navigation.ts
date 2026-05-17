export type NavigationItem = {
  label: string;
  href: string;
  isSocial?: boolean;
  isActive?: boolean;
};

export const socialLinks = {
  telegram: "https://t.me/bibletolk",
  youtube: "https://www.youtube.com/@1tolkshow",
  boosty: "https://boosty.to/bibletolk",
} as const;

export const primaryNavigation: NavigationItem[] = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Выпуски", href: "/episodes" },
  { label: "Очные чтения", href: "/readings" },
  { label: "Мерч", href: "/merch" },
  { label: "Telegram", href: socialLinks.telegram, isSocial: true },
  { label: "YouTube", href: socialLinks.youtube, isSocial: true },
  { label: "Boosty", href: socialLinks.boosty, isSocial: true },
];

export function getSiteNavItems(activeHref: string): NavigationItem[] {
  return primaryNavigation.map((item) => ({
    ...item,
    isActive: item.href === activeHref,
  }));
}

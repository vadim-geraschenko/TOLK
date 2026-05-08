export type NavigationItem = {
  label: string;
  href: string;
  social?: boolean;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Выпуски", href: "#" },
  { label: "Очные чтения", href: "#" },
  { label: "Мерч", href: "/merch" },
  { label: "Telegram", href: "#", social: true },
  { label: "YouTube", href: "#", social: true },
  { label: "Boosty", href: "#", social: true },
];

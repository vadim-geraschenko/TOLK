import type { Metadata } from "next";

import { MerchPage } from "../../components/merch/MerchPage";

export const metadata: Metadata = {
  title: "TOLK — Мерч",
  description:
    "Мерч TOLK: плотная черная футболка «Вы не правы» с белой вышивкой.",
};

export default function MerchRoute() {
  return <MerchPage />;
}

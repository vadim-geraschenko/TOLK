import type { Metadata } from "next";

import { MerchPage } from "../../components/merch/MerchPage";

export const metadata: Metadata = {
  title: "TOLK — Мерч",
  description: "Мерч TOLK: футболка «Вы не правы» и будущие дропы проекта.",
};

export default function MerchRoute() {
  return <MerchPage />;
}

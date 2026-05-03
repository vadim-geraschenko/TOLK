import type { Metadata } from "next";

import { AboutPage } from "../../components/about/AboutPage";

export const metadata: Metadata = {
  title: "TOLK — О проекте",
};

export default function AboutRoute() {
  return <AboutPage />;
}

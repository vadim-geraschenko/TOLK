import type { Metadata } from "next";

import { LegacySourcePage } from "../components/LegacySourcePage";

export const metadata: Metadata = {
  title: "TOLK — Home MVP",
};

export default function HomePage() {
  return (
    <LegacySourcePage
      sourcePath="docs/design/pages/home/source/home-mvp.html"
      pageId="home"
      replacements={[
        ["../../about/source/about.html", "/about"],
        ["./assets/", "/home/assets/"],
        ["../../../assets/", "/assets/"],
      ]}
    />
  );
}

import type { Metadata } from "next";

import { LegacySourcePage } from "../../components/LegacySourcePage";

export const metadata: Metadata = {
  title: "TOLK — О проекте",
};

export default function AboutPage() {
  return (
    <LegacySourcePage
      sourcePath="docs/design/pages/about/source/about.html"
      pageId="about"
      replacements={[
        ["../home/home-mvp.html", "/"],
        ["../../home/source/assets/", "/home/assets/"],
        ["./assets/", "/about/assets/"],
      ]}
    />
  );
}

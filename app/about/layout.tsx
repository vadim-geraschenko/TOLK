import type { ReactNode } from "react";

import { AboutPreinitScript } from "../../components/about/motion/AboutPreinitScript";
import { withBasePath } from "../../lib/base-path";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={withBasePath("/about/assets/clouds.webp")}
        fetchPriority="high"
      />
      <AboutPreinitScript />
      {children}
    </>
  );
}

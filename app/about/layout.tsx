import type { ReactNode } from "react";

import { AboutPreinitScript } from "../../components/about/motion/AboutPreinitScript";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AboutPreinitScript />
      {children}
    </>
  );
}

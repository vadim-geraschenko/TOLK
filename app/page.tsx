import type { Metadata } from "next";

import { HomePage } from "../components/home/HomePage";

export const metadata: Metadata = {
  title: "TOLK — Home MVP",
};

export default function HomeRoute() {
  return <HomePage />;
}

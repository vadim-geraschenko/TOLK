import type { Metadata } from "next";

import { ReadingsPage } from "../../components/readings/ReadingsPage";

export const metadata: Metadata = {
  title: "Очные чтения — TOLK",
};

export default function ReadingsRoute() {
  return <ReadingsPage />;
}

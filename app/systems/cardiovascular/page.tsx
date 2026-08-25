import type { Metadata } from "next";
import { CardiovascularPage } from "@/src/screens/Systems/CardiovascularPage";

export const metadata: Metadata = {
  title: "Cardiovascular System",
  description:
    "Explore the heart, its anatomical structures, normal physiology, and important cardiovascular disease pathways.",
};

export default function Page() {
  return <CardiovascularPage />;
}

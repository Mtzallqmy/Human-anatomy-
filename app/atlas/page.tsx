import type { Metadata } from "next";
import { AtlasPage } from "@/src/screens/Atlas/AtlasPage";

export const metadata: Metadata = {
  title: "Interactive 3D Cardiovascular Atlas",
  description:
    "Explore an interactive three-dimensional educational heart model, anatomical structures, blood flow, and disease progression.",
};

export default function Page() {
  return <AtlasPage />;
}

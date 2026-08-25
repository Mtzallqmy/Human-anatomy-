import type { Metadata } from "next";
import { ReferencesPage } from "@/src/screens/References/ReferencesPage";

export const metadata: Metadata = {
  title: "Scientific References",
  description:
    "Explore the scientific anatomy, physiology, pathology, and terminology references informing the Anatomica educational atlas.",
};

export default function Page() {
  return <ReferencesPage />;
}

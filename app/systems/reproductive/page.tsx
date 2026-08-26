import type { Metadata } from "next";
import { ReproductiveChoicePage } from "@/src/screens/Systems/ReproductiveChoicePage";

export const metadata: Metadata = {
  title: "Male & Female Reproductive Anatomy",
  description: "Choose the male or female reproductive anatomy chapter and interactive 3D atlas.",
};

export default function Page() {
  return <ReproductiveChoicePage />;
}

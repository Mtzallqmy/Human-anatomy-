import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtlasPage } from "@/src/screens/Atlas/AtlasPage";
import { medicalRepository } from "@/src/services/medicalRepository";

interface Props {
  params: Promise<{ system: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { system } = await params;
  const value = medicalRepository.getSystemBySlug(system);
  return value
    ? { title: `${value.name.en} 3D Atlas`, description: value.description.en }
    : { title: "Human body atlas" };
}

export default async function Page({ params }: Props) {
  const { system } = await params;
  const value = medicalRepository.getSystemBySlug(system);
  if (!value?.available) notFound();
  return <AtlasPage initialSystemId={value.id} />;
}

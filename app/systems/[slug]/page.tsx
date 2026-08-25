import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SystemPage } from "@/src/screens/Systems/SystemPage";
import { medicalRepository } from "@/src/services/medicalRepository";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const system = medicalRepository.getSystemBySlug(slug);
  return system ? { title: system.name.en, description: system.description.en } : { title: "Body system" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const system = medicalRepository.getSystemBySlug(slug);
  if (!system?.available) notFound();
  return <SystemPage systemId={system.id} />;
}

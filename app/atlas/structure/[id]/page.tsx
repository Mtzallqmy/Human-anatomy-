import type { Metadata } from "next";
import { AtlasPage } from "@/src/screens/Atlas/AtlasPage";
import { medicalRepository } from "@/src/services/medicalRepository";

interface StructureRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StructureRouteProps): Promise<Metadata> {
  const { id } = await params;
  const structure = medicalRepository.getStructureById(id);
  if (!structure) return { title: "Anatomical structure" };
  return {
    title: structure.name.en,
    description: structure.description.en,
    openGraph: { title: structure.name.en, description: structure.description.en, images: [] },
    twitter: { title: structure.name.en, description: structure.description.en, images: [] },
  };
}

export default async function Page({ params }: StructureRouteProps) {
  const { id } = await params;
  const structure = medicalRepository.getStructureById(id);
  return <AtlasPage initialStructureId={id} initialSystemId={structure?.systemId} />;
}

import type { Metadata } from "next";
import { DiseasePage } from "@/src/screens/Disease/DiseasePage";
import { medicalRepository } from "@/src/services/medicalRepository";

interface DiseaseRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DiseaseRouteProps): Promise<Metadata> {
  const { id } = await params;
  const disease = medicalRepository.getDiseaseById(id);
  if (!disease) return { title: "Cardiovascular pathology" };
  return {
    title: disease.name.en,
    description: disease.summary.en,
    openGraph: { title: disease.name.en, description: disease.summary.en, images: [] },
    twitter: { title: disease.name.en, description: disease.summary.en, images: [] },
  };
}

export default async function Page({ params }: DiseaseRouteProps) {
  const { id } = await params;
  return <DiseasePage diseaseId={id} />;
}

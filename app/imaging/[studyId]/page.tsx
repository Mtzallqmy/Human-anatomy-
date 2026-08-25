import type { Metadata } from "next";
import { imagingStudies } from "@/src/data/imaging/imagingCatalog";
import { ImagingPage } from "@/src/screens/Imaging/ImagingPage";

interface Props {
  params: Promise<{ studyId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { studyId } = await params;
  const study = imagingStudies.find((item) => item.id === studyId);
  return study ? { title: study.title.en, description: study.description.en } : { title: "Medical imaging" };
}

export default async function Page({ params }: Props) {
  const { studyId } = await params;
  return <ImagingPage studyId={studyId} />;
}

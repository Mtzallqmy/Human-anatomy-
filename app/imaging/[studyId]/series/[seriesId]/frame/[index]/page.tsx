import { ImagingPage } from "@/src/screens/Imaging/ImagingPage";

interface Props {
  params: Promise<{ studyId: string; seriesId: string; index: string }>;
}

export default async function Page({ params }: Props) {
  const { studyId, seriesId, index } = await params;
  const value = Number.parseInt(index, 10);
  return (
    <ImagingPage studyId={studyId} seriesId={seriesId} initialFrame={Number.isFinite(value) ? value : 0} />
  );
}

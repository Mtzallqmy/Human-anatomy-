import { AdminResourcePage } from "@/src/features/admin/AdminResourcePage";
import { AdminDiseaseStageEditor } from "@/src/features/admin/AdminDiseaseStageEditor";
export default function Page() {
  return (
    <>
      <AdminResourcePage
        resource="diseases"
        kind="disease"
        title="Diseases"
        description="Etiology, pathogenesis, morphology, functional effects, stages, and affected structures."
      />
      <AdminDiseaseStageEditor />
    </>
  );
}

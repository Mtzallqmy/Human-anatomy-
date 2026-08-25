import { AdminResourcePage } from "@/src/features/admin/AdminResourcePage";
export default function Page() {
  return (
    <AdminResourcePage
      resource="anatomical_structures"
      kind="structure"
      title="Anatomical structures"
      description="Bilingual anatomy, physiology, hierarchy, terminology, and stable IDs."
    />
  );
}

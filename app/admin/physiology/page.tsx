import { AdminResourcePage } from "@/src/features/admin/AdminResourcePage";
export default function Page() {
  return (
    <AdminResourcePage
      resource="physiology_topics"
      kind="physiology"
      title="Physiology topics"
      description="Reusable mechanisms such as blood flow, cardiac cycle, and electrical conduction."
    />
  );
}

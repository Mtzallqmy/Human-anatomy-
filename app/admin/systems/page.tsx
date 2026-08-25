import { AdminResourcePage } from "@/src/features/admin/AdminResourcePage";
export default function Page() {
  return (
    <AdminResourcePage
      resource="systems"
      kind="system"
      title="Body systems"
      description="Create, order, activate, and publish reusable system modules."
    />
  );
}

import { AdminCatalog } from "./AdminCatalog";
import { AdminCreateForm } from "./AdminCreateForms";
import type { AdminResource } from "@/src/data-access/admin/adminRepository";

export function AdminResourcePage({
  resource,
  kind,
  title,
  description,
}: {
  resource: AdminResource;
  kind: "system" | "structure" | "disease" | "physiology" | "reference";
  title: string;
  description: string;
}) {
  return (
    <>
      <AdminCatalog resource={resource} title={title} description={description} />
      <AdminCreateForm kind={kind} />
    </>
  );
}

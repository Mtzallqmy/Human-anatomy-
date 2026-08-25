import { AdminResourcePage } from "@/src/features/admin/AdminResourcePage";
export default function Page() {
  return (
    <AdminResourcePage
      resource="references"
      kind="reference"
      title="Scientific references"
      description="DOI, PMID, publisher, edition, authors, and source links."
    />
  );
}

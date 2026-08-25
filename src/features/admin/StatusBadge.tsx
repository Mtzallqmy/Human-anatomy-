export function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-status admin-status--${status}`}>{status.replaceAll("_", " ")}</span>;
}

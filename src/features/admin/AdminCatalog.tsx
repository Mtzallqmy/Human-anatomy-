"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminRepository, type AdminResource } from "@/src/data-access/admin/adminRepository";
import { StatusBadge } from "./StatusBadge";
import { useAuth } from "@/src/features/auth/AuthProvider";

const entityTypes = {
  systems: "system",
  anatomical_structures: "structure",
  diseases: "disease",
  physiology_topics: "physiology_topic",
  references: "reference",
  three_d_assets: "three_d_asset",
} as const;

export function AdminCatalog({
  resource,
  title,
  description,
}: {
  resource: AdminResource;
  title: string;
  description: string;
}) {
  const [page, setPage] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const query = useQuery({
    queryKey: ["admin-list", resource, page],
    queryFn: () => adminRepository.list(resource, page),
  });
  const transition = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "in_review" | "published" | "archived" }) =>
      adminRepository.transition(resource, id, status),
    onSuccess: async () => {
      setNotice("Workflow state updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-list", resource] });
    },
    onError: (error) => setNotice(error.message),
  });
  const review = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "approved" | "rejected" }) =>
      adminRepository.review(
        entityTypes[resource],
        id,
        decision,
        decision === "approved" ? "Reviewed and approved." : "Changes are required.",
        user!.id,
      ),
    onSuccess: async () => {
      setNotice("Review decision recorded.");
      await queryClient.invalidateQueries({ queryKey: ["admin-list", resource] });
    },
    onError: (error) => setNotice(error.message),
  });
  const rename = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => adminRepository.rename(resource, id, value),
    onSuccess: async () => {
      setEditing(null);
      setNotice("Record updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-list", resource] });
    },
    onError: (error) => setNotice(error.message),
  });
  const systemSettings = useMutation({
    mutationFn: ({ id, available, order }: { id: string; available: boolean; order: number }) =>
      adminRepository.updateSystemSettings(id, available, order),
    onSuccess: async () => {
      setNotice("System availability updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-list", resource] });
    },
    onError: (error) => setNotice(error.message),
  });

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>Content catalog</p>
          <h1>{title}</h1>
          <span>{description}</span>
        </div>
      </header>
      {notice && (
        <div className="admin-alert" role="status">
          {notice}
        </div>
      )}
      {query.isPending && <div className="admin-state">Loading records…</div>}
      {query.error && <div className="admin-alert">{query.error.message}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Workflow</th>
            </tr>
          </thead>
          <tbody>
            {(query.data?.rows ?? []).map((raw) => {
              const row = raw as unknown as Record<string, unknown>;
              const id = String(row.id);
              const status = String(row.status ?? "published");
              const title = String(row.canonical_name ?? row.title ?? row.name ?? "—");
              return (
                <tr key={id}>
                  <td>
                    <code>{id}</code>
                  </td>
                  <td>
                    {editing?.id === id ? (
                      <form
                        className="admin-inline-edit"
                        onSubmit={(event) => {
                          event.preventDefault();
                          rename.mutate(editing);
                        }}
                      >
                        <input
                          aria-label="Record name"
                          value={editing.value}
                          onChange={(event) => setEditing({ id, value: event.target.value })}
                        />
                        <button>Save</button>
                      </form>
                    ) : (
                      title
                    )}
                  </td>
                  <td>
                    <StatusBadge status={status} />
                  </td>
                  <td>{row.updated_at ? new Date(String(row.updated_at)).toLocaleDateString() : "—"}</td>
                  <td>
                    <div className="admin-row-actions">
                      {(profile?.role === "editor" || profile?.role === "admin") &&
                        (status === "draft" || status === "rejected" || profile.role === "admin") && (
                          <button onClick={() => setEditing({ id, value: title })}>Edit</button>
                        )}
                      {(profile?.role === "editor" || profile?.role === "admin") &&
                        (status === "draft" || status === "rejected") && (
                          <button onClick={() => transition.mutate({ id, status: "in_review" })}>
                            Submit
                          </button>
                        )}
                      {(profile?.role === "reviewer" || profile?.role === "admin") &&
                        status === "in_review" && (
                          <>
                            <button onClick={() => review.mutate({ id, decision: "approved" })}>
                              Approve
                            </button>
                            <button onClick={() => review.mutate({ id, decision: "rejected" })}>
                              Reject
                            </button>
                          </>
                        )}
                      {profile?.role === "admin" && status === "approved" && (
                        <button onClick={() => transition.mutate({ id, status: "published" })}>
                          Publish
                        </button>
                      )}
                      {profile?.role === "admin" && status !== "archived" && (
                        <button onClick={() => transition.mutate({ id, status: "archived" })}>Archive</button>
                      )}
                      {resource === "systems" && profile?.role === "admin" && (
                        <button
                          onClick={() =>
                            systemSettings.mutate({
                              id,
                              available: !Boolean(row.is_available),
                              order: Number(row.sort_order ?? 0),
                            })
                          }
                        >
                          {row.is_available ? "Disable" : "Enable"}
                        </button>
                      )}
                      {resource === "systems" && profile?.role === "admin" && (
                        <>
                          <button
                            aria-label={`Move ${title} earlier`}
                            onClick={() =>
                              systemSettings.mutate({
                                id,
                                available: Boolean(row.is_available),
                                order: Math.max(0, Number(row.sort_order ?? 0) - 1),
                              })
                            }
                          >
                            ↑
                          </button>
                          <button
                            aria-label={`Move ${title} later`}
                            onClick={() =>
                              systemSettings.mutate({
                                id,
                                available: Boolean(row.is_available),
                                order: Number(row.sort_order ?? 0) + 1,
                              })
                            }
                          >
                            ↓
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="admin-pagination">
        <span>{query.data?.count ?? 0} records</span>
        <div>
          <button
            disabled={page === 0}
            onClick={() => setPage((value) => value - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page {page + 1}</span>
          <button
            disabled={(query.data?.rows.length ?? 0) < 25}
            onClick={() => setPage((value) => value + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </>
  );
}

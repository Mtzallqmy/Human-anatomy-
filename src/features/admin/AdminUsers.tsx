"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminRepository } from "@/src/data-access/admin/adminRepository";
import { StatusBadge } from "./StatusBadge";

export function AdminUsers() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["admin-profiles"], queryFn: () => adminRepository.listProfiles() });
  const update = useMutation({
    mutationFn: ({
      id,
      role,
      status,
    }: {
      id: string;
      role: "viewer" | "editor" | "reviewer" | "admin";
      status: "pending" | "active" | "suspended";
    }) => adminRepository.updateProfile(id, role, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });
  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>Access control</p>
          <h1>Staff users</h1>
          <span>Only admins can activate accounts or assign trusted medical roles.</span>
        </div>
      </header>
      {query.error && <div className="admin-alert">{query.error.message}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.full_name || profile.id}</td>
                <td>{profile.role}</td>
                <td>
                  <StatusBadge status={profile.status} />
                </td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      onClick={() => update.mutate({ id: profile.id, role: "editor", status: "active" })}
                    >
                      Editor
                    </button>
                    <button
                      onClick={() => update.mutate({ id: profile.id, role: "reviewer", status: "active" })}
                    >
                      Reviewer
                    </button>
                    <button
                      onClick={() => update.mutate({ id: profile.id, role: "admin", status: "active" })}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() =>
                        update.mutate({ id: profile.id, role: profile.role, status: "suspended" })
                      }
                    >
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

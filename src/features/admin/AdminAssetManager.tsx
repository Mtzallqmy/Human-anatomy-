"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { adminRepository } from "@/src/data-access/admin/adminRepository";
import { AdminCatalog } from "./AdminCatalog";

interface Mapping {
  meshName: string;
  structureId: string;
}

async function inspectModel(file: File): Promise<Mapping[]> {
  const buffer = await file.arrayBuffer();
  const gltf = await new Promise<Awaited<ReturnType<GLTFLoader["parseAsync"]>>>((resolve, reject) => {
    new GLTFLoader().parse(buffer, "", resolve, reject);
  });
  const names = new Set<string>();
  gltf.scene.traverse((object) => {
    if ((object as { isMesh?: boolean }).isMesh) names.add(object.name || `Mesh_${names.size + 1}`);
  });
  return [...names].map((meshName) => ({ meshName, structureId: "" }));
}

export function AdminAssetManager() {
  const [file, setFile] = useState<File | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const upload = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      if (!file) throw new Error("Select a GLB or GLTF file first.");
      const data = new FormData(form);
      const assetId = await adminRepository.uploadAsset(file, {
        systemId: String(data.get("systemId")),
        rootStructureId: String(data.get("rootStructureId")),
        name: String(data.get("name")),
        version: String(data.get("version")),
        license: String(data.get("license")),
        attribution: String(data.get("attribution")),
      });
      const complete = mappings.filter((item) => item.structureId);
      if (assetId && complete.length) await adminRepository.saveMeshMappings(assetId, complete);
    },
    onSuccess: async () => {
      setMessage("Model and mesh mappings saved as a draft.");
      await queryClient.invalidateQueries({ queryKey: ["admin-list", "three_d_assets"] });
    },
    onError: (error) => setMessage(error.message),
  });
  const onFile = async (next: File | null) => {
    setFile(next);
    setMappings([]);
    setMessage(null);
    if (!next) return;
    try {
      setMappings(await inspectModel(next));
    } catch {
      setMessage("The model could not be inspected. Confirm that it is a valid GLB/GLTF file.");
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    upload.mutate(event.currentTarget);
  };

  return (
    <>
      <AdminCatalog
        resource="three_d_assets"
        title="3D assets"
        description="Private model storage, licensing, versioning, and mesh-to-anatomy mapping."
      />
      <section className="admin-create">
        <div className="admin-create-head">
          <div>
            <h2>Upload and inspect model</h2>
            <p>
              Mesh names are read locally before upload. No asset becomes public before review and
              publication.
            </p>
          </div>
          <Link className="admin-secondary-button" href="/atlas" target="_blank">
            Preview in 3D
          </Link>
        </div>
        {message && <div className="admin-alert">{message}</div>}
        <form className="admin-form" onSubmit={submit}>
          <label className="admin-field admin-field--wide">
            <span>GLB / GLTF</span>
            <input
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              required
              onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="admin-field">
            <span>Asset name</span>
            <input name="name" required />
          </label>
          <label className="admin-field">
            <span>Version</span>
            <input name="version" defaultValue="1.0.0" required />
          </label>
          <label className="admin-field">
            <span>System ID</span>
            <input name="systemId" defaultValue="SYS_CARDIOVASCULAR" required />
          </label>
          <label className="admin-field">
            <span>Root structure ID</span>
            <input name="rootStructureId" defaultValue="ANAT_HEART" />
          </label>
          <label className="admin-field">
            <span>License</span>
            <input name="license" required />
          </label>
          <label className="admin-field">
            <span>Attribution / source</span>
            <input name="attribution" required />
          </label>
          {mappings.length > 0 && (
            <div className="admin-mesh-list">
              <h3>Mesh inspector · {mappings.length} meshes</h3>
              {mappings.map((mapping, index) => (
                <label key={`${mapping.meshName}-${index}`}>
                  <code>{mapping.meshName}</code>
                  <input
                    aria-label={`Structure for ${mapping.meshName}`}
                    placeholder="ANAT_STRUCTURE_ID"
                    value={mapping.structureId}
                    onChange={(event) =>
                      setMappings((values) =>
                        values.map((value, itemIndex) =>
                          itemIndex === index ? { ...value, structureId: event.target.value } : value,
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          )}
          <div className="admin-form-actions">
            <button className="admin-primary-button" disabled={upload.isPending}>
              {upload.isPending ? "Uploading…" : "Save asset draft"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

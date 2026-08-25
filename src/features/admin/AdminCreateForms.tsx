"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminRepository, type AdminResource } from "@/src/data-access/admin/adminRepository";

type CreatorKind = "system" | "structure" | "disease" | "physiology" | "reference";

function field(form: HTMLFormElement, name: string) {
  return String(new FormData(form).get(name) ?? "").trim();
}

function BilingualFields({ fields }: { fields: Array<[string, string, boolean?]> }) {
  return (
    <>
      {fields.flatMap(([name, label, long]) =>
        (["en", "ar"] as const).map((locale) => (
          <label key={`${name}-${locale}`} className={long ? "admin-field admin-field--wide" : "admin-field"}>
            <span>
              {label} · {locale.toUpperCase()}
            </span>
            {long ? (
              <textarea name={`${name}.${locale}`} required dir={locale === "ar" ? "rtl" : "ltr"} />
            ) : (
              <input name={`${name}.${locale}`} required dir={locale === "ar" ? "rtl" : "ltr"} />
            )}
          </label>
        )),
      )}
    </>
  );
}

const resourceForKind: Record<CreatorKind, AdminResource> = {
  system: "systems",
  structure: "anatomical_structures",
  disease: "diseases",
  physiology: "physiology_topics",
  reference: "references",
};

export function AdminCreateForm({ kind }: { kind: CreatorKind }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const bilingual = (name: string) => ({ en: field(form, `${name}.en`), ar: field(form, `${name}.ar`) });
      if (kind === "structure")
        return adminRepository.createStructure({
          id: field(form, "id"),
          systemId: field(form, "systemId"),
          parentId: field(form, "parentId"),
          slug: field(form, "slug"),
          canonicalName: field(form, "canonicalName"),
          latinName: field(form, "latinName"),
          name: bilingual("name"),
          description: bilingual("description"),
          anatomy: bilingual("anatomy"),
          physiology: bilingual("physiology"),
          location: bilingual("location"),
        });
      if (kind === "disease")
        return adminRepository.createDisease({
          id: field(form, "id"),
          slug: field(form, "slug"),
          canonicalName: field(form, "canonicalName"),
          name: bilingual("name"),
          summary: bilingual("summary"),
          etiology: bilingual("etiology"),
          pathogenesis: bilingual("pathogenesis"),
          morphology: bilingual("morphology"),
          functionalEffects: bilingual("functionalEffects"),
          affectedStructureIds: field(form, "affectedStructureIds")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        });
      if (kind === "physiology")
        return adminRepository.createPhysiology({
          id: field(form, "id"),
          slug: field(form, "slug"),
          canonicalName: field(form, "canonicalName"),
          name: bilingual("name"),
          summary: bilingual("summary"),
          mechanism: bilingual("mechanism"),
        });
      if (kind === "system")
        return adminRepository.createSystem({
          id: field(form, "id"),
          slug: field(form, "slug"),
          canonicalName: field(form, "canonicalName"),
          name: bilingual("name"),
          description: bilingual("description"),
        });
      return adminRepository.createReference({
        id: field(form, "id"),
        title: field(form, "title"),
        authors: field(form, "authors")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        publisher: field(form, "publisher"),
        edition: field(form, "edition"),
        publicationYear: field(form, "publicationYear") ? Number(field(form, "publicationYear")) : undefined,
        doi: field(form, "doi"),
        pmid: field(form, "pmid"),
        url: field(form, "url"),
      });
    },
    onSuccess: async () => {
      setMessage("Draft created successfully.");
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["admin-list", resourceForKind[kind]] });
    },
    onError: (error) => setMessage(error.message),
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(event.currentTarget);
  };
  const prefix =
    kind === "structure"
      ? "ANAT_"
      : kind === "disease"
        ? "DIS_"
        : kind === "physiology"
          ? "PHYS_"
          : kind === "system"
            ? "SYS_"
            : "REF_";

  return (
    <section className="admin-create">
      <div className="admin-create-head">
        <div>
          <h2>Create {kind} draft</h2>
          <p>Validated bilingual content is saved to PostgreSQL and enters the review workflow.</p>
        </div>
        <button className="admin-primary-button" onClick={() => setOpen((value) => !value)}>
          {open ? "Close editor" : `New ${kind}`}
        </button>
      </div>
      {message && (
        <div className="admin-alert" role="status">
          {message}
        </div>
      )}
      {open && (
        <form className="admin-form" onSubmit={submit}>
          {kind !== "reference" && (
            <>
              <label className="admin-field">
                <span>Stable ID</span>
                <input name="id" required defaultValue={prefix} />
              </label>
              <label className="admin-field">
                <span>Slug</span>
                <input name="slug" required />
              </label>
              <label className="admin-field admin-field--wide">
                <span>Canonical name</span>
                <input name="canonicalName" required />
              </label>
            </>
          )}
          {kind === "structure" && (
            <>
              <label className="admin-field">
                <span>System ID</span>
                <input name="systemId" required defaultValue="SYS_CARDIOVASCULAR" />
              </label>
              <label className="admin-field">
                <span>Parent ID</span>
                <input name="parentId" defaultValue="ANAT_HEART" />
              </label>
              <label className="admin-field">
                <span>Latin name</span>
                <input name="latinName" />
              </label>
              <BilingualFields
                fields={[
                  ["name", "Name"],
                  ["description", "Description", true],
                  ["anatomy", "Anatomy", true],
                  ["physiology", "Physiology", true],
                  ["location", "Location", true],
                ]}
              />
            </>
          )}
          {kind === "disease" && (
            <>
              <label className="admin-field admin-field--wide">
                <span>Affected structure IDs · comma separated</span>
                <input name="affectedStructureIds" required defaultValue="ANAT_HEART" />
              </label>
              <BilingualFields
                fields={[
                  ["name", "Name"],
                  ["summary", "Summary", true],
                  ["etiology", "Etiology", true],
                  ["pathogenesis", "Pathogenesis", true],
                  ["morphology", "Morphology", true],
                  ["functionalEffects", "Functional effects", true],
                ]}
              />
            </>
          )}
          {kind === "physiology" && (
            <BilingualFields
              fields={[
                ["name", "Name"],
                ["summary", "Summary", true],
                ["mechanism", "Mechanism", true],
              ]}
            />
          )}
          {kind === "system" && (
            <BilingualFields
              fields={[
                ["name", "Name"],
                ["description", "Description", true],
              ]}
            />
          )}
          {kind === "reference" && (
            <>
              <label className="admin-field">
                <span>Stable ID</span>
                <input name="id" required defaultValue={prefix} />
              </label>
              <label className="admin-field admin-field--wide">
                <span>Title</span>
                <input name="title" required />
              </label>
              <label className="admin-field admin-field--wide">
                <span>Authors · comma separated</span>
                <input name="authors" required />
              </label>
              {["publisher", "edition", "doi", "pmid", "url", "publicationYear"].map((name) => (
                <label className="admin-field" key={name}>
                  <span>{name}</span>
                  <input name={name} type={name === "publicationYear" ? "number" : "text"} />
                </label>
              ))}
            </>
          )}
          <div className="admin-form-actions">
            <button className="admin-primary-button" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save draft"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

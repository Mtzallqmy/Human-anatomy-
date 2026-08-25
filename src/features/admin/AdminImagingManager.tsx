"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, ScanLine, ShieldCheck, Upload } from "lucide-react";
import { adminRepository } from "@/src/data-access/admin/adminRepository";
import type { ImagingModality } from "@/src/types/medical";

async function scrubMetadata(file: File): Promise<File> {
  if (file.size > 25 * 1024 * 1024) throw new Error("Each source image must be 25 MB or smaller.");
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    throw new Error("Only PNG, JPEG, or WebP frames are accepted.");
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image normalization is unavailable.");
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error("Could not normalize image."))),
      "image/webp",
      0.9,
    ),
  );
  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
}

export function AdminImagingManager() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [annotationPoint, setAnnotationPoint] = useState<[number, number]>([0.5, 0.5]);
  const studies = useQuery({
    queryKey: ["admin-imaging"],
    queryFn: () => adminRepository.listImagingStudies(),
  });
  const coverage = useMemo(() => {
    const values = studies.data ?? [];
    return (["CT", "MRI", "XRAY", "HISTOLOGY", "PATHOLOGY"] as const).map((modality) => ({
      modality,
      count: values.filter((item) => item.modality === modality).length,
      published: values.filter((item) => item.modality === modality && item.status === "published").length,
    }));
  }, [studies.data]);
  const createStudy = useMutation({
    mutationFn: async (form: FormData) => {
      const id = String(form.get("id"));
      await adminRepository.createImagingStudy(
        {
          id,
          slug: String(form.get("slug")),
          modality: String(form.get("modality")),
          bodyRegion: String(form.get("bodyRegion")),
          title: { en: String(form.get("titleEn")), ar: String(form.get("titleAr")) },
          description: { en: String(form.get("descriptionEn")), ar: String(form.get("descriptionAr")) },
          classification: String(form.get("classification")),
          source: String(form.get("source")),
          license: String(form.get("license")),
          attribution: String(form.get("attribution")),
          deIdentified: form.get("deIdentified") === "on",
          educationalUse: form.get("educationalUse") === "on",
        },
        {
          id: String(form.get("seriesId")),
          orientation: String(form.get("orientation")) as
            "axial" | "coronal" | "sagittal" | "projection" | "microscopy",
          name: { en: String(form.get("seriesEn")), ar: String(form.get("seriesAr")) },
          sequence: String(form.get("sequence")),
        },
        String(form.get("structureIds"))
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      );
    },
    onSuccess: async () => {
      setMessage("Draft imaging study created.");
      await queryClient.invalidateQueries({ queryKey: ["admin-imaging"] });
    },
    onError: (error) => setMessage(error.message),
  });
  const upload = useMutation({
    mutationFn: async ({
      studyId,
      seriesId,
      files,
    }: {
      studyId: string;
      seriesId: string;
      files: File[];
    }) => {
      const normalized = [];
      for (const file of files) normalized.push(await scrubMetadata(file));
      await adminRepository.uploadImagingFrames(studyId, seriesId, normalized);
    },
    onSuccess: () => setMessage("Normalized, metadata-scrubbed frames uploaded as draft assets."),
    onError: (error) => setMessage(error.message),
  });
  const saveAnnotation = useMutation({
    mutationFn: async (form: FormData) =>
      adminRepository.saveImagingAnnotation(
        {
          id: String(form.get("annotationId")),
          frameIndex: Number(form.get("frameIndex")),
          structureId: String(form.get("annotationStructureId")),
          label: { en: String(form.get("labelEn")), ar: String(form.get("labelAr")) },
          description: {
            en: String(form.get("annotationDescriptionEn")),
            ar: String(form.get("annotationDescriptionAr")),
          },
          geometry: { type: "point", coordinates: [annotationPoint] },
          color: "#5bd3df",
        },
        String(form.get("annotationSeriesId")),
      ),
    onSuccess: () => setMessage("Normalized point annotation saved."),
    onError: (error) => setMessage(error.message),
  });

  const onCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createStudy.mutate(new FormData(event.currentTarget));
  };
  const onUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = event.currentTarget.elements.namedItem("frames") as HTMLInputElement;
    if (!input.files?.length) return;
    if (form.get("rightsConfirmed") !== "on") {
      setMessage("Confirm de-identification and educational-use rights before upload.");
      return;
    }
    upload.mutate({
      studyId: String(form.get("studyId")),
      seriesId: String(form.get("seriesId")),
      files: [...input.files],
    });
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>Multimodal content operations</p>
          <h1>Medical imaging</h1>
        </div>
      </header>
      {message && <div className="admin-alert">{message}</div>}
      <section className="admin-metric-grid">
        {coverage.map((item) => (
          <div className="admin-metric" key={item.modality}>
            <span>{item.modality} coverage</span>
            <strong>
              {item.published}/{item.count}
            </strong>
          </div>
        ))}
      </section>
      <section className="admin-workflow-card">
        <span>Licensing gate</span>
        <h2>Source · License · Attribution · De-identification</h2>
        <p>
          {
            (studies.data ?? []).filter(
              (item) => !item.source || !item.license || !item.attribution || !item.de_identified,
            ).length
          }{" "}
          studies need provenance remediation before publication.
        </p>
      </section>
      <section className="admin-create-card">
        <div className="admin-create-head">
          <div>
            <ImagePlus size={18} />
            <span>
              <strong>Create educational study</strong>
              <small>Creates a bilingual draft and its first series.</small>
            </span>
          </div>
        </div>
        <form className="admin-form" onSubmit={onCreate}>
          <label className="admin-field">
            <span>Study ID</span>
            <input name="id" required placeholder="IMG_CHEST_CT_MODULE" />
          </label>
          <label className="admin-field">
            <span>Slug</span>
            <input name="slug" required placeholder="chest-ct-module" />
          </label>
          <label className="admin-field">
            <span>Modality</span>
            <select name="modality" defaultValue="CT">
              {(["CT", "MRI", "XRAY", "HISTOLOGY", "PATHOLOGY"] as ImagingModality[]).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Body region</span>
            <input name="bodyRegion" required />
          </label>
          <label className="admin-field">
            <span>English title</span>
            <input name="titleEn" required />
          </label>
          <label className="admin-field">
            <span>Arabic title</span>
            <input name="titleAr" dir="rtl" required />
          </label>
          <label className="admin-field admin-field--wide">
            <span>English description</span>
            <textarea name="descriptionEn" required />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Arabic description</span>
            <textarea name="descriptionAr" dir="rtl" required />
          </label>
          <label className="admin-field">
            <span>Classification</span>
            <select name="classification">
              <option value="illustrative">Illustrative</option>
              <option value="radiologic">Radiologic</option>
              <option value="anatomical">Anatomical</option>
              <option value="conceptual_pathology">Conceptual pathology</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Linked structure IDs</span>
            <input name="structureIds" placeholder="ANAT_LUNG_RIGHT, ANAT_HEART" />
          </label>
          <label className="admin-field">
            <span>Source</span>
            <input name="source" required />
          </label>
          <label className="admin-field">
            <span>License</span>
            <input name="license" required />
          </label>
          <label className="admin-field">
            <span>Attribution</span>
            <input name="attribution" required />
          </label>
          <label className="admin-field">
            <span>Series ID</span>
            <input name="seriesId" required placeholder="SER_CHEST_CT_AXIAL" />
          </label>
          <label className="admin-field">
            <span>Series English</span>
            <input name="seriesEn" required />
          </label>
          <label className="admin-field">
            <span>Series Arabic</span>
            <input name="seriesAr" dir="rtl" required />
          </label>
          <label className="admin-field">
            <span>Orientation</span>
            <select name="orientation">
              <option>axial</option>
              <option>coronal</option>
              <option>sagittal</option>
              <option>projection</option>
              <option>microscopy</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Sequence</span>
            <input name="sequence" />
          </label>
          <label className="admin-check">
            <input type="checkbox" name="deIdentified" required /> De-identified
          </label>
          <label className="admin-check">
            <input type="checkbox" name="educationalUse" required /> Educational use rights
          </label>
          <button className="admin-primary-button" disabled={createStudy.isPending} type="submit">
            <ShieldCheck size={15} />
            Create controlled draft
          </button>
        </form>
      </section>
      <section className="admin-create-card">
        <div className="admin-create-head">
          <div>
            <ScanLine size={18} />
            <span>
              <strong>Point annotation editor</strong>
              <small>
                Click the normalized preview plane, then link the point to an anatomical structure.
              </small>
            </span>
          </div>
        </div>
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            saveAnnotation.mutate(new FormData(event.currentTarget));
          }}
        >
          <button
            type="button"
            className="admin-annotation-plane admin-field--wide"
            aria-label="Select normalized annotation point"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              setAnnotationPoint([
                Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)),
                Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)),
              ]);
            }}
          >
            <i
              style={{
                insetInlineStart: `${annotationPoint[0] * 100}%`,
                top: `${annotationPoint[1] * 100}%`,
              }}
            />
            <span>
              x {annotationPoint[0].toFixed(3)} · y {annotationPoint[1].toFixed(3)}
            </span>
          </button>
          <label className="admin-field">
            <span>Annotation ID</span>
            <input name="annotationId" required placeholder="ANN_CT_LUNG" />
          </label>
          <label className="admin-field">
            <span>Series ID</span>
            <input name="annotationSeriesId" required />
          </label>
          <label className="admin-field">
            <span>Frame index</span>
            <input name="frameIndex" type="number" min="0" required />
          </label>
          <label className="admin-field">
            <span>Structure ID</span>
            <input name="annotationStructureId" required placeholder="ANAT_LUNG_RIGHT" />
          </label>
          <label className="admin-field">
            <span>English label</span>
            <input name="labelEn" required />
          </label>
          <label className="admin-field">
            <span>Arabic label</span>
            <input name="labelAr" dir="rtl" required />
          </label>
          <label className="admin-field admin-field--wide">
            <span>English description</span>
            <textarea name="annotationDescriptionEn" />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Arabic description</span>
            <textarea name="annotationDescriptionAr" dir="rtl" />
          </label>
          <button className="admin-primary-button" disabled={saveAnnotation.isPending} type="submit">
            Save annotation
          </button>
        </form>
      </section>
      <section className="admin-create-card">
        <div className="admin-create-head">
          <div>
            <Upload size={18} />
            <span>
              <strong>Upload web-ready frame batch</strong>
              <small>
                Maximum 100 files and 25 MB each. PNG/JPEG/WebP is normalized to WebP and EXIF is removed.
              </small>
            </span>
          </div>
        </div>
        <form className="admin-form" onSubmit={onUpload}>
          <label className="admin-field">
            <span>Study ID</span>
            <input name="studyId" required />
          </label>
          <label className="admin-field">
            <span>Series ID</span>
            <input name="seriesId" required />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Frames</span>
            <input name="frames" type="file" accept="image/png,image/jpeg,image/webp" multiple required />
          </label>
          <label className="admin-check admin-field--wide">
            <input type="checkbox" name="rightsConfirmed" required /> I confirm these are licensed,
            de-identified educational assets and contain no patient-identifying content.
          </label>
          <button className="admin-primary-button" disabled={upload.isPending} type="submit">
            <ScanLine size={15} />
            Normalize and upload
          </button>
        </form>
      </section>
      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Study</th>
              <th>Modality</th>
              <th>Region</th>
              <th>Status</th>
              <th>Review due</th>
            </tr>
          </thead>
          <tbody>
            {(studies.data ?? []).map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.id}</strong>
                </td>
                <td>{item.modality}</td>
                <td>{item.body_region}</td>
                <td>{item.status}</td>
                <td>{item.review_due_at?.slice(0, 10) ?? "Not set"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

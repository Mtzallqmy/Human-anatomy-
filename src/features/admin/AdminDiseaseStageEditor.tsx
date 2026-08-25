"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { adminRepository } from "@/src/data-access/admin/adminRepository";

export function AdminDiseaseStageEditor() {
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (form: HTMLFormElement) => {
      const data = new FormData(form);
      let visualConfig: Record<string, unknown> = {};
      try {
        visualConfig = JSON.parse(String(data.get("visualConfig") || "{}")) as Record<string, unknown>;
      } catch {
        throw new Error("Visual configuration must be valid JSON.");
      }
      return adminRepository.createDiseaseStage({
        id: String(data.get("id")),
        diseaseId: String(data.get("diseaseId")),
        order: Number(data.get("order")),
        progressMin: Number(data.get("progressMin")),
        progressMax: Number(data.get("progressMax")),
        name: { en: String(data.get("name.en")), ar: String(data.get("name.ar")) },
        description: { en: String(data.get("description.en")), ar: String(data.get("description.ar")) },
        visualConfig,
      });
    },
    onSuccess: () => setMessage("Disease stage saved."),
    onError: (error) => setMessage(error.message),
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(event.currentTarget);
  };
  return (
    <section className="admin-create">
      <div className="admin-create-head">
        <div>
          <h2>Disease stage editor</h2>
          <p>Manage order, progress range, bilingual explanation, and the data-driven visual preset.</p>
        </div>
      </div>
      {message && <div className="admin-alert">{message}</div>}
      <form className="admin-form" onSubmit={submit}>
        <label className="admin-field">
          <span>Stage ID</span>
          <input name="id" defaultValue="STAGE_" required />
        </label>
        <label className="admin-field">
          <span>Disease ID</span>
          <input name="diseaseId" defaultValue="DIS_" required />
        </label>
        <label className="admin-field">
          <span>Order</span>
          <input name="order" type="number" min="0" required />
        </label>
        <label className="admin-field">
          <span>Progress min</span>
          <input name="progressMin" type="number" min="0" max="1" step="0.001" required />
        </label>
        <label className="admin-field">
          <span>Progress max</span>
          <input name="progressMax" type="number" min="0" max="1" step="0.001" required />
        </label>
        <label className="admin-field">
          <span>Name · EN</span>
          <input name="name.en" required />
        </label>
        <label className="admin-field">
          <span>Name · AR</span>
          <input name="name.ar" dir="rtl" required />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Description · EN</span>
          <textarea name="description.en" required />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Description · AR</span>
          <textarea name="description.ar" dir="rtl" required />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Visual configuration · JSON</span>
          <textarea
            name="visualConfig"
            defaultValue={'{"materialPreset":"inflammation","color":"#9b3f42"}'}
            required
          />
        </label>
        <div className="admin-form-actions">
          <button className="admin-primary-button" disabled={mutation.isPending}>
            Save stage
          </button>
        </div>
      </form>
    </section>
  );
}

"use client";

import { useState } from "react";
import { FileJson, Upload } from "lucide-react";
import { adminRepository } from "@/src/data-access/admin/adminRepository";
import { parseStructureImport, validateStructureImport } from "@/src/features/admin/bulkStructureImport";
import { bodySystems } from "@/src/data/systems/systems";

export function BulkStructureImport() {
  const [status, setStatus] = useState("");
  const [validated, setValidated] = useState<ReturnType<typeof validateStructureImport> | null>(null);
  const onFile = async (file: File) => {
    try {
      const type = file.name.toLowerCase().endsWith(".json") ? "json" : "csv";
      const result = validateStructureImport(
        parseStructureImport(await file.text(), type),
        bodySystems.map((item) => item.id),
      );
      setValidated(result);
      setStatus(
        result.issues.length
          ? `${result.issues.length} validation issues found.`
          : `${result.rows.length} rows are ready to import.`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Import could not be parsed.");
    }
  };
  return (
    <section className="admin-create-card">
      <div className="admin-create-head">
        <div>
          <FileJson size={18} />
          <span>
            <strong>Bulk structure import</strong>
            <small>Validated CSV or JSON for large anatomical hierarchies.</small>
          </span>
        </div>
      </div>
      <div className="admin-form">
        <label className="admin-field admin-field--wide">
          <span>CSV or JSON catalog</span>
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onFile(file);
            }}
          />
        </label>
        {status && <p className="admin-field--wide">{status}</p>}
        {validated?.issues.length ? (
          <ul className="admin-field--wide admin-import-errors">
            {validated.issues.slice(0, 20).map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        ) : null}
        <button
          type="button"
          className="admin-primary-button"
          disabled={!validated?.rows.length || Boolean(validated.issues.length)}
          onClick={async () => {
            if (!validated) return;
            setStatus("Importing validated drafts…");
            try {
              for (const row of validated.rows) await adminRepository.createStructure(row);
              setStatus(`${validated.rows.length} draft structures imported.`);
            } catch (error) {
              setStatus(error instanceof Error ? error.message : "Import failed.");
            }
          }}
        >
          <Upload size={15} />
          Import drafts
        </button>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Images, TriangleAlert } from "lucide-react";
import { getImagingStudiesForStructure } from "@/src/data/imaging/imagingStudies";
import { useLocale } from "@/src/hooks/useLocale";

export function ImagingPanel({ structureId }: { structureId: string }) {
  const { t, localize } = useLocale();
  const studies = getImagingStudiesForStructure(structureId);
  if (!studies.length)
    return (
      <div className="medical-content">
        <p>{t("imaging.unavailable")}</p>
      </div>
    );
  return (
    <div className="medical-content">
      <section className="content-section">
        <h3>{t("imaging.availableStudies")}</h3>
        <div className="imaging-study-links">
          {studies.map((study) => (
            <Link key={study.id} href={`/imaging/${study.id}`}>
              <Images size={18} />
              <span>
                <strong>{localize(study.title)}</strong>
                <small>
                  {study.modality} · {localize(study.description)}
                </small>
              </span>
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>
      <p className="clinical-disclaimer">
        <TriangleAlert size={13} />
        {t("imaging.educationOnly")}
      </p>
    </div>
  );
}

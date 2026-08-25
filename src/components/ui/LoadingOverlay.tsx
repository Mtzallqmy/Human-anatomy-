"use client";

import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";

export function LoadingOverlay({ error = false }: { error?: boolean }) {
  const { t } = useLocale();
  return (
    <div className="viewer-loading" role={error ? "alert" : "status"}>
      {error ? <TriangleAlert size={22} /> : <LoaderCircle size={23} className="loading-spinner" />}
      <p>{t(error ? "atlas.modelError" : "common.loading")}</p>
    </div>
  );
}

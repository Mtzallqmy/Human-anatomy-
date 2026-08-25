export type AnalyticsEvent =
  | "system_selected"
  | "structure_selected"
  | "imaging_opened"
  | "study_opened"
  | "series_changed"
  | "frame_changed"
  | "annotation_clicked"
  | "sync_3d_enabled"
  | "modality_changed";

export function trackEducationalEvent(
  event: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("anatomica:analytics", { detail: { event, properties, timestamp: Date.now() } }),
  );
}

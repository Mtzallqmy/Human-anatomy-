import type { LocalizedText } from "@/src/types/medical";

export function BilingualMedicalText({ value, compact = false }: { value: LocalizedText; compact?: boolean }) {
  return (
    <span className={`bilingual-medical-text${compact ? " bilingual-medical-text--compact" : ""}`}>
      <span className="bilingual-medical-text__en" lang="en" dir="ltr">{value.en}</span>
      <span className="bilingual-medical-text__ar" lang="ar" dir="rtl">{value.ar}</span>
    </span>
  );
}

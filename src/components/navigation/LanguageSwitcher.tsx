"use client";

import { Globe2 } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { useUIStore } from "@/src/store/uiStore";

export function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const setLanguage = useUIStore((state) => state.setLanguage);

  return (
    <button
      className="language-switcher"
      type="button"
      aria-label={t("common.language")}
      onClick={() => setLanguage(locale === "en" ? "ar" : "en")}
    >
      <Globe2 size={15} strokeWidth={1.7} aria-hidden="true" />
      <span>{locale === "en" ? "العربية" : "EN"}</span>
    </button>
  );
}

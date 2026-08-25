"use client";

import { useTranslation } from "react-i18next";
import { useUIStore } from "@/src/store/uiStore";
import type { LocalizedText } from "@/src/types/medical";

export function useLocale() {
  const { t } = useTranslation();
  const locale = useUIStore((state) => state.language);
  return { t, locale, localize: (value: LocalizedText) => value[locale], isRTL: locale === "ar" };
}

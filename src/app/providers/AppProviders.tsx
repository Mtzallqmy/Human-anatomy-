"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/src/i18n";
import { useUIStore } from "@/src/store/uiStore";
import type { Locale } from "@/src/types/medical";

function LanguageSynchronizer() {
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  useEffect(() => {
    const saved = window.localStorage.getItem("anatomica:v1:language");
    if (saved === "ar" || saved === "en") setLanguage(saved as Locale);
  }, [setLanguage]);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("anatomica:v1:language", language);
  }, [language]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageSynchronizer />
      {children}
    </I18nextProvider>
  );
}

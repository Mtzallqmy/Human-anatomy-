import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/src/i18n/ar/common";
import en from "@/src/i18n/en/common";

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18next;

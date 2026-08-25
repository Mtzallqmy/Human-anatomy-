"use client";

import { Eye, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light" | "comfort";
const options: Array<{ id: ThemeMode; en: string; ar: string; icon: typeof Sun }> = [
  { id: "light", en: "Light", ar: "فاتح", icon: Sun },
  { id: "comfort", en: "Comfort", ar: "مريح للعين", icon: Eye },
  { id: "dark", en: "Dark", ar: "داكن", icon: Moon },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeMode>("comfort");

  useEffect(() => {
    const stored = window.localStorage.getItem("anatomica-theme") as ThemeMode | null;
    const next = stored && options.some((item) => item.id === stored) ? stored : "comfort";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  const apply = (next: ThemeMode) => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("anatomica-theme", next);
  };

  return (
    <div className="theme-switcher" role="group" aria-label="Display theme / نمط العرض">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button key={option.id} type="button" className={theme === option.id ? "is-active" : ""} onClick={() => apply(option.id)} title={`${option.en} — ${option.ar}`} aria-pressed={theme === option.id}>
            <Icon size={14} aria-hidden="true" />
            <span>{option.en}</span>
          </button>
        );
      })}
    </div>
  );
}

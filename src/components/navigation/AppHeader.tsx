"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, HeartPulse, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/src/components/navigation/LanguageSwitcher";
import { useLocale } from "@/src/hooks/useLocale";
import { useUIStore } from "@/src/store/uiStore";

export function AppHeader({ atlas = false }: { atlas?: boolean }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  const links = [
    { href: "/atlas", label: t("nav.atlas") },
    { href: "/atlas/human-body", label: t("nav.systems") },
    { href: "/imaging/IMG_CHEST_CT_EDU", label: t("nav.imaging") },
    { href: "/references", label: t("nav.references") },
  ];

  return (
    <header className={`app-header${atlas ? " app-header--atlas" : ""}`}>
      <Link
        href="/"
        className="brand-mark"
        aria-label={t("brand.full")}
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="brand-icon">
          <HeartPulse size={20} strokeWidth={1.7} />
        </span>
        <span className="brand-copy">
          <strong>{t("brand.short")}</strong>
          <small>{t("brand.subtitle")}</small>
        </span>
      </Link>
      <nav
        className={`main-navigation${mobileMenuOpen ? " main-navigation--open" : ""}`}
        aria-label={t("nav.home")}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href ||
              (link.href === "/atlas" && pathname === "/atlas") ||
              (link.href.startsWith("/imaging") && pathname.startsWith("/imaging"))
                ? "nav-link nav-link--active"
                : "nav-link"
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        {!atlas && (
          <Link href="/atlas" className="header-atlas-link">
            {t("nav.openAtlas")} <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        )}
        <button
          type="button"
          className="mobile-menu-trigger"
          aria-label={mobileMenuOpen ? t("common.close") : t("nav.systems")}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
}

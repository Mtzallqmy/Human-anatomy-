"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Search, X, Heart, Bone, Brain, ScanLine, Stethoscope, Layers3 } from "lucide-react";
import { supabaseMedicalRepository } from "@/src/data-access/medical/supabaseMedicalRepository";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { SearchResult } from "@/src/types/medical";
import { imagingStudies } from "@/src/data/imaging/imagingStudies";
import { physiologyAnimations } from "@/src/data/anatomy/humanBodyCatalog";

function searchLocalCatalog(
  query: string,
  structures: ReturnType<typeof useContentStore.getState>["structures"],
  systems: ReturnType<typeof useContentStore.getState>["systems"],
  diseases: ReturnType<typeof useContentStore.getState>["diseases"],
): SearchResult[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (normalized.length < 2) return [];
  const matches = (en: string, ar: string, latin?: string) =>
    en.toLocaleLowerCase().includes(normalized) ||
    ar.includes(normalized) ||
    latin?.toLocaleLowerCase().includes(normalized);
  return [
    ...structures
      .filter((item) => matches(item.name.en, item.name.ar, item.latinName))
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "structure" as const,
        systemId: item.systemId,
        href: `/atlas/structure/${item.id}`,
      })),
    ...systems
      .filter((item) => matches(item.name.en, item.name.ar))
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "system" as const,
        systemId: item.id,
        href: `/systems/${item.slug}`,
      })),
    ...diseases
      .filter((item) => matches(item.name.en, item.name.ar))
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "disease" as const,
        href: `/disease/${item.id}`,
      })),
    ...physiologyAnimations
      .filter((item) => matches(item.name.en, item.name.ar))
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "physiology" as const,
        systemId: item.systemId,
        href: `/atlas/${systems.find((system) => system.id === item.systemId)?.slug ?? "human-body"}`,
      })),
    ...imagingStudies
      .filter((item) => matches(item.title.en, item.title.ar))
      .map((item) => ({
        id: item.id,
        name: item.title,
        type: "imaging" as const,
        href: `/imaging/${item.id}`,
      })),
  ].slice(0, 12);
}

export function SearchBar() {
  const { t, localize } = useLocale();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const query = useContentStore((state) => state.searchQuery);
  const structures = useContentStore((state) => state.structures);
  const systems = useContentStore((state) => state.systems);
  const diseases = useContentStore((state) => state.diseases);
  const dataSource = useContentStore((state) => state.dataSource);
  const setQuery = useContentStore((state) => state.setSearchQuery);
  const setStructure = useViewerStore((state) => state.setSelectedStructure);
  const localResults = useMemo(
    () => searchLocalCatalog(query, structures, systems, diseases),
    [diseases, query, structures, systems],
  );
  const remoteSearch = useQuery({
    queryKey: ["medical-search", debouncedQuery],
    queryFn: () => supabaseMedicalRepository.search(debouncedQuery),
    enabled: dataSource === "supabase" && debouncedQuery.length >= 2,
    staleTime: 60_000,
  });
  const results = remoteSearch.data ?? localResults;
  const grouped = {
    structure: results.filter((r) => r.type === "structure"),
    system: results.filter((r) => r.type === "system"),
    disease: results.filter((r) => r.type === "disease"),
    imaging: results.filter((r) => r.type === "imaging"),
    physiology: results.filter((r) => r.type === "physiology"),
  };
  const typeIcon: Record<string, typeof Search> = {
    structure: Layers3,
    system: Heart,
    disease: Stethoscope,
    imaging: ScanLine,
    physiology: Brain,
  } as unknown as Record<string, typeof Search>;
  const typeLabel: Record<string, string> = {
    structure: t("search.typeStructure"),
    system: t("search.typeSystem"),
    disease: t("search.typeDisease"),
    imaging: t("search.typeImaging"),
    physiology: "Physiology",
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 220);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    function handleOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleOutside);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div className="atlas-search" ref={containerRef}>
      <div className="search-input-wrap">
        <Search size={15} aria-hidden="true" />
        <input
          ref={inputRef}
          role="combobox"
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search.compactPlaceholder")}
          aria-label={t("search.placeholder")}
          aria-expanded={open && query.length > 1}
          aria-controls="medical-search-results"
        />
        <button
          className="search-accessory"
          type="button"
          aria-label={query ? t("common.close") : t("common.search")}
          onClick={() => {
            if (query) setQuery("");
            else inputRef.current?.focus();
          }}
        >
          {query ? <X size={13} /> : <span>⌘K</span>}
        </button>
      </div>
      {open && query.trim().length > 1 && (
        <div
          className="search-results"
          id="medical-search-results"
          role="listbox"
          aria-label={t("search.results")}
        >
          {results.length === 0 ? (
            <div className="search-empty">
              <p>{t("common.noResults")}</p>
              <small style={{ color: "var(--subtle)", fontSize: "0.68rem" }}>
                {t("search.compactPlaceholder")}
              </small>
            </div>
          ) : (
            (Object.entries(grouped) as [string, typeof results][]).map(([type, list]) =>
              list.length ? (
                <div key={type} role="group" aria-label={typeLabel[type]}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 8px 4px",
                      color: "var(--subtle)",
                      fontSize: "0.62rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {(() => {
                      const Icon = typeIcon[type] ?? Search;
                      return <Icon size={11} />;
                    })()}
                    {typeLabel[type]} · {list.length}
                  </div>
                  {list.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      type="button"
                      className="search-result"
                      role="option"
                      aria-selected="false"
                      onClick={() => {
                        if (result.type === "structure") setStructure(result.id);
                        setOpen(false);
                        setQuery("");
                        router.push(result.href);
                      }}
                    >
                      <span>
                        <strong>{localize(result.name)}</strong>
                        <small>{result.systemId ?? result.type}</small>
                      </span>
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              ) : null,
            )
          )}
        </div>
      )}
    </div>
  );
}

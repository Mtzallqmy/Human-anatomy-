"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";

export function SearchBar() {
  const { t, localize } = useLocale();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const query = useContentStore((state) => state.searchQuery);
  const setQuery = useContentStore((state) => state.setSearchQuery);
  const setStructure = useViewerStore((state) => state.setSelectedStructure);
  const results = useMemo(() => medicalRepository.search(query), [query]);

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
            <p className="search-empty">{t("common.noResults")}</p>
          ) : (
            results.map((result) => (
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
                  <small>{t(`search.type${result.type[0].toUpperCase()}${result.type.slice(1)}`)}</small>
                </span>
                <ArrowUpRight size={14} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

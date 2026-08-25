"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bone,
  Brain,
  ChevronRight,
  Circle,
  CircleDot,
  Droplets,
  GitBranch,
  Heart,
  Layers3,
  Scan,
  Sparkles,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "@/src/components/navigation/SearchBar";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";
import { trackEducationalEvent } from "@/src/services/analytics";

const icons: Record<string, LucideIcon> = {
  heart: Heart,
  bone: Bone,
  activity: Activity,
  brain: Brain,
  wind: Wind,
  "circle-dot": CircleDot,
  droplets: Droplets,
  sparkles: Sparkles,
  "git-branch": GitBranch,
  circle: Circle,
  scan: Scan,
};

function StructureNode({
  structure,
  structures,
  selectedId,
  depth,
  onSelect,
}: {
  structure: AnatomicalStructure;
  structures: AnatomicalStructure[];
  selectedId: string;
  depth: number;
  onSelect: (item: AnatomicalStructure) => void;
}) {
  const { localize } = useLocale();
  const [expanded, setExpanded] = useState(depth === 0);
  const children = structures.filter((item) => item.parentId === structure.id);
  return (
    <div className="structure-tree-node">
      <div className="structure-tree-row" style={{ paddingInlineStart: `${depth * 13}px` }}>
        {children.length ? (
          <button
            type="button"
            className="tree-expand"
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronRight size={13} className={expanded ? "tree-chevron--open" : ""} />
          </button>
        ) : (
          <span className="tree-spacer" />
        )}
        <button
          type="button"
          className={`structure-item${structure.id === selectedId ? " structure-item--active" : ""}`}
          onClick={() => onSelect(structure)}
        >
          <span className="structure-indicator" />
          {localize(structure.name)}
        </button>
      </div>
      {expanded &&
        children.map((child) => (
          <StructureNode
            key={child.id}
            structure={child}
            structures={structures}
            selectedId={selectedId}
            depth={depth + 1}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

export function SystemSidebar() {
  const { t, localize } = useLocale();
  const router = useRouter();
  const systems = useContentStore((state) => state.systems);
  const allStructures = useContentStore((state) => state.structures);
  const contentError = useContentStore((state) => state.error);
  const selectedSystemId = useViewerStore((state) => state.selectedSystemId);
  const selectedStructureId = useViewerStore((state) => state.selectedStructureId);
  const selectSystem = useViewerStore((state) => state.setSelectedSystem);
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const showAllStructures = useViewerStore((state) => state.showAllStructures);
  const visibleSystemIds = useViewerStore((state) => state.visibleSystemIds);
  const systemOpacity = useViewerStore((state) => state.systemOpacity);
  const toggleSystemLayer = useViewerStore((state) => state.toggleSystemLayer);
  const setSystemOpacity = useViewerStore((state) => state.setSystemOpacity);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const structures = useMemo(
    () => allStructures.filter((structure) => structure.systemId === selectedSystemId),
    [allStructures, selectedSystemId],
  );
  const roots = structures.filter((structure) => !structure.parentId);
  const layerSystems = systems.filter((system) => system.available && !["SYS_FULL_BODY"].includes(system.id));

  const chooseStructure = (structure: AnatomicalStructure) => {
    if (!structure.parentId) showAllStructures();
    selectStructure(structure.id);
    trackEducationalEvent("structure_selected", { structureId: structure.id, systemId: structure.systemId });
    setSidebarOpen(false);
    useUIStore.getState().setInformationPanelOpen(true);
    router.push(`/atlas/structure/${structure.id}`);
  };

  return (
    <aside
      className={`system-sidebar${sidebarOpen ? " system-sidebar--open" : ""}`}
      aria-label={t("atlas.systems")}
    >
      <div className="sidebar-top">
        <p className="sidebar-title">{t("atlas.systems")}</p>
        <button
          type="button"
          className="sidebar-mobile-close"
          aria-label={t("common.close")}
          onClick={() => setSidebarOpen(false)}
        >
          <X size={17} />
        </button>
      </div>
      <SearchBar />
      {contentError && <p className="content-source-warning">{contentError}</p>}
      <div className="systems-list">
        {systems.map((system) => {
          const Icon = icons[system.icon] ?? Circle;
          return (
            <button
              key={system.id}
              type="button"
              className={`system-item${system.id === selectedSystemId ? " system-item--active" : ""}`}
              disabled={!system.available}
              onClick={() => {
                selectSystem(system.id, system.rootStructureIds[0]);
                trackEducationalEvent("system_selected", { systemId: system.id });
                router.push(`/atlas/${system.slug}`);
              }}
            >
              <Icon size={15} strokeWidth={1.7} />
              <span>{localize(system.name)}</span>
              {system.available ? (
                <i className="system-availability" />
              ) : (
                <small>{t("common.comingSoon")}</small>
              )}
            </button>
          );
        })}
      </div>

      {selectedSystemId === "SYS_FULL_BODY" && (
        <section className="layer-manager" aria-label={t("atlas.layers")}>
          <div className="structure-list-heading">
            <p>
              <Layers3 size={14} /> {t("atlas.layers")}
            </p>
            <span>{visibleSystemIds.length}</span>
          </div>
          {layerSystems.map((system) => {
            const visible = visibleSystemIds.includes(system.id);
            return (
              <div className="layer-control" key={system.id}>
                <label>
                  <input type="checkbox" checked={visible} onChange={() => toggleSystemLayer(system.id)} />
                  <span style={{ backgroundColor: system.accentColor }} />
                  {localize(system.name)}
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="1"
                  step="0.05"
                  disabled={!visible}
                  value={systemOpacity[system.id] ?? 0.82}
                  aria-label={`${localize(system.name)} opacity`}
                  onChange={(event) => setSystemOpacity(system.id, Number(event.target.value))}
                />
              </div>
            );
          })}
        </section>
      )}

      <div className="sidebar-divider" />
      <div className="structure-list-heading">
        <p>{t("atlas.structuresTitle")}</p>
        <span>{structures.length}</span>
      </div>
      <div className="structure-list structure-tree">
        {roots.map((structure) => (
          <StructureNode
            key={structure.id}
            structure={structure}
            structures={structures}
            selectedId={selectedStructureId}
            depth={0}
            onSelect={chooseStructure}
          />
        ))}
      </div>
      <div className="sidebar-footer">{t("common.educationOnly")}</div>
    </aside>
  );
}

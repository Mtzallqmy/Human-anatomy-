"use client";

import {
  Activity,
  Bone,
  Brain,
  Circle,
  CircleDot,
  Droplets,
  GitBranch,
  Heart,
  Sparkles,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "@/src/components/navigation/SearchBar";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";

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
};

export function SystemSidebar() {
  const { t, localize } = useLocale();
  const systems = medicalRepository.getSystems();
  const selectedSystemId = useViewerStore((state) => state.selectedSystemId);
  const selectedStructureId = useViewerStore((state) => state.selectedStructureId);
  const selectSystem = useViewerStore((state) => state.setSelectedSystem);
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const structures = medicalRepository.getSystemStructures(selectedSystemId);

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
      <div className="systems-list">
        {systems.map((system) => {
          const Icon = icons[system.icon] ?? Circle;
          return (
            <button
              key={system.id}
              type="button"
              className={`system-item${system.id === selectedSystemId ? " system-item--active" : ""}`}
              disabled={!system.available}
              onClick={() => selectSystem(system.id)}
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
      <div className="sidebar-divider" />
      <div className="structure-list-heading">
        <p>{t("atlas.structuresTitle")}</p>
        <span>{structures.length}</span>
      </div>
      <div className="structure-list">
        {structures.map((structure) => (
          <button
            key={structure.id}
            type="button"
            className={`structure-item${structure.id === selectedStructureId ? " structure-item--active" : ""}`}
            onClick={() => {
              selectStructure(structure.id);
              setSidebarOpen(false);
            }}
          >
            <span className="structure-indicator" />
            {localize(structure.name)}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">{t("common.educationOnly")}</div>
    </aside>
  );
}

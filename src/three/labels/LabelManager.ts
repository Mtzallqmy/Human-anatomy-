import * as THREE from "three";
import type { AnatomicalStructure, LabelMode, Locale } from "@/src/types/medical";

interface LabelEntry {
  element: HTMLButtonElement;
  anchor: THREE.Vector3;
  id: string;
}

export class LabelManager {
  private readonly layer: HTMLElement;
  private readonly camera: THREE.Camera;
  private readonly structures: AnatomicalStructure[];
  private readonly onSelect: (id: string) => void;
  private entries: LabelEntry[] = [];
  private mode: LabelMode = "off";
  private locale: Locale = "en";

  constructor(
    layer: HTMLElement,
    camera: THREE.Camera,
    structures: AnatomicalStructure[],
    onSelect: (id: string) => void,
  ) {
    this.layer = layer;
    this.camera = camera;
    this.structures = structures;
    this.onSelect = onSelect;
  }

  setMode(mode: LabelMode, locale = this.locale) {
    this.mode = mode;
    this.locale = locale;
    this.clear();
    if (mode === "off") return;

    for (const structure of this.structures) {
      if (
        !structure.labelAnchor ||
        (mode === "study" && !structure.studyNumber) ||
        (mode === "simple" && !structure.studyNumber)
      )
        continue;
      const element = document.createElement("button");
      element.type = "button";
      element.className = `anatomy-label anatomy-label--${mode}`;
      element.textContent = mode === "study" ? String(structure.studyNumber) : structure.name[locale];
      element.setAttribute("aria-label", structure.name[locale]);
      element.addEventListener("click", () => this.onSelect(structure.id));
      this.layer.appendChild(element);
      this.entries.push({
        element,
        anchor: new THREE.Vector3(...structure.labelAnchor).add(new THREE.Vector3(0, -0.2, 0)),
        id: structure.id,
      });
    }
  }

  setLocale(locale: Locale) {
    this.setMode(this.mode, locale);
  }

  update(width: number, height: number) {
    for (const entry of this.entries) {
      const projected = entry.anchor.clone().project(this.camera);
      entry.element.style.transform = `translate(${(projected.x * 0.5 + 0.5) * width}px, ${(-projected.y * 0.5 + 0.5) * height}px)`;
      entry.element.style.opacity = projected.z > 1 ? "0" : "1";
    }
  }

  private clear() {
    for (const entry of this.entries) entry.element.remove();
    this.entries = [];
  }
  dispose() {
    this.clear();
  }
}

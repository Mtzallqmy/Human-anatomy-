export type Locale = "en" | "ar";

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface ScientificReference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  edition?: string;
  publisher?: string;
  doi?: string;
  pubmedId?: string;
  url?: string;
  category: "anatomy" | "physiology" | "pathology" | "terminology";
}

export interface BodySystem {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  available: boolean;
  organIds: string[];
  accentColor: string;
}

export interface AnatomicalStructure {
  id: string;
  name: LocalizedText;
  latinName?: string;
  description: LocalizedText;
  anatomy: LocalizedText;
  physiology: LocalizedText;
  location: LocalizedText;
  bloodSupply?: LocalizedText;
  innervation?: LocalizedText;
  systemId: string;
  parentId?: string;
  childrenIds: string[];
  relatedStructureIds: string[];
  relatedDiseaseIds: string[];
  meshIds: string[];
  referenceIds: string[];
  labelAnchor?: [number, number, number];
  studyNumber?: number;
}

export interface DiseaseVisualState {
  morphTarget?: string;
  materialPreset?: string;
  animationPreset?: string;
  color?: string;
}

export interface DiseaseStage {
  id: string;
  order: number;
  name: LocalizedText;
  description: LocalizedText;
  visualState?: DiseaseVisualState;
}

export interface Disease {
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  etiology: LocalizedText;
  pathogenesis: LocalizedText;
  morphology: LocalizedText;
  functionalEffects: LocalizedText;
  affectedStructureIds: string[];
  stages: DiseaseStage[];
  referenceIds: string[];
}

export interface ModelAsset {
  id: string;
  url: string | null;
  systemId: string;
  structureIds: string[];
  format: "glb" | "gltf" | "procedural";
  attribution: LocalizedText;
  license: string;
}

export interface SearchResult {
  id: string;
  name: LocalizedText;
  type: "structure" | "system" | "disease";
  systemId?: string;
  href: string;
}

export type QualityMode = "low" | "medium" | "high";
export type LabelMode = "off" | "simple" | "study";
export type MedicalTab = "anatomy" | "physiology" | "pathology" | "references";

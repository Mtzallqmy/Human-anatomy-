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
  rootStructureIds: string[];
  status: "draft" | "review" | "published";
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
  scaleMultiplier?: number;
}

export type VisualizationType =
  "morph" | "material" | "model_variant" | "shader" | "animation" | "annotation_only";

export type VisualizationAccuracy = "anatomically_modeled" | "conceptual" | "illustrative";

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
  visualizationType?: VisualizationType;
  visualizationAccuracy?: VisualizationAccuracy;
}

export interface ModelAsset {
  id: string;
  url: string | null;
  systemId: string;
  rootStructureId: string;
  structureIds: string[];
  format: "glb" | "gltf" | "procedural";
  attribution: LocalizedText;
  license: string;
  version?: string;
  lod?: "simplified" | "standard" | "detailed";
}

export type StructureRelationshipType =
  | "part_of"
  | "adjacent_to"
  | "supplies"
  | "drains_into"
  | "innervates"
  | "connected_to"
  | "passes_through"
  | "controls";

export interface StructureRelationship {
  sourceStructureId: string;
  targetStructureId: string;
  type: StructureRelationshipType;
}

export interface PhysiologyStep {
  id: string;
  structureId: string;
  name: LocalizedText;
  description: LocalizedText;
  order: number;
}

export interface PhysiologyAnimation {
  id: string;
  systemId: string;
  name: LocalizedText;
  structureIds: string[];
  duration: number;
  steps: PhysiologyStep[];
}

export type ImagingModality = "CT" | "MRI" | "XRAY" | "HISTOLOGY" | "PATHOLOGY";
export type ImagingClassification = "anatomical" | "radiologic" | "illustrative" | "conceptual_pathology";

export interface ImagingAnnotationGeometry {
  type: "point" | "rectangle" | "polygon";
  coordinates: number[][];
}

export interface ImagingAnnotation {
  id: string;
  frameIndex: number;
  structureId: string;
  label: LocalizedText;
  description: LocalizedText;
  geometry: ImagingAnnotationGeometry;
  color: string;
}

export interface ImagingFrame {
  id: string;
  index: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  generatedVariant?: "chest-ct" | "brain-mri" | "chest-xray" | "liver-histology" | "kidney-histology";
}

export interface ImagingSeries {
  id: string;
  studyId: string;
  name: LocalizedText;
  orientation: "axial" | "coronal" | "sagittal" | "projection" | "microscopy";
  sequence?: string;
  frames: ImagingFrame[];
  annotations: ImagingAnnotation[];
}

export interface ImagingStudy {
  id: string;
  slug: string;
  modality: ImagingModality;
  bodyRegion: string;
  title: LocalizedText;
  description: LocalizedText;
  classification: ImagingClassification;
  structureIds: string[];
  diseaseIds: string[];
  series: ImagingSeries[];
  referenceIds: string[];
  source: string;
  license: string;
  attribution: string;
  deIdentified: boolean;
  educationalUse: boolean;
  status: "draft" | "in_review" | "approved" | "published";
  version: number;
  reviewDueAt?: string;
}

export interface SearchResult {
  id: string;
  name: LocalizedText;
  type: "structure" | "system" | "disease" | "physiology" | "imaging";
  systemId?: string;
  href: string;
}

export type QualityMode = "low" | "medium" | "high";
export type LabelMode = "off" | "simple" | "study";
export type MedicalTab = "anatomy" | "physiology" | "pathology" | "imaging" | "references";

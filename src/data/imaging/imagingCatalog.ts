import { comprehensiveImagingStudies } from "@/src/data/imaging/comprehensiveImagingStudies";
import { imagingStudies as baselineImagingStudies } from "@/src/data/imaging/imagingStudies";

export const imagingStudies = [...baselineImagingStudies, ...comprehensiveImagingStudies];

export const getImagingStudiesForStructure = (structureId: string) =>
  imagingStudies.filter((study) => study.status === "published" && study.structureIds.includes(structureId));

export const getImagingStudiesForDisease = (diseaseId: string) =>
  imagingStudies.filter((study) => study.status === "published" && study.diseaseIds.includes(diseaseId));

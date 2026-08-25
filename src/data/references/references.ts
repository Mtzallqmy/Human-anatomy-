import type { ScientificReference } from "@/src/types/medical";

export const scientificReferences: ScientificReference[] = [
  {
    id: "REF_FIPAT_TA2",
    title: "Terminologia Anatomica: International Anatomical Terminology",
    authors: ["Federative International Programme for Anatomical Terminology"],
    year: 2019,
    edition: "2nd edition",
    publisher: "FIPAT",
    url: "https://ifaa.unifr.ch/Public/EntryPage/HomePublicNew.html",
    category: "terminology",
  },
  {
    id: "REF_GRAYS_ANATOMY",
    title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice",
    authors: ["Susan Standring"],
    year: 2020,
    edition: "42nd edition",
    publisher: "Elsevier",
    category: "anatomy",
  },
  {
    id: "REF_GUYTON_HALL",
    title: "Guyton and Hall Textbook of Medical Physiology",
    authors: ["John E. Hall", "Michael E. Hall"],
    year: 2020,
    edition: "14th edition",
    publisher: "Elsevier",
    category: "physiology",
  },
  {
    id: "REF_ROBBINS_COTRAN",
    title: "Robbins & Cotran Pathologic Basis of Disease",
    authors: ["Vinay Kumar", "Abul K. Abbas", "Jon C. Aster"],
    year: 2020,
    edition: "10th edition",
    publisher: "Elsevier",
    category: "pathology",
  },
];

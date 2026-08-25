import { getSupabaseClient } from "@/src/lib/supabase/client";
import {
  assetRowsSchema,
  diseaseRowsSchema,
  diseaseVisualConfigSchema,
  referenceRowsSchema,
  searchRowsSchema,
  structureMetadataSchema,
  structureRowsSchema,
  systemMetadataSchema,
  systemRowsSchema,
} from "@/src/data-access/medical/schemas";
import type {
  AnatomicalStructure,
  BodySystem,
  Disease,
  DiseaseStage,
  Locale,
  ModelAsset,
  ScientificReference,
  SearchResult,
} from "@/src/types/medical";

export interface MedicalSystemBundle {
  structures: AnatomicalStructure[];
  diseases: Disease[];
  references: ScientificReference[];
  assets: ModelAsset[];
  meshRegistry: Record<string, string>;
}

export class MedicalDataError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "MedicalDataError";
  }
}

function translations<T extends { locale: Locale }>(rows: T[]): Record<Locale, T> {
  const en = rows.find((row) => row.locale === "en");
  const ar = rows.find((row) => row.locale === "ar");
  if (!en || !ar) throw new MedicalDataError("Published content is missing a required translation.");
  return { en, ar };
}

function getClient() {
  const client = getSupabaseClient();
  if (!client) throw new MedicalDataError("Supabase is not configured.");
  return client;
}

export const supabaseMedicalRepository = {
  async getSystems(): Promise<BodySystem[]> {
    const { data, error } = await getClient()
      .from("systems")
      .select("id,slug,is_available,sort_order,metadata,system_translations(locale,name,description)")
      .order("sort_order");
    if (error) throw new MedicalDataError("Could not load body systems.", error);

    return systemRowsSchema.parse(data).map((row) => {
      const localized = translations(row.system_translations);
      const metadata = systemMetadataSchema
        .catch({ icon: "circle", accentColor: "#718394", rootStructureIds: [], organIds: [] })
        .parse(row.metadata);
      return {
        id: row.id,
        slug: row.slug,
        name: { en: localized.en.name, ar: localized.ar.name },
        description: { en: localized.en.description, ar: localized.ar.description },
        icon: metadata.icon,
        available: row.is_available,
        organIds: metadata.organIds,
        accentColor: metadata.accentColor,
        rootStructureIds: metadata.rootStructureIds,
        status: "published",
      };
    });
  },

  async getSystemBundle(systemId: string): Promise<MedicalSystemBundle> {
    const client = getClient();
    const { data: rawStructures, error: structuresError } = await client
      .from("anatomical_structures")
      .select(
        "id,system_id,parent_id,latin_name,sort_order,metadata,structure_translations(locale,name,description,anatomy,physiology,location,blood_supply,innervation),structure_relations!structure_relations_structure_id_fkey(related_structure_id),disease_structures(disease_id),structure_references(reference_id),mesh_mappings(mesh_name)",
      )
      .eq("system_id", systemId)
      .order("sort_order");
    if (structuresError) throw new MedicalDataError("Could not load anatomical structures.", structuresError);

    const structureRows = structureRowsSchema.parse(rawStructures);
    const structureIds = structureRows.map((row) => row.id);
    const diseaseIds = [
      ...new Set(structureRows.flatMap((row) => row.disease_structures.map((link) => link.disease_id))),
    ];
    const referenceIds = [
      ...new Set(structureRows.flatMap((row) => row.structure_references.map((link) => link.reference_id))),
    ];

    const [diseaseResponse, referenceResponse, assetResponse] = await Promise.all([
      diseaseIds.length
        ? client
            .from("diseases")
            .select(
              "id,disease_translations(locale,name,summary,etiology,pathogenesis,morphology,functional_effects),disease_structures(structure_id),disease_references(reference_id),disease_stages(id,stage_order,visual_config,disease_stage_translations(locale,name,description))",
            )
            .in("id", diseaseIds)
        : Promise.resolve({ data: [], error: null }),
      referenceIds.length
        ? client
            .from("references")
            .select("id,title,authors,publication_year,edition,publisher,doi,pmid,url,reference_type")
            .in("id", referenceIds)
        : Promise.resolve({ data: [], error: null }),
      client
        .from("three_d_assets")
        .select(
          "id,system_id,root_structure_id,name,asset_type,storage_bucket,storage_path,format,version,license,attribution,metadata,mesh_mappings(mesh_name,structure_id)",
        )
        .eq("system_id", systemId),
    ]);

    if (diseaseResponse.error) throw new MedicalDataError("Could not load diseases.", diseaseResponse.error);
    if (referenceResponse.error)
      throw new MedicalDataError("Could not load scientific references.", referenceResponse.error);
    if (assetResponse.error) throw new MedicalDataError("Could not load 3D assets.", assetResponse.error);

    const diseaseRows = diseaseRowsSchema.parse(diseaseResponse.data);
    const allDiseaseReferenceIds = diseaseRows.flatMap((row) =>
      row.disease_references.map((link) => link.reference_id),
    );
    const missingReferenceIds = [
      ...new Set(allDiseaseReferenceIds.filter((id) => !referenceIds.includes(id))),
    ];
    if (missingReferenceIds.length) {
      const { data, error } = await client
        .from("references")
        .select("id,title,authors,publication_year,edition,publisher,doi,pmid,url,reference_type")
        .in("id", missingReferenceIds);
      if (error) throw new MedicalDataError("Could not load disease references.", error);
      referenceResponse.data = [...(referenceResponse.data ?? []), ...(data ?? [])];
    }

    const references: ScientificReference[] = referenceRowsSchema
      .parse(referenceResponse.data)
      .map((row) => ({
        id: row.id,
        title: row.title,
        authors: row.authors,
        year: row.publication_year ?? new Date().getFullYear(),
        edition: row.edition ?? undefined,
        publisher: row.publisher ?? undefined,
        doi: row.doi ?? undefined,
        pubmedId: row.pmid ?? undefined,
        url: row.url ?? undefined,
        category: (["anatomy", "physiology", "pathology", "terminology"] as const).includes(
          row.reference_type as "anatomy",
        )
          ? (row.reference_type as ScientificReference["category"])
          : "terminology",
      }));

    const diseases: Disease[] = diseaseRows.map((row) => {
      const localized = translations(row.disease_translations);
      const stages: DiseaseStage[] = row.disease_stages
        .sort((a, b) => a.stage_order - b.stage_order)
        .map((stage) => {
          const stageText = translations(stage.disease_stage_translations);
          const visualState = diseaseVisualConfigSchema.partial().catch({}).parse(stage.visual_config);
          return {
            id: stage.id,
            order: stage.stage_order,
            name: { en: stageText.en.name, ar: stageText.ar.name },
            description: { en: stageText.en.description, ar: stageText.ar.description },
            visualState,
          };
        });
      return {
        id: row.id,
        name: { en: localized.en.name, ar: localized.ar.name },
        summary: { en: localized.en.summary, ar: localized.ar.summary },
        etiology: { en: localized.en.etiology, ar: localized.ar.etiology },
        pathogenesis: { en: localized.en.pathogenesis, ar: localized.ar.pathogenesis },
        morphology: { en: localized.en.morphology, ar: localized.ar.morphology },
        functionalEffects: {
          en: localized.en.functional_effects,
          ar: localized.ar.functional_effects,
        },
        affectedStructureIds: row.disease_structures.map((link) => link.structure_id),
        stages,
        referenceIds: row.disease_references.map((link) => link.reference_id),
      };
    });

    const structures: AnatomicalStructure[] = structureRows.map((row) => {
      const localized = translations(row.structure_translations);
      const metadata = structureMetadataSchema.catch({}).parse(row.metadata);
      return {
        id: row.id,
        name: { en: localized.en.name, ar: localized.ar.name },
        latinName: row.latin_name ?? undefined,
        description: { en: localized.en.description, ar: localized.ar.description },
        anatomy: { en: localized.en.anatomy, ar: localized.ar.anatomy },
        physiology: { en: localized.en.physiology, ar: localized.ar.physiology },
        location: { en: localized.en.location, ar: localized.ar.location },
        bloodSupply:
          localized.en.blood_supply || localized.ar.blood_supply
            ? {
                en: localized.en.blood_supply ?? "",
                ar: localized.ar.blood_supply ?? "",
              }
            : undefined,
        innervation:
          localized.en.innervation || localized.ar.innervation
            ? { en: localized.en.innervation ?? "", ar: localized.ar.innervation ?? "" }
            : undefined,
        systemId: row.system_id,
        parentId: row.parent_id ?? undefined,
        childrenIds: structureRows
          .filter((candidate) => candidate.parent_id === row.id)
          .map((candidate) => candidate.id),
        relatedStructureIds: row.structure_relations.map((link) => link.related_structure_id),
        relatedDiseaseIds: row.disease_structures.map((link) => link.disease_id),
        meshIds: row.mesh_mappings.map((mapping) => mapping.mesh_name),
        referenceIds: row.structure_references.map((link) => link.reference_id),
        labelAnchor: metadata.labelAnchor,
        studyNumber: metadata.studyNumber,
      };
    });

    const assetRows = assetRowsSchema.parse(assetResponse.data);
    const assets: ModelAsset[] = await Promise.all(
      assetRows
        .filter((row) => row.asset_type === "model" || row.asset_type === "procedural")
        .map(async (row) => {
          let url: string | null = null;
          if (row.storage_bucket && row.storage_path) {
            const { data, error } = await client.storage
              .from(row.storage_bucket)
              .createSignedUrl(row.storage_path, 60 * 60);
            if (error) throw new MedicalDataError("Could not create a model URL.", error);
            url = data.signedUrl;
          }
          const metadata = row.metadata as { attribution?: { en?: string; ar?: string } };
          return {
            id: row.id,
            url,
            systemId: row.system_id,
            rootStructureId: row.root_structure_id ?? structureIds[0] ?? "",
            structureIds,
            format: row.format === "glb" || row.format === "gltf" ? row.format : "procedural",
            attribution: {
              en: metadata.attribution?.en ?? row.attribution,
              ar: metadata.attribution?.ar ?? row.attribution,
            },
            license: row.license,
          } satisfies ModelAsset;
        }),
    );

    const meshRegistry = Object.fromEntries(
      assetRows.flatMap((asset) =>
        asset.mesh_mappings.map((mapping) => [mapping.mesh_name, mapping.structure_id]),
      ),
    );

    return { structures, diseases, references, assets, meshRegistry };
  },

  async search(query: string): Promise<SearchResult[]> {
    if (query.trim().length < 2) return [];
    const { data, error } = await getClient().rpc("search_medical_content", {
      search_query: query,
      result_limit: 12,
    });
    if (error) throw new MedicalDataError("Search is temporarily unavailable.", error);
    return searchRowsSchema.parse(data).map((row) => ({
      id: row.id,
      type: row.result_type,
      systemId: row.system_id ?? undefined,
      name: { en: row.name_en, ar: row.name_ar },
      href: row.href,
    }));
  },
};

import { z } from "zod";
import { structureDraftSchema, type StructureDraftInput } from "@/src/data-access/admin/adminSchemas";

const rowSchema = z.object({
  id: z.string(),
  systemId: z.string(),
  parentId: z.string().optional(),
  slug: z.string(),
  canonicalName: z.string(),
  latinName: z.string().optional(),
  nameEn: z.string(),
  nameAr: z.string(),
  descriptionEn: z.string(),
  descriptionAr: z.string(),
  anatomyEn: z.string(),
  anatomyAr: z.string(),
  physiologyEn: z.string(),
  physiologyAr: z.string(),
  locationEn: z.string(),
  locationAr: z.string(),
});

function csvCells(line: string): string[] {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) {
      cells.push(value.trim());
      value = "";
    } else value += character;
  }
  cells.push(value.trim());
  return cells;
}

export function parseStructureImport(source: string, type: "json" | "csv"): unknown[] {
  if (type === "json") {
    const value: unknown = JSON.parse(source);
    if (!Array.isArray(value)) throw new Error("JSON import must be an array.");
    return value;
  }
  const lines = source.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = csvCells(lines[0]);
  return lines
    .slice(1)
    .map((line) => Object.fromEntries(headers.map((header, index) => [header, csvCells(line)[index] ?? ""])));
}

export function validateStructureImport(rawRows: unknown[], validSystemIds: string[]) {
  const issues: string[] = [];
  const rows = rawRows
    .map((raw, index) => {
      const parsed = rowSchema.safeParse(raw);
      if (!parsed.success) {
        issues.push(`Row ${index + 1}: malformed or missing fields.`);
        return null;
      }
      const row = parsed.data;
      const value = structureDraftSchema.safeParse({
        id: row.id,
        systemId: row.systemId,
        parentId: row.parentId || undefined,
        slug: row.slug,
        canonicalName: row.canonicalName,
        latinName: row.latinName || undefined,
        name: { en: row.nameEn, ar: row.nameAr },
        description: { en: row.descriptionEn, ar: row.descriptionAr },
        anatomy: { en: row.anatomyEn, ar: row.anatomyAr },
        physiology: { en: row.physiologyEn, ar: row.physiologyAr },
        location: { en: row.locationEn, ar: row.locationAr },
      });
      if (!value.success) {
        issues.push(`Row ${index + 1}: ${value.error.issues[0]?.message}`);
        return null;
      }
      return value.data;
    })
    .filter((item): item is StructureDraftInput => Boolean(item));
  const ids = new Set<string>();
  for (const row of rows) {
    if (ids.has(row.id)) issues.push(`Duplicate ID: ${row.id}`);
    ids.add(row.id);
    if (!validSystemIds.includes(row.systemId))
      issues.push(`Invalid system ID for ${row.id}: ${row.systemId}`);
  }
  for (const row of rows)
    if (row.parentId && !ids.has(row.parentId))
      issues.push(`Invalid parent ID for ${row.id}: ${row.parentId}`);
  return { rows, issues };
}

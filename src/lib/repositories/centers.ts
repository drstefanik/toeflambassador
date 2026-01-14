import {
  AirtableRecord,
  CenterFields,
  getActiveCenters as fetchActiveCenters,
  getAllCenters,
  getCenterById as fetchCenterById,
  updateCenterFields as updateCenterRecord,
} from "../airtable";
import { resolveCenterSlug } from "../centers";
import { slugify } from "../slugify";

export interface CenterEntity {
  id: string;
  name: string;
  city?: string;
  slug?: string;
  fields: CenterFields;
}

const mapCenter = (record: AirtableRecord<CenterFields>): CenterEntity => ({
  id: record.id,
  name: record.fields.Name ?? "",
  city: record.fields.City ?? record.fields["Città"],
  slug: resolveCenterSlug(record.fields),
  fields: record.fields,
});

export async function getActiveCenters() {
  const records = await fetchActiveCenters();
  return records.map(mapCenter);
}

export async function getAllCentersForStaticPaths() {
  const records = await getAllCenters();
  return records.map(mapCenter);
}

export async function getCenterBySlug(slug: string) {
  const records = await getAllCenters();
  const normalizedSlug = slugify(decodeURIComponent(slug));
  const record = records.find(
    (center) => resolveCenterSlug(center.fields ?? center) === normalizedSlug
  );
  return record ? mapCenter(record) : null;
}

export async function getCenterById(centerId: string) {
  const record = await fetchCenterById(centerId);
  return mapCenter(record);
}

export async function updateCenterFields(centerId: string, fields: Partial<CenterFields>) {
  const updated = await updateCenterRecord(centerId, fields);
  return mapCenter(updated);
}

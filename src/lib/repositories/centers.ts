import {
  AirtableRecord,
  CenterFields,
  getActiveCenters as fetchActiveCenters,
  getAllCenters,
  getCenterById as fetchCenterById,
  getCenterBySlug as fetchCenterBySlug,
  updateCenterFields as updateCenterRecord,
} from "../airtable";

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
  city: record.fields.City,
  slug: record.fields.Slug,
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
  const record = await fetchCenterBySlug(slug);
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

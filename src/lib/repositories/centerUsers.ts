import {
  AirtableRecord,
  CenterUserFields,
  createCenterUser,
  getCenterUserByEmail,
  updateCenterUser,
} from "../airtable";

export interface CenterUserEntity {
  id: string;
  email: string;
  fields: CenterUserFields;
}

const mapCenterUser = (record: AirtableRecord<CenterUserFields>): CenterUserEntity => ({
  id: record.id,
  email: record.fields.Email ?? "",
  fields: record.fields,
});

export async function findCenterUserByEmail(email: string) {
  const record = await getCenterUserByEmail(email);
  return record ? mapCenterUser(record) : null;
}

export async function createCenterUserRecord(fields: CenterUserFields) {
  const record = await createCenterUser(fields);

  return mapCenterUser(record);
}

export async function updateCenterUserPassword(centerUserId: string, passwordHash: string) {
  const record = await updateCenterUser(centerUserId, { PasswordHash: passwordHash });
  return mapCenterUser(record);
}

export async function linkCenterUserToCenter(centerUserId: string, centerId: string) {
  const record = await updateCenterUser(centerUserId, { Center: [centerId] });
  return mapCenterUser(record);
}

export async function updateCenterUserRecord(
  centerUserId: string,
  fields: Partial<CenterUserFields>
) {
  const record = await updateCenterUser(centerUserId, fields);
  return mapCenterUser(record);
}

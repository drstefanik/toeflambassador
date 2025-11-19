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

export async function createCenterUserWithOTP(input: {
  email: string;
  passwordHash?: string;
  centerId?: string;
  otp?: string;
}) {
  const record = await createCenterUser({
    Email: input.email,
    PasswordHash: input.passwordHash,
    Center: input.centerId ? [input.centerId] : undefined,
    OTP: input.otp,
    OTPUsed: false,
  });

  return mapCenterUser(record);
}

export async function markOTPUsed(centerUserId: string) {
  const record = await updateCenterUser(centerUserId, {
    OTPUsed: true,
  });
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

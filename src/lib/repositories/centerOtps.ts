import {
  AirtableRecord,
  CenterOTPFields,
  getCenterOTPByCode,
  updateCenterOTP,
} from "../airtable";

export interface CenterOtpEntity {
  id: string;
  fields: CenterOTPFields;
}

const mapCenterOtp = (record: AirtableRecord<CenterOTPFields>): CenterOtpEntity => ({
  id: record.id,
  fields: record.fields,
});

export async function findActiveCenterOtpByCode(otp: string) {
  const record = await getCenterOTPByCode(otp);
  return record ? mapCenterOtp(record) : null;
}

export async function markCenterOtpUsed(
  centerOtpId: string,
  fields: Partial<CenterOTPFields>
) {
  const record = await updateCenterOTP(centerOtpId, fields);
  return mapCenterOtp(record);
}

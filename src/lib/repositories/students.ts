import {
  AirtableRecord,
  StudentFields,
  createStudent as createStudentRecord,
  getStudentByEmail as fetchStudentByEmail,
  getStudentById,
} from "../airtable";

export interface StudentEntity {
  id: string;
  email: string;
  fullName?: string;
  fields: StudentFields;
}

const mapStudent = (record: AirtableRecord<StudentFields>): StudentEntity => ({
  id: record.id,
  email: record.fields.Email ?? "",
  fullName: record.fields.FullName,
  fields: record.fields,
});

export async function findStudentByEmail(email: string) {
  const record = await fetchStudentByEmail(email);
  return record ? mapStudent(record) : null;
}

export async function fetchStudentById(studentId: string) {
  const record = await getStudentById(studentId);
  return mapStudent(record);
}

export async function createStudent(input: {
  email: string;
  fullName: string;
  passwordHash: string;
  country: string;
  preferredCenterId?: string;
}) {
  const record = await createStudentRecord({
    Email: input.email,
    FullName: input.fullName,
    PasswordHash: input.passwordHash,
    Country: input.country,
    PreferredCenter: input.preferredCenterId ? [input.preferredCenterId] : undefined,
  });

  return mapStudent(record);
}

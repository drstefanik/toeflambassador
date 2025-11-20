import { randomBytes } from "crypto";

const warnMissing = (key: string) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[config] Missing environment variable: ${key}`);
  }
};

const getEnv = (key: string, options?: { required?: boolean }) => {
  const value = process.env[key];
  if (!value && options?.required) {
    warnMissing(key);
  }
  return value ?? "";
};

let cachedRuntimeJwtSecret: string | null = null;

export const getJwtSecret = () => {
  const envSecret = getEnv("JWT_SECRET") || getEnv("NEXTAUTH_SECRET");
  if (envSecret) {
    return envSecret;
  }

  if (!cachedRuntimeJwtSecret) {
    cachedRuntimeJwtSecret = randomBytes(32).toString("hex");
    const suffix = process.env.NODE_ENV === "production" ? " (set JWT_SECRET for a persistent, secure secret)" : "";
    console.warn(`[config] JWT_SECRET missing, using generated runtime secret${suffix}`);
  }

  return cachedRuntimeJwtSecret;
};

export const env = {
  AIRTABLE_PERSONAL_TOKEN: getEnv("AIRTABLE_PERSONAL_TOKEN"),
  AIRTABLE_BASE_ID: getEnv("AIRTABLE_BASE_ID"),
  AIRTABLE_TABLE_CENTERS: getEnv("AIRTABLE_TABLE_CENTERS", { required: true }) || "Centers",
  AIRTABLE_TABLE_CENTER_USERS:
    getEnv("AIRTABLE_TABLE_CENTER_USERS", { required: true }) || "CenterUsers",
  AIRTABLE_TABLE_STUDENTS: getEnv("AIRTABLE_TABLE_STUDENTS", { required: true }) || "Students",
  AIRTABLE_TABLE_ORDERS: getEnv("AIRTABLE_TABLE_ORDERS", { required: true }) || "Orders",
  STRIPE_API_KEY: getEnv("STRIPE_API_KEY"),
  TOEFL_iBT_Voucher_ID: getEnv("TOEFL_iBT_Voucher_ID"),
  TOEFL_Ambassador_Activation_Pack_ID: getEnv(
    "TOEFL_Ambassador_Activation_Pack_ID"
  ),
  STRIPE_WEBHOOK_SECRET: getEnv("STRIPE_WEBHOOK_SECRET"),
  JWT_SECRET: getJwtSecret(),
  EMAIL_API_KEY: getEnv("EMAIL_API_KEY"),
  EMAIL_FROM: getEnv("EMAIL_FROM"),
  NEXT_PUBLIC_CALENDLY_STUDENT_URL: getEnv("NEXT_PUBLIC_CALENDLY_STUDENT_URL"),
  NEXT_PUBLIC_CALENDLY_CENTER_URL: getEnv("NEXT_PUBLIC_CALENDLY_CENTER_URL"),
  ADMIN_CONTACT_EMAIL: getEnv("ADMIN_CONTACT_EMAIL"),
};

export type AppEnv = typeof env;

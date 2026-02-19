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
  AIRTABLE_API_KEY: getEnv("AIRTABLE_API_KEY"),
  AIRTABLE_PERSONAL_TOKEN: getEnv("AIRTABLE_PERSONAL_TOKEN"),
  AIRTABLE_BASE_ID: getEnv("AIRTABLE_BASE_ID"),
  AIRTABLE_TABLE_CENTERS: getEnv("AIRTABLE_TABLE_CENTERS", { required: true }) || "Centers",
  AIRTABLE_TABLE_CENTER_USERS:
    getEnv("AIRTABLE_TABLE_CENTER_USERS", { required: true }) || "CenterUsers",
  AIRTABLE_TABLE_CENTER_OTPS:
    getEnv("AIRTABLE_TABLE_CENTER_OTPS", { required: true }) || "Center_OTPs",
  AIRTABLE_TABLE_STUDENTS: getEnv("AIRTABLE_TABLE_STUDENTS", { required: true }) || "Students",
  AIRTABLE_TABLE_ORDERS:
    getEnv("AIRTABLE_ORDERS_TABLE") ||
    getEnv("AIRTABLE_TABLE_ORDERS", { required: true }) ||
    "Orders",
  AIRTABLE_TABLE_LEADS:
    getEnv("AIRTABLE_TABLE_LEADS", { required: true }) || "ContactLeads",
  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY") || getEnv("STRIPE_API_KEY"),
  STRIPE_API_KEY: getEnv("STRIPE_SECRET_KEY") || getEnv("STRIPE_API_KEY"),
  TOEFL_iBT_Voucher_PRICE_ID:
    getEnv("TOEFL_iBT_Voucher_PRICE_ID") || getEnv("TOEFL_iBT_Voucher_ID"),
  TOEFL_iBT_Voucher_ID:
    getEnv("TOEFL_iBT_Voucher_PRICE_ID") || getEnv("TOEFL_iBT_Voucher_ID"),
  TOEFL_Ambassador_Activation_Pack_PRICE_ID:
    getEnv("TOEFL_Ambassador_Activation_Pack_PRICE_ID") ||
    getEnv("TOEFL_Ambassador_Activation_Pack_ID"),
  TOEFL_Ambassador_Activation_Pack_ID:
    getEnv("TOEFL_Ambassador_Activation_Pack_PRICE_ID") ||
    getEnv("TOEFL_Ambassador_Activation_Pack_ID"),
  STRIPE_WEBHOOK_SECRET: getEnv("STRIPE_WEBHOOK_SECRET"),
  NEXT_PUBLIC_APP_URL: getEnv("NEXT_PUBLIC_APP_URL"),
  JWT_SECRET: getJwtSecret(),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  RESEND_FROM_EMAIL: getEnv("RESEND_FROM_EMAIL"),
  NEXT_PUBLIC_CALENDLY_STUDENT_URL: getEnv("NEXT_PUBLIC_CALENDLY_STUDENT_URL"),
  NEXT_PUBLIC_CALENDLY_CENTER_URL: getEnv("NEXT_PUBLIC_CALENDLY_CENTER_URL"),
  ADMIN_CONTACT_EMAIL: getEnv("ADMIN_CONTACT_EMAIL"),
  CONTROL_CC_EMAIL: getEnv("CONTROL_CC_EMAIL"),
  UPSTASH_REDIS_REST_URL: getEnv("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: getEnv("UPSTASH_REDIS_REST_TOKEN"),
};

export type AppEnv = typeof env;

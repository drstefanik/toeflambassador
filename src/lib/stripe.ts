import Stripe from "stripe";
import { env } from "./config";

if (!env.STRIPE_API_KEY) {
  console.warn("Missing STRIPE_API_KEY. Stripe client will throw when used.");
}

export const stripe = new Stripe(env.STRIPE_API_KEY || "sk_test_missing", {
  apiVersion: "2024-06-20",
});

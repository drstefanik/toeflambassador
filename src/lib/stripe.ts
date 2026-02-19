import Stripe from "stripe";
import { env } from "./config";

if (!env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY. Stripe client will throw when used.");
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "sk_test_missing", {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
});

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type SafeRateLimitOptions = {
  key: string;
  maxRequests?: number;
  window?: `${number} ${"s" | "m" | "h" | "d"}`;
  timeoutMs?: number;
};

type SafeRateLimitResult = {
  allowed: boolean;
  skipped: boolean;
  reason?: "missing_config" | "invalid_url" | "timeout" | "ratelimit_error";
};

let cachedRedis: Redis | null | undefined;
let cachedState: SafeRateLimitResult | null = null;

function getRedisClient(): { redis: Redis | null; state: SafeRateLimitResult | null } {
  if (cachedRedis !== undefined) {
    return { redis: cachedRedis, state: cachedState };
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    cachedRedis = null;
    cachedState = { allowed: true, skipped: true, reason: "missing_config" };
    return { redis: null, state: cachedState };
  }

  if (!url.startsWith("https://")) {
    console.error("[safe-ratelimit] Invalid UPSTASH_REDIS_REST_URL. Must start with https://", { url });
    cachedRedis = null;
    cachedState = { allowed: true, skipped: true, reason: "invalid_url" };
    return { redis: null, state: cachedState };
  }

  cachedRedis = new Redis({ url, token });
  cachedState = null;

  return { redis: cachedRedis, state: null };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout:${timeoutMs}`)), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function safeRateLimit({
  key,
  maxRequests = 5,
  window = "10 m",
  timeoutMs = 2000,
}: SafeRateLimitOptions): Promise<SafeRateLimitResult> {
  const { redis, state } = getRedisClient();

  if (!redis) {
    return state ?? { allowed: true, skipped: true, reason: "missing_config" };
  }

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, window),
  });

  try {
    const result = await withTimeout(ratelimit.limit(key), timeoutMs);

    if (!result.success) {
      return { allowed: false, skipped: false };
    }

    return { allowed: true, skipped: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const reason = message.startsWith("timeout:") ? "timeout" : "ratelimit_error";

    console.error("[safe-ratelimit] Upstash check failed. Allowing request.", {
      key,
      reason,
      error: message,
    });

    return { allowed: true, skipped: true, reason };
  }
}

export type { SafeRateLimitResult };

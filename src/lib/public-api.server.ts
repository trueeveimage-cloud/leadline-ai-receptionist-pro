const ALLOWED_ORIGINS = new Set([
  "https://www.leadmap.se",
  "https://leadmap.se",
  "https://leadline-ai-receptionist-pro.lovable.app",
  "https://id-preview--db12fc5f-e412-441a-9002-745e2cbf253f.lovable.app",
]);

const buckets = new Map<string, { count: number; resetAt: number }>();

function requestOrigin(request: Request) {
  return request.headers.get("origin");
}

export function isAllowedPublicOrigin(request: Request) {
  const origin = requestOrigin(request);
  return (
    !origin ||
    ALLOWED_ORIGINS.has(origin) ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:")
  );
}

export function publicCorsHeaders(request: Request, methods = "POST, OPTIONS") {
  const origin = requestOrigin(request);
  const allowedOrigin =
    origin && isAllowedPublicOrigin(request) ? origin : "https://www.leadmap.se";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  } as const;
}

export function clientKey(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function checkRateLimit(
  request: Request,
  scope: string,
  options: { limit: number; windowMs: number },
) {
  const now = Date.now();
  const key = `${scope}:${clientKey(request)}`;
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function readJsonBody(request: Request, maxBytes = 16_384) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  return JSON.parse(text || "null") as unknown;
}

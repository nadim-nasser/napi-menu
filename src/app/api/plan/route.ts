import { NextResponse } from "next/server";

function getWeekKey() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return `plan-${start.toISOString().slice(0, 10)}`;
}

// In-memory fallback when KV is not configured
const memoryStore: Record<string, unknown> = {};

async function getKv() {
  try {
    const mod = await import("@vercel/kv");
    // Test if KV is configured by checking env vars
    if (!process.env.KV_REST_API_URL) return null;
    return mod.kv;
  } catch {
    return null;
  }
}

export async function GET() {
  const key = getWeekKey();
  try {
    const kv = await getKv();
    if (kv) {
      const plan = await kv.get(key);
      return NextResponse.json(plan || {});
    }
  } catch {
    // fall through
  }
  return NextResponse.json(memoryStore[key] || {});
}

export async function PUT(request: Request) {
  const key = getWeekKey();
  const plan = await request.json();
  try {
    const kv = await getKv();
    if (kv) {
      await kv.set(key, plan, { ex: 60 * 60 * 24 * 14 });
      return NextResponse.json({ ok: true });
    }
  } catch {
    // fall through
  }
  memoryStore[key] = plan;
  return NextResponse.json({ ok: true });
}

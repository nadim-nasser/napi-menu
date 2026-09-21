import { kv } from "@vercel/kv";

function getWeekKey() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return `plan-${start.toISOString().slice(0, 10)}`;
}

export async function GET() {
  const key = getWeekKey();
  const plan = await kv.get(key);
  return Response.json(plan || {});
}

export async function PUT(request: Request) {
  const key = getWeekKey();
  const plan = await request.json();
  await kv.set(key, plan, { ex: 60 * 60 * 24 * 14 }); // expire after 2 weeks
  return Response.json({ ok: true });
}

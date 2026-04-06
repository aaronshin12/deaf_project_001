// Vercel KV REST API direct access (no npm package needed)

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function isKvConfigured(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (!isKvConfigured()) return null;

  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.result) return null;

    return typeof data.result === "string"
      ? JSON.parse(data.result)
      : data.result;
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: unknown): Promise<boolean> {
  if (!isKvConfigured()) return false;

  try {
    const body = JSON.stringify(value);
    const res = await fetch(`${KV_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", key, body]),
    });

    return res.ok;
  } catch {
    return false;
  }
}

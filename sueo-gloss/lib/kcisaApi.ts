export interface SignEntry {
  title: string;
  url: string;
  referenceIdentifier: string;
  description: string;
  subDescription: string;
  signDescription: string;
  signImages: string;
}

const API_BASE = "https://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";

export async function searchSign(keyword: string): Promise<{ results: SignEntry[]; debug?: string }> {
  const serviceKey = process.env.KCISA_API_KEY;
  if (!serviceKey) {
    return { results: [], debug: "KCISA_API_KEY not set" };
  }

  // API docs say keyword must be present even if empty
  const url = `${API_BASE}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=5&pageNo=1&keyword=${encodeURIComponent(keyword)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    const text = await res.text();

    if (!res.ok) {
      return { results: [], debug: `HTTP ${res.status}: ${text.substring(0, 200)}` };
    }

    // Try JSON parse
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Might be XML
      return { results: [], debug: `Not JSON. Response starts with: ${text.substring(0, 300)}` };
    }

    // Navigate response structure
    const items = data?.response?.body?.items?.item;
    if (!items) {
      return { results: [], debug: `No items found. Keys: ${JSON.stringify(Object.keys(data?.response?.body || data?.response || data || {}))}. Raw: ${text.substring(0, 300)}` };
    }

    const arr = Array.isArray(items) ? items : [items];
    return { results: arr };
  } catch (error) {
    return { results: [], debug: `Fetch error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

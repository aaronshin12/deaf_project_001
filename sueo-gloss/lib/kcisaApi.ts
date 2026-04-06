export interface SignEntry {
  title: string;
  url: string;
  referenceIdentifier: string;
  description: string;
  subDescription: string;
  signDescription: string;
  signImages: string;
}

const API_BASE = "http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";

export async function searchSign(keyword: string): Promise<{ results: SignEntry[]; debug?: string; rawSample?: string }> {
  const serviceKey = process.env.KCISA_API_KEY;
  if (!serviceKey) {
    return { results: [], debug: "KCISA_API_KEY not set" };
  }

  const url = `${API_BASE}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=3&pageNo=1&keyword=${encodeURIComponent(keyword)}`;

  try {
    // Try without Accept header - let API return its default format
    const res = await fetch(url);
    const text = await res.text();

    if (!res.ok) {
      return { results: [], debug: `HTTP ${res.status}`, rawSample: text.substring(0, 500) };
    }

    // Check if XML
    if (text.trimStart().startsWith("<?xml") || text.trimStart().startsWith("<")) {
      // Parse XML manually - extract items
      return { results: [], debug: "Response is XML", rawSample: text.substring(0, 800) };
    }

    // Try JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return { results: [], debug: "Not JSON or XML", rawSample: text.substring(0, 500) };
    }

    const body = data?.response?.body;
    const items = body?.items?.item;

    if (!items) {
      return { results: [], debug: `items is ${JSON.stringify(body?.items)}`, rawSample: text.substring(0, 500) };
    }

    const arr = Array.isArray(items) ? items : [items];
    return { results: arr };
  } catch (error) {
    const errMsg = error instanceof Error ? `${error.message} | cause: ${error.cause}` : String(error);
    return { results: [], debug: `Fetch error: ${errMsg}` };
  }
}

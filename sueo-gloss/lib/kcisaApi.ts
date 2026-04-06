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

  // Build URL exactly like the Java sample - encode each param
  const params = new URLSearchParams();
  params.set("serviceKey", serviceKey);
  params.set("numOfRows", "10");
  params.set("pageNo", "1");
  params.set("keyword", keyword);

  const url = `${API_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json",
      },
    });

    const text = await res.text();

    if (!res.ok) {
      return { results: [], debug: `HTTP ${res.status}`, rawSample: text.substring(0, 500) };
    }

    // Check if XML response
    if (text.trimStart().startsWith("<?xml") || text.trimStart().startsWith("<")) {
      return { results: [], debug: "XML response received despite JSON headers", rawSample: text.substring(0, 800) };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return { results: [], debug: "JSON parse failed", rawSample: text.substring(0, 500) };
    }

    const items = data?.response?.body?.items?.item;

    if (!items) {
      // Show full body for debugging
      return {
        results: [],
        debug: `items is ${String(data?.response?.body?.items)}, totalCount: ${data?.response?.body?.totalCount}`,
        rawSample: text.substring(0, 600),
      };
    }

    const arr = Array.isArray(items) ? items : [items];
    return { results: arr };
  } catch (error) {
    const errMsg = error instanceof Error ? `${error.message} | cause: ${error.cause}` : String(error);
    return { results: [], debug: `Fetch error: ${errMsg}` };
  }
}

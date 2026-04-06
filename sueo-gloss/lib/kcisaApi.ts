export interface SignEntry {
  title: string;
  url: string;
  referenceIdentifier: string;
  description: string;
  subDescription: string;
  signDescription: string;
  signImages: string;
}

interface KcisaResponse {
  response: {
    body: {
      items: {
        item: SignEntry | SignEntry[];
      };
      totalCount: number;
    };
  };
}

const API_BASE = "https://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";

export async function searchSign(keyword: string): Promise<SignEntry[]> {
  const serviceKey = process.env.KCISA_API_KEY;
  if (!serviceKey) {
    console.error("KCISA_API_KEY not configured");
    return [];
  }

  const params = new URLSearchParams({
    serviceKey,
    numOfRows: "5",
    pageNo: "1",
    keyword,
  });

  try {
    const res = await fetch(`${API_BASE}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // cache for 24h
    });

    if (!res.ok) {
      console.error(`KCISA API error: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type") || "";
    let data: KcisaResponse;

    if (contentType.includes("json")) {
      data = await res.json();
    } else {
      // API might return XML — try JSON parse of text
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        console.error("KCISA API returned non-JSON response");
        return [];
      }
    }

    const items = data?.response?.body?.items?.item;
    if (!items) return [];

    // API returns single object if only 1 result, array if multiple
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error("KCISA API fetch error:", error);
    return [];
  }
}

export function extractVideoUrl(entry: SignEntry): string | null {
  // The 'url' field contains the video/content page URL
  if (entry.url) return entry.url;
  return null;
}

export function extractThumbnail(entry: SignEntry): string | null {
  if (entry.referenceIdentifier) return entry.referenceIdentifier;
  return null;
}

export function extractSignImages(entry: SignEntry): string[] {
  if (!entry.signImages) return [];
  return entry.signImages.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * KCISA 일상생활수어 API에서 전체 데이터를 다운로드하여 JSON으로 저장합니다.
 *
 * 사용법 (로컬 PC에서 1회 실행):
 *   1. .env.local 파일에 KCISA_API_KEY 설정
 *      KCISA_API_KEY=발급받은_키
 *   2. node scripts/download-signs.js
 *
 * 필요: Node.js 18+ (fetch 내장)
 */

const fs = require("fs");
const path = require("path");

// Load .env.local manually (without dotenv dependency)
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvLocal();

const API_BASE = "http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";
const SERVICE_KEY = process.env.KCISA_API_KEY;
const OUTPUT_PATH = path.join(__dirname, "..", "data", "sign-words.json");
const PAGE_SIZE = 100;

if (!SERVICE_KEY) {
  console.error("❌ KCISA_API_KEY가 설정되지 않았습니다.");
  console.error("   .env.local 파일에 다음과 같이 추가하세요:");
  console.error("   KCISA_API_KEY=발급받은_키");
  process.exit(1);
}

async function fetchPage(pageNo) {
  const url = `${API_BASE}?serviceKey=${encodeURIComponent(SERVICE_KEY)}&numOfRows=${PAGE_SIZE}&pageNo=${pageNo}&keyword=`;

  const res = await fetch(url, {
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const text = await res.text();

  // Handle XML response
  if (text.trimStart().startsWith("<?xml") || text.trimStart().startsWith("<")) {
    console.log(`  Page ${pageNo}: XML response received, skipping...`);
    return { items: [], totalCount: 0 };
  }

  const data = JSON.parse(text);
  const body = data?.response?.body;
  const totalCount = parseInt(body?.totalCount || "0", 10);
  const items = body?.items?.item;

  if (!items) return { items: [], totalCount };

  const arr = Array.isArray(items) ? items : [items];
  return { items: arr, totalCount };
}

async function main() {
  console.log("=== KCISA 일상생활수어 데이터 다운로드 ===\n");

  // First fetch to get total count
  console.log("1/3 총 데이터 수 확인 중...");
  const first = await fetchPage(1);
  const totalCount = first.totalCount;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  console.log(`  총 ${totalCount}건, ${totalPages} 페이지\n`);

  if (totalCount === 0) {
    console.log("데이터가 없습니다. API 키 또는 네트워크를 확인하세요.");
    process.exit(1);
  }

  // Fetch all pages
  console.log("2/3 데이터 다운로드 중...");
  const allItems = [...first.items];

  for (let page = 2; page <= totalPages; page++) {
    process.stdout.write(`  페이지 ${page}/${totalPages}...\r`);
    try {
      const { items } = await fetchPage(page);
      allItems.push(...items);
    } catch (err) {
      console.log(`\n  페이지 ${page} 실패: ${err.message}, 재시도...`);
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const { items } = await fetchPage(page);
        allItems.push(...items);
      } catch (err2) {
        console.log(`  페이지 ${page} 재시도 실패: ${err2.message}, 건너뜀`);
      }
    }
    // Rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n  총 ${allItems.length}건 다운로드 완료\n`);

  // Process and save
  console.log("3/3 JSON 파일 저장 중...");
  const processed = allItems.map((item) => ({
    title: item.title || "",
    url: item.url || "",
    signDescription: item.signDescription || "",
    signImages: item.signImages || "",
    referenceIdentifier: item.referenceIdentifier || "",
    subDescription: item.subDescription || "",
    categoryType: item.categoryType || "",
    description: item.description || "",
  }));

  // Remove duplicates by title
  const seen = new Set();
  const unique = processed.filter((item) => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2), "utf-8");
  console.log(`  ${unique.length}건 저장 완료: ${OUTPUT_PATH}`);
  console.log("\n=== 완료! ===");
  console.log("다음 명령어로 GitHub에 푸시하세요:");
  console.log("  git add data/sign-words.json");
  console.log('  git commit -m "data: 수어 데이터 추가"');
  console.log("  git push");
}

main().catch((err) => {
  console.error("오류 발생:", err.message);
  process.exit(1);
});

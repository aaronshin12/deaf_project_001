import { NextRequest, NextResponse } from "next/server";
import { searchSign } from "@/lib/kcisaApi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword") ?? "";

  const { results, debug, rawSample } = await searchSign(keyword);

  return NextResponse.json({ results, debug, rawSample });
}

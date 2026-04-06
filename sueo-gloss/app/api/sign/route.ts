import { NextRequest, NextResponse } from "next/server";
import { searchSign } from "@/lib/kcisaApi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json(
      { error: "keyword 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const { results, debug } = await searchSign(keyword);

  return NextResponse.json({ results, debug });
}

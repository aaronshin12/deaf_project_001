import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ valid: true });
  }

  if (password === adminPassword) {
    return NextResponse.json({ valid: true });
  }

  return NextResponse.json({ valid: false, error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
}

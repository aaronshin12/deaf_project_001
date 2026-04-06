import { NextRequest, NextResponse } from "next/server";
import { readCurriculum, writeCurriculum, Curriculum } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const curriculum = await readCurriculum();
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error("Failed to read curriculum:", error);
    return NextResponse.json(
      { error: "커리큘럼을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const password = request.headers.get("x-admin-password");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminPassword && password !== adminPassword) {
      return NextResponse.json(
        { error: "관리자 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const data: Curriculum = await request.json();

    if (!data.weeks || !Array.isArray(data.weeks)) {
      return NextResponse.json(
        { error: "잘못된 데이터 형식입니다." },
        { status: 400 }
      );
    }

    await writeCurriculum(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to write curriculum:", error);
    return NextResponse.json(
      { error: "커리큘럼 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

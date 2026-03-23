import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GLOSS_SYSTEM_PROMPT } from "@/lib/glossPrompt";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { sentence } = await request.json();

    if (!sentence || typeof sentence !== "string") {
      return NextResponse.json(
        { error: "문장을 입력해주세요." },
        { status: 400 }
      );
    }

    if (sentence.length > 200) {
      return NextResponse.json(
        { error: "문장은 200자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: GLOSS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: sentence,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "변환 결과를 받지 못했습니다." },
        { status: 500 }
      );
    }

    const result = JSON.parse(textBlock.text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Gloss conversion error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "변환 결과 파싱에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "글로스 변환 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

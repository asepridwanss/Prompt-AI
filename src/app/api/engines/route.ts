import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const modelOptions = [
      { value: "gpt-4o", label: "gpt-4o" },
      { value: "gemini-2.5-flash", label: "gemini-2.5-flash" },
      { value: "deepseek-chat", label: "deepseek-chat" },
    ];

    return NextResponse.json(
      {
        success: true,
        modelOptions,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

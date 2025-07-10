import query from "@/src/lib/queryApi";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { Message } from "@/type";
import { adminDB } from "@/firebaseAdmin";

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();

  const { prompt, id, model, session } = await reqBody;

  try {
    if (!prompt) {
      return NextResponse.json(
        {
          message: "Please provide a propmt!",
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          message: "Please provide a valid chat ID!",
        },
        { status: 400 }
      );
    }

    const response = await query(prompt, id, model);

    const message: Message = {
      text: response || "PorsiAI was unable to find an answer for that!",
      createdAt: admin.firestore.Timestamp.now(),
      role: "assistant",
      user: {
        _id: "ai",
        name: "AI",
        avatar:
          "/image/logoAja.png",
      },
    };

    await adminDB
      .collection("users")
      .doc(session)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .add(message);

    return NextResponse.json(
      {
        answer: message?.text,
        message: "PorsiAI has responded!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

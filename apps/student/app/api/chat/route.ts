import { NextRequest, NextResponse } from "next/server";

const NEBULA_API_URL = "https://nebula-api.thirdweb.com/chat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const secretKey = process.env.TW_SECRET_KEY;

    if (!secretKey) {
      console.error("TW_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const response = await fetch(NEBULA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: JSON.stringify({
        message,
        stream: false,
        context: {
          chainIds: ["984123"],
          walletAddress: context?.walletAddress || null,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Nebula API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Nebula API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

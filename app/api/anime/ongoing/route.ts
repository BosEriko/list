import { NextResponse } from "next/server";
import AnimeController from "@controller/Anime";

export async function GET() {
  try {
    const ids = await AnimeController.get_ongoing_anime_ids();
    return NextResponse.json({ ids });
  } catch (err) {
    console.error("Anime ongoing API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

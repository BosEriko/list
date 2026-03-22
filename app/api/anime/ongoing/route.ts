import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/seasons/now", {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    const data = await res.json();

    const ongoingIds = data.data
      .filter((anime: any) => anime.status === "Currently Airing")
      .map((anime: any) => anime.mal_id);

    return NextResponse.json({ ids: ongoingIds });
  } catch (err) {
    console.error("Anime ongoing API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

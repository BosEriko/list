async function get_ongoing_anime_ids(): Promise<number[]> {
  try {
    const res = await fetch("https://api.jikan.moe/v4/seasons/now", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data
      .filter((anime: any) => anime.status === "Currently Airing")
      .map((anime: any) => anime.mal_id);
  } catch (error) {
    console.error("Failed to fetch ongoing anime:", error);
    return [];
  }
}

export default get_ongoing_anime_ids;

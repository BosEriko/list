async function get_ongoing_anime_ids(): Promise<number[]> {
  const res = await fetch("https://api.jikan.moe/v4/seasons/now", {
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  return data.data
    .filter((anime: any) => anime.status === "Currently Airing")
    .map((anime: any) => anime.mal_id);
}

export default get_ongoing_anime_ids;

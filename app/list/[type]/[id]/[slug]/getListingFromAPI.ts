const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export async function getListingFromAPI(type: string, id: string) {
  if (!["anime", "manga", "game", "movie"].includes(type)) {
    throw new Error("Invalid type");
  }

  const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}`, {
    next: { revalidate: ONE_MONTH }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }

  const json = await res.json();
  return json.data;
}

import Template from "@template";

type PageProps = {
  params: {
    id: string,
    type: string
  }
}

async function getListing(id: string, type: string) {
  if (!["anime", "manga"].includes(type)) {
    throw new Error("Invalid type")
  };

  const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}`, {
    next: { revalidate: 60 * 60 * 24 * 7 }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listing")
  }
  const json = await res.json()
  return json.data
}

export default async function ListingPage({ params }: PageProps) {
  const { id, type } = params;
  const listing = await getListing(id, type);

  return (
    <Template.Default orientation="center">
      <h1>{listing.title}</h1>

      <img
        src={listing.images.jpg.image_url}
        alt={listing.title}
        width={200}
      />

      <p><strong>Episodes:</strong> {listing.episodes}</p>
      <p><strong>Score:</strong> {listing.score}</p>
      <p>{listing.synopsis}</p>
    </Template.Default>
  )
}

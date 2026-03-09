import Template from "@template";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{
    query: string;
  }>;
};

type JikanItem = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  url: string;
  synopsis: string;
};

async function searchAnime(query: string): Promise<JikanItem[]> {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

async function searchManga(query: string): Promise<JikanItem[]> {
  const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export default async function Search({ params }: PageProps) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);

  const [anime, manga] = await Promise.all([
    searchAnime(decodedQuery),
    searchManga(decodedQuery),
  ]);

  return (
    <Template.Default orientation="center">
      <div className="p-6 space-y-10">
        <h1 className="text-3xl font-bold">Search: {decodedQuery}</h1>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Anime</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {anime.map((item) => (
              <a key={item.mal_id} href={`/list/anime/${item.mal_id}`}>
                <img
                  src={item.images.jpg.image_url}
                  alt={item.title}
                  className="rounded"
                />
                <p className="text-sm mt-2">{item.title}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Manga</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {manga.map((item) => (
              <a key={item.mal_id} href={`/list/manga/${item.mal_id}`}>
                <img
                  src={item.images.jpg.image_url}
                  alt={item.title}
                  className="rounded"
                />
                <p className="text-sm mt-2">{item.title}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </Template.Default>
  );
}

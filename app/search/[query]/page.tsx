import Template from "@template";
import MediaSection from "./MediaSection";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{
    query: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);

  return {
    title: `Search results for ${decodedQuery} | Bos Eriko List`,
    description: `Search results for ${decodedQuery} | Bos Eriko List.`,
    openGraph: {
      title: `Search results for ${decodedQuery} | Bos Eriko List`,
      description: `Search results for ${decodedQuery} | Bos Eriko List.`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Search results for ${decodedQuery} | Bos Eriko List`,
      description: `Search results for ${decodedQuery} | Bos Eriko List.`,
    },
  };
}

type JikanItem = {
  mal_id: number;
  title: string;
  images: any;
  url: string;
  synopsis: string;
  genres?: { name: string }[];
  themes?: { name: string }[];
  nsfw?: boolean;
};

function detectNSFW(item: any): boolean {
  if (item.nsfw === "black") return true;
  if (item.genres?.some((g: any) => g.name === "Hentai")) return true;
  if (item.themes?.some((t: any) => t.name === "Hentai")) return true;
  return false;
}

async function searchAnime(query: string): Promise<JikanItem[]> {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.data ?? []).map((item: any) => ({
    ...item,
    nsfw: detectNSFW(item),
  }));
}

async function searchManga(query: string): Promise<JikanItem[]> {
  const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.data ?? []).map((item: any) => ({
    ...item,
    nsfw: detectNSFW(item),
  }));
}

export default async function Search({ params }: PageProps) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);

  const [anime, manga] = await Promise.all([
    searchAnime(decodedQuery),
    searchManga(decodedQuery),
  ]);

  return (
    <Template.Default>
      <div className="p-6 space-y-10">
        <h1 className="text-3xl font-semibold">Search results for <span className="text-blue-600 font-bold">"{decodedQuery}"</span></h1>
        <MediaSection title="Anime" items={anime} />
        <MediaSection title="Manga" items={manga} />
      </div>
    </Template.Default>
  );
}

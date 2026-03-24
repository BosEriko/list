import Template from "@template";
import MediaSection from "./MediaSection";
import { Switch } from "antd";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{
    query: string;
  }>;
  searchParams: Promise<{
    nsfw?: string;
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
};

async function searchAnime(query: string, sfw: boolean): Promise<JikanItem[]> {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10&sfw=${sfw}`);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.data ?? [])
}

async function searchManga(query: string, sfw: boolean): Promise<JikanItem[]> {
  const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10&sfw=${sfw}`);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.data ?? [])
}

export default async function Search({ params, searchParams }: PageProps) {
  const { query } = await params;
  const { nsfw } = await searchParams;
  const decodedQuery = decodeURIComponent(query);
  const sfw = nsfw !== "true";

  const toggleUrl = `/search/${encodeURIComponent(decodedQuery)}?nsfw=${sfw ? "true" : "false"}`;

  const [anime, manga] = await Promise.all([
    searchAnime(decodedQuery, sfw),
    searchManga(decodedQuery, sfw),
  ]);

  return (
    <Template.Default>
      <div className="p-6 space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Search results for <span className="text-blue-600 font-bold">"{decodedQuery}"</span></h1>
          <div className="flex items-center gap-2">
            <span>NSFW</span>
            <a href={`/search/${encodeURIComponent(decodedQuery)}?nsfw=${sfw ? "true" : "false"}`}>
              <Switch checked={!sfw} />
            </a>
          </div>
        </div>
        <MediaSection title="Anime" items={anime} />
        <MediaSection title="Manga" items={manga} />
      </div>
    </Template.Default>
  );
}

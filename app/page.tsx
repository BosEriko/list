import Template from "@template";
import Atom from "@atom";

export async function generateMetadata() {
  return {
    title: `Welcome to Bos Eriko List`,
    description: `Welcome to Bos Eriko List`,
    openGraph: {
      title: `Welcome to Bos Eriko List`,
      description: `Welcome to Bos Eriko List`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Welcome to Bos Eriko List`,
      description: `Welcome to Bos Eriko List`,
    },
  };
}

type Episode = {
  title: string;
  mal_id: number;
  episode: string;
  url: string;
  images: {
    jpg: { image_url: string };
  };
};

export default async function Home() {
  const res = await fetch("https://api.jikan.moe/v4/schedules?filter=friday&page=1&limit=10&sfw=true", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  const episodes: Episode[] = data.data.slice(0, 10);

  return (
    <Template.Default>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Latest Anime Episodes</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {episodes.map((item, key) => (
            <Atom.Card
              type="Anime"
              item={item}
              key={key}
            />
          ))}
        </div>
      </div>
    </Template.Default>
  );
}

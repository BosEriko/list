import Template from "@template";

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
  entry: {
    mal_id: number;
    title: string;
    url: string;
    images: {
      jpg: { image_url: string };
    };
  };
  episode: string;
};

export default async function Home() {
  const res = await fetch("https://api.jikan.moe/v4/watch/episodes", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  const episodes: Episode[] = data.data.slice(0, 10);

  return (
    <Template.Default>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Latest Anime Episodes</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {episodes.map((item, index) => (
            <a
              key={item.entry.mal_id}
              href={`/list/${item.entry.url.replace("https://myanimelist.net/", "")}`}
              className="block hover:opacity-80 cursor-pointer"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  src={item.entry.images.jpg.image_url}
                  alt={item.entry.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm mt-2 line-clamp-2">{item.entry.title}</p>
            </a>
          ))}
        </div>
      </div>
    </Template.Default>
  );
}

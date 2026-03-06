import Template from "@template";
import { Poppins } from "next/font/google";

type Topics = Record<string, number>;

interface PictureStackProps {
  url: string;
}

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PictureStack: React.FC<PictureStackProps> = ({ url }) => {
  return (
    <div className="relative flex items-center justify-center aspect-square w-60 lg:w-80 xl:w-125 group">
      <div className="absolute rounded-md rotate-10 bg-[#f7b43d] w-full aspect-square opacity-70 transition-all duration-500 group-hover:rotate-3 scale-105 group-hover:scale-100 shadow-lg group-hover:shadow-md" />
      <div className="absolute rounded-md -rotate-6 bg-[#f7b43d] w-full aspect-square opacity-80 transition-all duration-500 group-hover:-rotate-2 scale-105 group-hover:scale-100 shadow-lg group-hover:shadow-md" />
      <div className="absolute rounded-md rotate-3 border-10 border-[#f7b43d] bg-cover bg-center w-full aspect-square overflow-hidden transition-all duration-500 group-hover:rotate-1 scale-110 group-hover:scale-100 shadow-lg group-hover:shadow-md">
        <img
          src={url}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default async function Home() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/boseriko/gh-data/refs/heads/main/topic-count.json",
      {
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch tags: ${res.status}`);
    }

    const topics: Topics = await res.json();

    return (
      <div>
        <Template.Default orientation="center">
          <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center mb-40 gap-10 mt-10">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 w-full">
              <h1
                className={`${poppins.className} text-6xl sm:text-8xl md:text-9xl font-bold text-gray-900 transition-all duration-500 ease-in-out hover:text-[#f7b43d]`}
              >
                Bos Eriko
              </h1>
              <hr className="bg-[#f7b43d] w-24 h-2 border-0 rounded-full" />
              <div className="text-lg md:text-xl text-gray-700">
                <span>I'm a </span>
                <span className="border-b-2 border-[#f7b43d]">
                  software engineer
                </span>
                <span> who likes </span>
                <span className="bg-yellow-300 texty-gray-700 px-1">anime</span>
                <span> and </span>
                <span className="bg-yellow-300 text-gray-700 px-1">
                  streaming
                </span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {Object.entries(topics).map(([topic, count]) => (
                  <a
                    key={topic}
                    href={`/topic/${topic}`}
                    className="rounded-full pl-3 pr-1 py-1 text-xs font-medium transition-all duration-300 ease-out uppercase flex gap-3 items-center cursor-pointer
                             bg-yellow-200 border border-yellow-300 text-yellow-600 hover:-translate-y-1 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    <span>{topic}</span>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center bg-yellow-500 text-yellow-200 text-xs">
                      {count}
                    </span>
                  </a>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="resume"
                  target="_blank"
                  className="px-6 py-2 rounded-md border-2 border-[#f7b43d] bg-[#f7b43d] text-gray-700 font-bold transition-all duration-300 ease-out
                         hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Resume
                </a>
                <a
                  href="/topic/product"
                  className="px-6 py-2 rounded-md border-2 border-[#f7b43d] bg-transparent text-[#f7b43d] font-bold transition-all duration-300 ease-out
                         hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer"
                >
                  View Products
                </a>
              </div>
            </div>
            <div className="flex justify-center items-center w-full md:w-auto">
              <PictureStack url="https://avatars.githubusercontent.com/BosEriko" />
            </div>
          </div>
        </Template.Default>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <Template.Default>
        <div className="p-8 font-sans">
          <p>Something went wrong.</p>
        </div>
      </Template.Default>
    );
  }
}

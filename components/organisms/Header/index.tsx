"use client";
import { useRouter } from "next/navigation";
import { Pixelify_Sans } from "next/font/google";
import { useState } from "react";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

const Header = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/search/${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <header className="text-black border-b border-gray-200 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <button onClick={() => router.push("/")}>
          <h2
            className={`${pixelify.className} text-3xl md:text-4xl font-bold text-[#f7b43d] cursor-pointer`}
          >
            BE
          </h2>
        </button>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search anime or manga..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 md:w-72 focus:outline-none focus:ring-2 focus:ring-[#f7b43d]"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;

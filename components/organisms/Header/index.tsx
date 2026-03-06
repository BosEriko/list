"use client";

import Navigation from "../Navigation";
import { useRouter } from "next/navigation";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

const Header = () => {
  const router = useRouter();

  return (
    <header className="text-black border-b border-gray-200 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        <button onClick={() => router.push("/")}>
          <h2
            className={`${pixelify.className} text-3xl md:text-4xl font-bold text-[#f7b43d] cursor-pointer`}
          >
            BE
          </h2>
        </button>
        <div>
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;

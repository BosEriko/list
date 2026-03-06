"use client";
import { ReactNode, Fragment, useEffect, useState } from "react";
import Link from "next/link";

interface ICardProps {
  url: string;
  coverPhotoUrl: string;
  fallbackCoverPhotoUrl?: string | null;
  children: ReactNode;
}

const Card: React.FunctionComponent<ICardProps> = ({
  url,
  coverPhotoUrl,
  fallbackCoverPhotoUrl = null,
  children,
}) => {
  const [coverUrl, setCoverUrl] = useState(fallbackCoverPhotoUrl);

  useEffect(() => {
    const img = new window.Image();
    img.src = coverPhotoUrl;

    img.onload = () => {
      setCoverUrl(coverPhotoUrl);
    };

    img.onerror = () => {
      setCoverUrl(fallbackCoverPhotoUrl);
    };
  }, [coverPhotoUrl, fallbackCoverPhotoUrl]);

  return (
    <div
      className="
        border rounded-lg bg-white border-gray-200 overflow-hidden cursor-pointer
        transition-all duration-300 ease-in-out
        hover:border-[#f7b43d] hover:scale-105 relative
      "
    >
      <Link href={url}>
        <div style={{ backgroundImage: `url('${coverUrl}')` }} className="aspect-2/1 bg-cover bg-center repo-cover"></div>
        <div className="p-5 mb-10">{children}</div>
      </Link>
    </div>
  );
};

export default Card;

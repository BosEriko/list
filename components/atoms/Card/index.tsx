"use client";
import Atom from "@atom";
import { ReactNode } from "react";
import { Card as AntCard } from 'antd';

interface CardProps {
  type: string;
  item: any;
  key: number;
  isBlurred?: boolean;
}

const Card: React.FunctionComponent<CardProps> = ({
  type,
  item,
  key,
  isBlurred = false,
}) => {
  return (
    <a href={`/list/${item.url.replace("https://myanimelist.net/", "")}`} key={key}>
      <AntCard
        hoverable
        cover={
          <div className="aspect-[2/3] w-full overflow-hidden rounded-md relative">
            <img
              src={item.images.jpg.image_url}
              alt={item.title}
              className={`w-full h-full object-cover transition-all duration-300 ${isBlurred ? "blur-xl" : ""}`}
              draggable={false}
            />
            <Atom.Visibility state={isBlurred}>
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold bg-black/20">
                NSFW
              </div>
            </Atom.Visibility>
          </div>
        }
      >
        <AntCard.Meta title={item.title} description={`${item.type ?? item.mal_id}${item.score ? " • " + item.score : ""}`} />
      </AntCard>
    </a>
  );
};

export default Card;

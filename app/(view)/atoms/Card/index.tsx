"use client";
import Atom from "@atom";
import { ReactNode } from "react";
import { Card as AntCard } from 'antd';

interface CardProps {
  type: string;
  item: any;
  index: number;
}

const Card: React.FunctionComponent<CardProps> = ({
  type,
  item,
  index,
}) => {
  return (
    <a href={`/list/${item.url.replace("https://myanimelist.net/", "")}`} key={index}>
      <AntCard
        hoverable
        cover={
          <div className="aspect-[2/3] w-full overflow-hidden rounded-md relative">
            <img
              src={item.images.jpg.image_url}
              alt={item.title_english ?? item.title}
              className={`w-full h-full object-cover transition-all duration-300`}
              draggable={false}
            />
          </div>
        }
      >
        <AntCard.Meta title={item.title_english ?? item.title} description={`${item.type ?? item.mal_id}${item.score ? " • " + item.score : ""}`} />
      </AntCard>
    </a>
  );
};

export default Card;

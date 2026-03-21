"use client";
import { ReactNode } from "react";
import { Card as AntCard } from 'antd';

interface CardProps {
  type: string;
  item: any;
  key: number;
}

const Card: React.FunctionComponent<CardProps> = ({
  type,
  item,
  key,
}) => {
  return (
    <a href={`/list/${item.url.replace("https://myanimelist.net/", "")}`} key={key}>
      <AntCard
        hoverable
        cover={
          <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
            <img
              src={item.images.jpg.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        }
      >
        <AntCard.Meta title={item.title} description={`${item.type}${item.score ? " • " + item.score : ""}`} />
      </AntCard>
    </a>
  );
};

export default Card;

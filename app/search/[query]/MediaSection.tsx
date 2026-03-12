"use client";
import { Card } from 'antd';

export default function MediaSection({ title, items }: { title: string; items: any[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {items.map((item) => (
          <a href={`/list/${item.url.replace("https://myanimelist.net/", "")}`} key={item.mal_id}>
            <Card
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
              <Card.Meta title={item.title} description={`${item.type}${item.score ? " • " + item.score : ""}`} />
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
};

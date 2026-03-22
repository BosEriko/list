import Atom from "@atom";

export default function MediaSection({ title, items }: { title: string; items: any[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {items.map((item, key) => (
          <Atom.Card
            type={title}
            item={item}
            key={key}
            isBlurred={item.nsfw}
          />
        ))}
      </div>
    </section>
  );
};

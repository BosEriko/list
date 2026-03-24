import Template from "@template";
import Molecule from "@molecule";
import { getItemFromFirebase } from "./getItemFromFirebase";

type PageProps = {
  params: {
    type: "anime" | "manga";
    id: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const { type, id } = await params;
  const listing = await getItemFromFirebase(id, type);

  return {
    title: `${listing.title} | Bos Eriko List`,
    description: `${listing.synopsis} | Bos Eriko List.`,
    openGraph: {
      title: `${listing.title} | Bos Eriko List`,
      description: `${listing.synopsis} | Bos Eriko List.`,
      images: [listing.images.jpg.image_url || ""],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.title} | Bos Eriko List`,
      description: `${listing.synopsis} | Bos Eriko List.`,
      images: [listing.images.jpg.image_url || ""],
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { type, id } = await params;
  const listing = await getItemFromFirebase(id, type);

  const sidebarContent = [
    {
      title: "Episodes",
      content: listing.totalCount,
    },
    {
      title: "Score",
      content: listing.score,
    },
  ];

  return (
    <Template.Default>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 lg:w-[300px] w-full">
          <div className="w-full">
            <img
              className="w-full rounded-md object-cover"
              src={listing.images.jpg.image_url}
              alt={listing.title}
            />
          </div>
          <div>
            <Molecule.ModalListing
              itemId={id}
              type={type}
              title={listing.title}
              count={0}
              totalCount={listing.totalCount}
              imageUrl={listing.images.jpg.small_image_url}
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-5 flex flex-col gap-3">
            {sidebarContent.map((content, index) => (
              <div className="flex flex-col gap-1" key={index}>
                <div className="font-semibold text-gray-600 text-sm">
                  {content.title}
                </div>
                <div className="text-md">{content.content}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
            {listing.title}
          </h1>
          <div className="bg-white border border-gray-200 rounded-md p-5">
            {listing.synopsis}
          </div>
        </div>
      </div>
    </Template.Default>
  );
}

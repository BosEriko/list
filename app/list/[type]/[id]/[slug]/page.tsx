import Template from "@template";
import Molecule from "@molecule";
import { getListingFromFirebase } from "./getListingFromFirebase";

type PageProps = {
  params: {
    type: "anime" | "manga";
    id: string;
  };
};

export default async function ListingPage({ params }: PageProps) {
  const { type, id } = await params;
  const listing = await getListingFromFirebase(id, type);

  const sidebarContent = [
    {
      title: "Epsiodes",
      content: listing.totalCount
    },
    {
      title: "Score",
      content: listing.score
    }
  ];

  return (
    <Template.Default>
      <div className="flex gap-3">
        <div className="flex flex-col gap-3">
          <div>
            <img
              className="w-300 rounded-md"
              src={listing.images.jpg.image_url}
              alt={listing.title}
            />
          </div>
          <div>
            <Molecule.ListingEditor
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
                <div className="font-semibold text-gray-600 text-sm">{content.title}</div>
                <div className="text-md">{content.content}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl">{listing.title}</h1>
          <div className="bg-white border border-gray-200 rounded-md p-5">
            {listing.synopsis}
          </div>
        </div>
      </div>
    </Template.Default>
  );
}

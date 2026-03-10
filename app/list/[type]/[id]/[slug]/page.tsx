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

  return (
    <Template.Default orientation="center">
      <h1>{listing.title}</h1>

      <img
        src={listing.images.jpg.image_url}
        alt={listing.title}
        width={200}
      />

      <p><strong>Episodes:</strong> {listing.totalCount}</p>
      <p><strong>Score:</strong> {listing.score}</p>
      <p>{listing.synopsis}</p>

      <Molecule.ListingEditor
        itemId={id}
        type={type}
        title={listing.title}
        count={0}
        totalCount={listing.totalCount}
        imageUrl={listing.images.jpg.small_image_url}
      />
    </Template.Default>
  );
}

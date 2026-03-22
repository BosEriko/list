"user client";
import Molecule from "@molecule";
import Listing from "@model/Listing";

type ListingType = "anime" | "manga" | "game" | "movie";

interface ListingTableProps {
  type?: ListingType;
  status?: number;
  id: string;
}

interface Listing {
  count: number;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  userId: string;
}

export default async function ListingTable({ type = "anime", status = 3, id }: ListingTableProps) {
  let listings = await Listing.where({ userId: id });

  if (type) {
    listings = listings.filter((listing: Listing) => listing.type === type);
  }

  if (status !== undefined) {
    listings = listings.filter((listing: Listing) => listing.status === status);
  }

  return (
    <table className="table-auto w-full border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th></th>
          <th className="text-left">Title</th>
          <th className="text-left w-px">Progress</th>
          <th className="text-left w-px">Status</th>
          <th className="w-px"></th>
        </tr>
      </thead>
      <tbody>
        {listings.map((listing, key) => (
          <Molecule.ListingEditor
            itemId={listing.itemId}
            type={listing.type}
            title={listing.title}
            count={listing.count}
            totalCount={listing.totalCount}
            imageUrl={listing.imageUrl}
            userId={listing.userId}
            listingUrl={listing.listingUrl}
            status={listing.status}
            isModal={false}
            key={key}
          />
        ))}
      </tbody>
    </table>
  );
}

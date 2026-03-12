import Template from "@template";
import Molecule from "@molecule";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@lib/Firebase";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

interface Listing {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number | null;
  imageUrl: string;
  listingUrl: string;
  status: number;
  userId: string;
}

export default async function User({ params }: PageProps) {
  const { id } = await params;

  const listingsQuery = query(
    collection(db, "listings"),
    where("userId", "==", id)
  );

  const snapshot = await getDocs(listingsQuery);

  const listings: Listing[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Listing, "id">),
  }));

  return (
    <Template.Default>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 lg:w-[300px] w-full">
          <div className="w-full">
            sidebar
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <table className="table-auto w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Progress</th>
                <th>Status</th>
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
                  listingUrl={listing.listingUrl}
                  status={listing.status}
                  isModal={false}
                  key={key}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Template.Default>
  );
}

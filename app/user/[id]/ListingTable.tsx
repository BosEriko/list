"use client";
import Molecule from "@molecule";
import Listing from "@model/Listing";
import { Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import useListingFilterStore from "@store/useListingFilterStore";

type ListingType = "anime" | "manga" | "game" | "movie";

interface ListingTableProps {
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
  isOngoing?: boolean;
}

export default function ListingTable({ id }: ListingTableProps) {
  const { status, type } = useListingFilterStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        let userListings = await Listing.where({ userId: id });

        if (type === "anime" && userListings.length > 0) {
          const res = await fetch("/api/anime/ongoing");
          const data = await res.json();
          const ongoingSet = new Set<number>(data.ids);
          userListings = userListings.map((listing) => ({ ...listing, isOngoing: ongoingSet.has(Number(listing.itemId)) }));
        } else {
          userListings = userListings.map((listing) => ({ ...listing, isOngoing: false }));
        }

        userListings = userListings.filter((listing: Listing) => listing.type === type && listing.status === status);

        setListings(userListings);
      } catch (err) {
        console.error("ListingTable load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, type, status]);

  if (loading) return <Spin className="py-10 w-full" />;

  if (listings.length === 0) {
    return (
      <div className="w-full py-10">
        <Empty description={`No ${type} listings found`} />
      </div>
    );
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
            isOngoing={listing.isOngoing}
          />
        ))}
      </tbody>
    </table>
  );
}

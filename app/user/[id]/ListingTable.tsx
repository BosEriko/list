"use client";
import Molecule from "@molecule";
import Listing from "@model/Listing";
import { Empty, Spin } from "antd";
import { useEffect, useState, useMemo } from "react";
import useListingStore from "@store/useListingStore";

type ListingType = "anime" | "manga" | "game";

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
  isOngoing: boolean;
}

export default function ListingTable({ id }: ListingTableProps) {
  const { status, type, listings, setListings, reset } = useListingStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      reset();
      setLoading(true);
      try {
        let userListings: Listing[] = await Listing.where({ userId: id });
        if (userListings.some((l) => l.type === "anime")) {
          const res = await fetch("/api/anime/ongoing");
          const data = await res.json();
          const ongoingSet = new Set<number>(data.ids);
          userListings = userListings.map((listing) => ({
            ...listing,
            isOngoing: listing.type === "anime" ? ongoingSet.has(Number(listing.itemId)) : false,
          }));
        } else {
          userListings = userListings.map((listing) => ({ ...listing, isOngoing: false }));
        }
        setListings(userListings);
      } catch (err) {
        console.error("ListingTable load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, reset, setListings]);

  const filteredListings = useMemo(
    () => listings.filter((listing) => listing.type === type && listing.status === status),
    [listings, type, status]
  );

  if (loading) return <Spin className="py-10 w-full" />;

  if (filteredListings.length === 0) {
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
        {filteredListings.map((listing) => (
          <tr key={`${listing.type}-${listing.itemId}`}>
            <Molecule.InlineListing
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
              isOngoing={listing.isOngoing}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

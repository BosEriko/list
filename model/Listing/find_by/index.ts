import where from "../where";

type ListingType = "anime" | "manga" | "game" | "movie";

interface IListing {
  count: number;
  createdAt: any;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  updatedAt: any;
  userId: string;
}

const find_by = async (filters: Partial<IListing>): Promise<IListing | null> => {
  const results = await where(filters);
  return results.length > 0 ? results[0] : null;
};

export default find_by;

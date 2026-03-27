import where from "../where";
import MediaType from "@type/MediaType";

interface Listing {
  count: number;
  createdAt: any;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: MediaType;
  updatedAt: any;
  userId: string;
}

const find_by = async (filters: Partial<Listing>): Promise<Listing | null> => {
  const results = await where(filters);
  return results.length > 0 ? results[0] : null;
};

export default find_by;

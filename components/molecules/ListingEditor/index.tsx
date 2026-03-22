"use client";
import InlineEditor from "./InlineEditor";
import ModalEditor from "./ModalEditor";

type ListingType = "anime" | "manga" | "game" | "movie";

interface ListingEditorProps {
  count: number;
  imageUrl: string;
  isModal?: boolean;
  isOngoing?: boolean;
  itemId: string;
  key?: number | null
  listingUrl?: string;
  status?: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  userId?: string;
}

const ListingEditor: React.FC<ListingEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  imageUrl,
  userId = "",
  listingUrl = "",
  status = 1,
  isModal = true,
  key = null,
  isOngoing = false,
}) => {
  if (isModal) {
    return (
      <ModalEditor
        itemId={itemId}
        type={type}
        title={title}
        count={count}
        totalCount={totalCount}
        imageUrl={imageUrl}
      />
    );
  }

  return (
    <InlineEditor
      itemId={itemId}
      type={type}
      title={title}
      count={count}
      totalCount={totalCount}
      imageUrl={imageUrl}
      userId={userId}
      listingUrl={listingUrl}
      status={status}
      key={key}
      isOngoing={isOngoing}
    />
  );
};

export default ListingEditor;

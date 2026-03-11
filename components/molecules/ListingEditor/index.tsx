"use client";
import InlineEditor from "./InlineEditor";
import ModalEditor from "./ModalEditor";

interface IListingEditorProps {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number | null;
  imageUrl: string;
  status?: number;
  isModal?: boolean;
  key?: number | null
}

const ListingEditor: React.FC<IListingEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  imageUrl,
  status = 1,
  isModal = true,
  key = null,
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
      status={status}
      key={key}
    />
  );
};

export default ListingEditor;

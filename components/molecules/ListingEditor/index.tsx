"use client";
import Link from "next/link";

interface IListingEditorProps {
  itemId: string;
  type: string;
  title: string;
  count: Integer;
  totalCount: Integer;
  status: Integer;
  image_url: string;
}

const ListingEditor: React.FunctionComponent<IListingEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  status,
  image_url,
}) => {
  return (
    <div>
      <div>Listing Editor</div>
      <div>Item ID: {itemId}</div>
      <div>Type: {type}</div>
      <div>Title: {title}</div>
      <div>Count: {count}</div>
      <div>Total Count: {totalCount}</div>
      <div>status: {status}</div>
      <div>Image URL: {image_url}</div>
    </div>
  );
};

export default ListingEditor;

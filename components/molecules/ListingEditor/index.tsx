"use client";
import Link from "next/link";

interface IListingEditorProps {
  id: string;
}

const ListingEditor: React.FunctionComponent<IListingEditorProps> = ({
  id,
}) => {
  return (
    <div>Listing Editor for {id}</div>
  );
};

export default ListingEditor;

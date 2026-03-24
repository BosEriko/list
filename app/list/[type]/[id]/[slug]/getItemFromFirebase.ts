import { getItemFromAPI } from "./getItemFromAPI";
import Item from "@model/Item";

type ItemType = "anime" | "manga" | "game" | "movie";

type Item = {
  itemId: string;
  type: ItemType;
  images: any;
  title: string;
  totalCount: number | null;
  status: string;
  synopsis: string;
  score: number;
  updatedAt: any;
};

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export async function getItemFromFirebase(id: string, type: ItemType): Promise<Item> {
  if (!["anime", "manga", "game", "movie"].includes(type)) {
    throw new Error("Invalid type");
  }

  const itemId = `${type}-${id}`
  const jikan = await getItemFromAPI(type, id);
  const item = await Item.find(itemId);

  if (!!item) {
    const updatedAt = item?.updatedAt?.toMillis?.() ?? 0;

    if (Date.now() - updatedAt < ONE_MONTH) {
      return item as Item;
    }
  }

  const dataToSave = {
    images: jikan.images,
    itemId: id,
    score: jikan.score,
    status: jikan.status,
    synopsis: jikan.synopsis,
    title: jikan.title_english,
    totalCount: jikan.episodes ?? jikan.chapters ?? null,
    type,
  };

  if (!!item) {
    await Item.update(itemId, dataToSave);
  } else {
    await Item.create(itemId, dataToSave);
  }

  return {
    ...dataToSave,
    updatedAt: new Date(),
  };
}

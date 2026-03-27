import { getItemFromAPI } from "./getItemFromAPI";
import TimestampConverter from "@lib/TimestampConverter";
import Item from "@model/Item";
import { ItemType } from "@schema";
import MEDIA from "@constant/MEDIA";
import ITEM_ID_PATTERN from "@constant/ITEM_ID_PATTERN";
import MediaType from "@type/MediaType";

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export async function getItemFromFirebase(id: string, type: MediaType): Promise<ItemType | null> {
  const itemId = `${type}-${id}`;

  if (!MEDIA.includes(type)) {
    throw new Error("Invalid type");
  }

  if (!ITEM_ID_PATTERN.test(itemId)) {
    console.error(`Malformed ID: ${itemId}`);
    return null;
  }

  const jikan = await getItemFromAPI(type, id);
  const item = await Item.find(itemId);

  if (!!item) {
    const updatedAt = TimestampConverter(item?.updatedAt) ?? 0;

    if (Date.now() - updatedAt < ONE_MONTH) {
      return item as ItemType;
    }
  }

  const dataToSave = {
    images: jikan.images,
    itemId: id,
    score: jikan.score,
    status: jikan.status,
    synopsis: jikan.synopsis,
    title: jikan.title_english ?? jikan.title,
    totalCount: jikan.episodes ?? jikan.chapters ?? null,
    type,
  };

  if (!!item) {
    await Item.update(dataToSave, itemId);
  } else {
    await Item.create(dataToSave, itemId);
  }

  return {
    ...dataToSave,
    updatedAt: new Date(),
  };
}

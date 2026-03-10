import Template from "@template";
import Molecule from "@molecule";

import FirebaseAdmin from "@lib/FirebaseAdmin";

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

type PageProps = {
  params: {
    type: string,
    id: string
  }
}

async function fetchFromJikan(type: string, id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}`, {
    next: { revalidate: ONE_MONTH }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listing")
  }

  const json = await res.json();
  return json.data;
}

async function getListing(id: string, type: string) {
  if (!["anime", "manga"].includes(type)) {
    throw new Error("Invalid type")
  }

  const db = FirebaseAdmin.firestore();

  const docId = `${type}-${id}`;
  const ref = db.collection("items").doc(docId);
  const snapshot = await ref.get();

  if (snapshot.exists) {
    const data = snapshot.data();

    const updatedAt = data?.updatedAt?.toMillis?.() ?? 0;

    if (Date.now() - updatedAt < ONE_MONTH) {
      return data;
    }
  }

  const jikan = await fetchFromJikan(type, id);

  const existingData = snapshot.exists ? snapshot.data() : null;

  const dataToSave = {
    itemId: id,
    type,
    images: jikan.images,
    title: jikan.title,
    totalCount: jikan.episodes,
    status: jikan.status,
    synopsis: jikan.synopsis,
    score: jikan.score,
    createdAt: existingData?.createdAt ?? FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
    updatedAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(dataToSave, { merge: true });

  return {
    ...dataToSave,
    updatedAt: new Date()
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { type, id } = await params;
  const listing = await getListing(id, type);

  return (
    <Template.Default orientation="center">
      <h1>{listing.title}</h1>

      <img
        src={listing.images.jpg.image_url}
        alt={listing.title}
        width={200}
      />

      <p><strong>Episodes:</strong> {listing.totalCount}</p>
      <p><strong>Score:</strong> {listing.score}</p>
      <p>{listing.synopsis}</p>

      <Molecule.ListingEditor
        itemId={id}
        type={type}
        title={listing.title}
        count={0}
        totalCount={listing.totalCount}
        imageUrl={listing.images.jpg.small_image_url}
      />
    </Template.Default>
  )
}

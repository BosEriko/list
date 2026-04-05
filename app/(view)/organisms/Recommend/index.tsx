"use client";
import { useEffect, useState } from "react";
import Atom from "@atom";

const Recommend = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/recommendations/anime");
        const data = await res.json();

        const parsed = data.data
          .flatMap((item: any) => item.entry)
          .slice(0, 20);

        setRecommendations(parsed);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Anime Recommendations</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.map((item, index) => (
              <div key={index}>
                <Atom.Card
                  type="Anime"
                  item={item}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;

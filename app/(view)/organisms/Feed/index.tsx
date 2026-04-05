"use client";
import { useEffect, useState } from "react";
import { rtdb } from "@lib/Firebase";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import useAuthStore from "@store/useAuthStore";

type Post = {
  id: string;
  user: string;
  content: string;
  createdAt: number;
};

const Feed = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const postsRef = ref(rtdb, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) return setPosts([]);

      const parsed: Post[] = Object.entries(data).map(
        ([id, value]: any) => ({ id, ...value })
      );

      parsed.sort((a, b) => b.createdAt - a.createdAt);

      setPosts(parsed);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!content.trim() || !user) return;

    const postsRef = ref(rtdb, "posts");

    await push(postsRef, {
      displayName: user.displayName,
      uid: user.uid,
      content,
      createdAt: Date.now(),
    });

    setContent("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handlePost}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow">
            <p className="font-semibold">{post.displayName}</p>
            <p className="mt-2">{post.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;

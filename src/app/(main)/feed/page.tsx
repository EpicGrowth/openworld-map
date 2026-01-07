import { createClient } from "@/lib/supabase/server";
import { FeedContent } from "./feed-content";
import type { Post, PostCategory } from "@/types";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch posts with authors
  const { data: postsData } = await supabase
    .from("posts")
    .select(`
      *,
      author:users!posts_author_id_fkey (
        id, name, username, avatar_url, level, points
      ),
      media:post_media (
        id, type, url, thumbnail, width, height, sort_order
      )
    `)
    .order("created_at", { ascending: false })
    .limit(20);

  // Transform the data to match our types
  const posts: Post[] = (postsData || []).map((post) => ({
    id: post.id,
    authorId: post.author_id,
    content: post.content,
    category: post.category as PostCategory,
    categorySource: post.category_source,
    location: post.location,
    city: post.city,
    address: post.address,
    helpfulCount: post.helpful_count,
    commentCount: post.comment_count,
    isEdited: post.is_edited,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    expiresAt: post.expires_at,
    author: post.author ? {
      id: post.author.id,
      email: null,
      phone: null,
      name: post.author.name,
      username: post.author.username,
      avatarUrl: post.author.avatar_url,
      bio: null,
      points: post.author.points,
      level: post.author.level,
      currentCity: null,
      lastLocation: null,
      lastActiveAt: null,
      createdAt: "",
      updatedAt: "",
    } : undefined,
    media: post.media?.map((m: { id: string; type: string; url: string; thumbnail: string | null; width: number | null; height: number | null; sort_order: number }) => ({
      id: m.id,
      postId: post.id,
      type: m.type as "IMAGE" | "VIDEO",
      url: m.url,
      thumbnail: m.thumbnail,
      width: m.width,
      height: m.height,
      duration: null,
      sortOrder: m.sort_order,
      createdAt: "",
    })),
  }));

  return <FeedContent posts={posts} isLoggedIn={!!user} />;
}

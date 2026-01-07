import { createClient } from "@/lib/supabase/server";
import { LeaderboardContent } from "./leaderboard-content";
import type { UserLevel } from "@/types";

interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  points: number;
  level: UserLevel;
  postCount: number;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch top users by points
  const { data: usersData } = await supabase
    .from("users")
    .select("id, name, username, avatar_url, points, level")
    .order("points", { ascending: false })
    .limit(50);

  // Get post counts for these users
  const userIds = usersData?.map((u) => u.id) || [];
  const { data: postCounts } = await supabase
    .from("posts")
    .select("author_id")
    .in("author_id", userIds);

  // Count posts per user
  const postCountMap: Record<string, number> = {};
  postCounts?.forEach((post) => {
    postCountMap[post.author_id] = (postCountMap[post.author_id] || 0) + 1;
  });

  // Get aggregate stats
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  // Transform data
  const leaderboardUsers: LeaderboardUser[] = (usersData || []).map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatar_url,
    points: user.points,
    level: user.level as UserLevel,
    postCount: postCountMap[user.id] || 0,
  }));

  const stats = {
    totalUsers: totalUsers || 0,
    totalPosts: totalPosts || 0,
    activeToday: Math.floor(Math.random() * 50) + 10, // Placeholder
    totalHelpfulVotes: Math.floor(Math.random() * 500) + 100, // Placeholder
  };

  return <LeaderboardContent users={leaderboardUsers} stats={stats} />;
}

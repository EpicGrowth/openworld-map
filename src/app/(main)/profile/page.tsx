import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileContent } from "./profile-content";
import type { User, UserType, UserLevel } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Get user types
  const { data: userTypes } = await supabase
    .from("user_types")
    .select("type")
    .eq("user_id", authUser.id);

  // Get user's post count
  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", authUser.id);

  // Get helpful votes received
  const { data: userPosts } = await supabase
    .from("posts")
    .select("helpful_count")
    .eq("author_id", authUser.id);

  const helpfulVotes = userPosts?.reduce((sum, post) => sum + post.helpful_count, 0) || 0;

  // Get user badges
  const { data: badges } = await supabase
    .from("user_badges")
    .select(`
      badge:badges (
        id, name, description, icon, requirement_type, requirement_value
      ),
      earned_at
    `)
    .eq("user_id", authUser.id);

  const user: User = {
    id: profile.id,
    email: profile.email,
    phone: profile.phone,
    name: profile.name,
    username: profile.username,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    points: profile.points,
    level: profile.level as UserLevel,
    currentCity: profile.current_city,
    lastLocation: profile.last_location,
    lastActiveAt: profile.last_active_at,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    userTypes: userTypes?.map((ut) => ut.type as UserType) || [],
  };

  const userBadges = badges?.map((b) => {
    // Handle both array and object return types from Supabase
    const badge = Array.isArray(b.badge) ? b.badge[0] : b.badge;
    return {
      id: badge?.id || "",
      name: badge?.name || "",
      description: badge?.description || "",
      icon: badge?.icon || "",
      earnedAt: b.earned_at,
    };
  }) || [];

  const stats = {
    posts: postCount || 0,
    helpfulVotes,
    level: profile.level as UserLevel,
    points: profile.points,
  };

  return <ProfileContent user={user} badges={userBadges} stats={stats} />;
}

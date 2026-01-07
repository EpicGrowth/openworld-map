import { createClient } from "@/lib/supabase/server";
import { MainLayout } from "@/components/layout";
import type { User } from "@/types";

export default async function MainGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let user: User | null = null;

  if (authUser) {
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profile) {
      // Get user types
      const { data: userTypes } = await supabase
        .from("user_types")
        .select("type")
        .eq("user_id", authUser.id);

      user = {
        id: profile.id,
        email: profile.email,
        phone: profile.phone,
        name: profile.name,
        username: profile.username,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        points: profile.points,
        level: profile.level,
        currentCity: profile.current_city,
        lastLocation: profile.last_location,
        lastActiveAt: profile.last_active_at,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        userTypes: userTypes?.map((ut) => ut.type) || [],
      };
    }
  }

  return <MainLayout user={user}>{children}</MainLayout>;
}

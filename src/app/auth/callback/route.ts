import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // If no profile, create one (for OAuth users)
      if (!profile) {
        const name = data.user.user_metadata?.full_name ||
                     data.user.user_metadata?.name ||
                     data.user.email?.split("@")[0] ||
                     "User";

        const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const username = `${baseUsername}${Date.now().toString().slice(-4)}`;

        await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          name,
          username,
          avatar_url: data.user.user_metadata?.avatar_url,
        });

        // Redirect to onboarding for new OAuth users
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin));
      }

      // Check if user has selected types
      const { data: userTypes } = await supabase
        .from("user_types")
        .select("type")
        .eq("user_id", data.user.id);

      if (!userTypes || userTypes.length === 0) {
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin));
      }
    }
  }

  // Redirect to feed after successful auth
  return NextResponse.redirect(new URL("/feed", requestUrl.origin));
}

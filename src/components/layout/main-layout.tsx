"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "./top-nav";
import { BottomNav } from "./bottom-nav";
import { CreatePostModal } from "@/components/create-post-modal";
import { createClient } from "@/lib/supabase/client";
import type { User, PostCategory } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const handleCreatePost = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleSubmitPost = async (data: {
    content: string;
    category: PostCategory;
    location?: { lat: number; lng: number };
    address?: string;
  }) => {
    const supabase = createClient();

    const postData: {
      author_id: string;
      content: string;
      category: PostCategory;
      category_source: "AUTO" | "MANUAL";
      city: string;
      address: string | null;
      location?: unknown;
    } = {
      author_id: user!.id,
      content: data.content,
      category: data.category,
      category_source: "MANUAL",
      city: user?.currentCity || "Unknown",
      address: data.address || null,
    };

    // Add location if available
    if (data.location) {
      postData.location = `POINT(${data.location.lng} ${data.location.lat})`;
    }

    const { error } = await supabase.from("posts").insert(postData);

    if (error) {
      throw new Error(error.message);
    }

    // Refresh the page to show new post
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav user={user} />

      {/* Main Content - offset by nav height */}
      <main className="pt-16 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      <BottomNav onCreatePost={handleCreatePost} />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitPost}
      />
    </div>
  );
}

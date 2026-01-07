"use client";

import { useState } from "react";
import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import type { Post, PostCategory } from "@/types";
import Link from "next/link";

interface FeedContentProps {
  posts: Post[];
  isLoggedIn: boolean;
}

const categories: { value: PostCategory | "ALL"; label: string; icon: string }[] = [
  { value: "ALL", label: "All", icon: "📋" },
  { value: "TRAFFIC", label: "Traffic", icon: "🚗" },
  { value: "SAFETY", label: "Safety", icon: "⚠️" },
  { value: "DEALS", label: "Deals", icon: "🏷️" },
  { value: "AMENITIES", label: "Amenities", icon: "☕" },
  { value: "GENERAL", label: "General", icon: "💬" },
];

export function FeedContent({ posts, isLoggedIn }: FeedContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | "ALL">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredPosts = selectedCategory === "ALL"
    ? posts
    : posts.filter((post) => post.category === selectedCategory);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // In a real app, this would refetch data
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Login Prompt for non-authenticated users */}
      {!isLoggedIn && (
        <div className="bg-card border border-border rounded-xl p-6 text-center mb-6">
          <p className="text-muted-foreground mb-4">
            Join the community to post updates and interact with other gig workers.
          </p>
          <Button asChild>
            <Link href="/login">Login to Post</Link>
          </Button>
        </div>
      )}

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Community Feed</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => {}}
              onComment={() => {}}
              onShare={() => {}}
            />
          ))
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground mb-2">No posts yet</p>
            <p className="text-sm text-muted-foreground">
              {selectedCategory === "ALL"
                ? "Be the first to share something with the community!"
                : `No ${selectedCategory.toLowerCase()} updates yet.`}
            </p>
          </div>
        )}
      </div>

      {/* Load More (placeholder for infinite scroll) */}
      {filteredPosts.length >= 20 && (
        <div className="text-center mt-6">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}

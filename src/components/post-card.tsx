"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MapPin, ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post, PostCategory } from "@/types";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const categoryConfig: Record<PostCategory, { label: string; icon: string; variant: "traffic" | "safety" | "deals" | "amenities" | "general" }> = {
  TRAFFIC: { label: "Traffic", icon: "🚗", variant: "traffic" },
  SAFETY: { label: "Safety", icon: "⚠️", variant: "safety" },
  DEALS: { label: "Deals", icon: "🏷️", variant: "deals" },
  AMENITIES: { label: "Amenities", icon: "☕", variant: "amenities" },
  GENERAL: { label: "General", icon: "💬", variant: "general" },
};

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const category = categoryConfig[post.category];
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  return (
    <article className="bg-card border border-border rounded-xl p-4 md:p-6 transition-colors hover:border-border/80">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          src={post.author?.avatarUrl}
          name={post.author?.name}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate">
              {post.author?.name || "Anonymous"}
            </span>
            <span className="text-muted-foreground text-sm">
              @{post.author?.username || "unknown"}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timeAgo}</span>
          </div>
          <Badge variant={category.variant} size="sm" className="mt-1">
            {category.icon} {category.label}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Location */}
      {post.address && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{post.address}</span>
        </div>
      )}

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-3">{post.content}</p>

      {/* Media */}
      {post.media && post.media.length > 0 && post.media[0] && (
        <div className="mb-3 rounded-lg overflow-hidden bg-secondary">
          {post.media[0].type === "IMAGE" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.media[0].url}
              alt="Post media"
              className="w-full h-48 md:h-56 object-cover"
            />
          ) : (
            <video
              src={post.media[0].url}
              controls
              className="w-full h-48 md:h-56 object-cover"
            />
          )}
        </div>
      )}

      {/* Stats */}
      {post.helpfulCount > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground pb-3 border-b border-border mb-3">
          <ThumbsUp className="w-4 h-4" />
          <span>
            {post.helpfulCount} {post.helpfulCount === 1 ? "person" : "people"} found this helpful
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-around">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 text-muted-foreground hover:text-primary",
            isLiked && "text-primary"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
          <span>Helpful</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => onComment?.(post.id)}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
          {post.commentCount > 0 && (
            <span className="text-xs">({post.commentCount})</span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => onShare?.(post.id)}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </div>
    </article>
  );
}

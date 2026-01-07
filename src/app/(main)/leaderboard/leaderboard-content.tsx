"use client";

import { useState } from "react";
import { TrendingUp, Award, Star, Target, Heart, UsersRound, Crown, Medal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
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

interface LeaderboardContentProps {
  users: LeaderboardUser[];
  stats: {
    totalUsers: number;
    totalPosts: number;
    activeToday: number;
    totalHelpfulVotes: number;
  };
  currentUserRank?: number;
}

const levelConfig: Record<UserLevel, { color: string; bgColor: string }> = {
  BRONZE: { color: "text-[#CD7F32]", bgColor: "bg-[#CD7F32]/20" },
  SILVER: { color: "text-[#C0C0C0]", bgColor: "bg-[#C0C0C0]/20" },
  GOLD: { color: "text-[#FFD700]", bgColor: "bg-[#FFD700]/20" },
  PLATINUM: { color: "text-[#E5E4E2]", bgColor: "bg-[#E5E4E2]/20" },
};

const categories = [
  { id: "overall", label: "Overall", icon: TrendingUp },
  { id: "experience", label: "Experience", icon: Star },
  { id: "missions", label: "Missions", icon: Target },
  { id: "impact", label: "Impact", icon: Heart },
  { id: "specialists", label: "Specialists", icon: UsersRound },
];

export function LeaderboardContent({ users, stats, currentUserRank }: LeaderboardContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("overall");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <span className="text-4xl">🏆</span>
          Hero Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Celebrating our community&apos;s top heroes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          value={stats.totalUsers}
          label="Total Heroes"
          color="text-[#3B82F6]"
        />
        <StatCard
          value={stats.activeToday}
          label="Active Today"
          color="text-[#22C55E]"
        />
        <StatCard
          value={stats.totalHelpfulVotes}
          label="Achievements Today"
          color="text-[#8B5CF6]"
        />
        <StatCard
          value={currentUserRank}
          label="Your Rank"
          color="text-[#F97316]"
          showDash={!currentUserRank}
        />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Categories Sidebar */}
        <div className="bg-card border border-border rounded-xl p-4 h-fit">
          <h2 className="font-semibold text-foreground mb-4">Categories</h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Main */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {categories.find((c) => c.id === selectedCategory)?.label} Leaderboard
              </h3>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                <span>Live Updates</span>
                <span className="text-white/60">Updated Just now</span>
              </div>
            </div>
          </div>

          {/* Rankings List */}
          <div className="divide-y divide-border">
            {users.length > 0 ? (
              users.map((user, index) => (
                <LeaderboardRow
                  key={user.id}
                  user={user}
                  rank={index + 1}
                />
              ))
            ) : (
              <EmptyState onClearFilters={() => setSelectedCategory("overall")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  color,
  showDash = false,
}: {
  value?: number;
  label: string;
  color: string;
  showDash?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <div className={cn("text-3xl md:text-4xl font-bold mb-1", color)}>
        {showDash ? (
          <span className="inline-block w-8 h-1 bg-current rounded" />
        ) : (
          value?.toLocaleString() || 0
        )}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function LeaderboardRow({
  user,
  rank,
}: {
  user: LeaderboardUser;
  rank: number;
}) {
  const level = levelConfig[user.level];

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors">
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {rank === 1 && <Crown className="w-6 h-6 text-[#FFD700] mx-auto" />}
        {rank === 2 && <Medal className="w-6 h-6 text-[#C0C0C0] mx-auto" />}
        {rank === 3 && <Award className="w-6 h-6 text-[#CD7F32] mx-auto" />}
        {rank > 3 && (
          <span className="text-muted-foreground font-semibold text-lg">{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <Avatar
        src={user.avatarUrl}
        name={user.name}
        size="md"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground truncate">
            {user.name}
          </span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full", level.bgColor, level.color)}>
            {user.level}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          @{user.username} · {user.postCount} contributions
        </div>
      </div>

      {/* Points */}
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-[#FBBF24] text-lg">
          {user.points.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">XP</div>
      </div>
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="py-16 px-6 text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No Heroes Found</h3>
      <p className="text-muted-foreground mb-6">
        No heroes match your current filters. Try adjusting your criteria.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}

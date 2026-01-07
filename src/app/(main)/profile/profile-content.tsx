"use client";

import { Settings, Edit2, LogOut, MapPin, FileText, ThumbsUp, Award, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/auth.actions";
import { cn } from "@/lib/utils";
import type { User, UserLevel, UserType } from "@/types";

interface ProfileContentProps {
  user: User;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
  stats: {
    posts: number;
    helpfulVotes: number;
    level: UserLevel;
    points: number;
  };
}

const levelConfig: Record<UserLevel, { label: string; color: string; bgColor: string; minPoints: number; maxPoints: number }> = {
  BRONZE: { label: "Bronze", color: "text-[#CD7F32]", bgColor: "bg-[#CD7F32]", minPoints: 0, maxPoints: 499 },
  SILVER: { label: "Silver", color: "text-[#C0C0C0]", bgColor: "bg-[#C0C0C0]", minPoints: 500, maxPoints: 1999 },
  GOLD: { label: "Gold", color: "text-[#FFD700]", bgColor: "bg-[#FFD700]", minPoints: 2000, maxPoints: 4999 },
  PLATINUM: { label: "Platinum", color: "text-[#E5E4E2]", bgColor: "bg-[#E5E4E2]", minPoints: 5000, maxPoints: 999999 },
};

const userTypeConfig: Record<UserType, { label: string; icon: string }> = {
  RIDER: { label: "Rider", icon: "🛵" },
  DRIVER: { label: "Driver", icon: "🚗" },
  CHAUFFEUR: { label: "Chauffeur", icon: "🎩" },
};

const menuItems = [
  { icon: Edit2, label: "Edit Profile", href: "#edit" },
  { icon: Settings, label: "Settings", href: "#settings" },
  { icon: Award, label: "My Achievements", href: "#achievements" },
  { icon: MapPin, label: "My Posts", href: "#posts" },
];

export function ProfileContent({ user, badges, stats }: ProfileContentProps) {
  const level = levelConfig[stats.level];
  const nextLevel = getNextLevel(stats.level);
  const progressToNextLevel = nextLevel
    ? ((stats.points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100
    : 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* Avatar */}
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            size="xl"
            className="border-4 border-primary"
          />

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>

            {/* User Types */}
            {user.userTypes && user.userTypes.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                {user.userTypes.map((type) => {
                  const config = userTypeConfig[type];
                  return (
                    <Badge key={type} variant={type.toLowerCase() as "rider" | "driver" | "chauffeur"}>
                      {config.icon} {config.label}
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Location */}
            {user.currentCity && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-4 h-4" />
                {user.currentCity}
              </p>
            )}

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-foreground mt-3">{user.bio}</p>
            )}
          </div>

          {/* Edit Button */}
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>

        {/* Level Progress */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={cn("font-bold", level.color)}>{level.label}</span>
              <Badge variant="xp" size="sm">
                {stats.points.toLocaleString()} XP
              </Badge>
            </div>
            {nextLevel && (
              <span className="text-sm text-muted-foreground">
                {nextLevel.minPoints - stats.points} XP to {nextLevel.label}
              </span>
            )}
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all", level.bgColor)}
              style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          value={stats.posts}
          label="Posts"
        />
        <StatCard
          icon={<ThumbsUp className="w-5 h-5" />}
          value={stats.helpfulVotes}
          label="Helpful"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          value={badges.length}
          label="Badges"
        />
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4">My Badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg"
                title={badge.description}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Badges Preview if no badges */}
      {badges.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Earn Badges</h2>
          <div className="flex flex-wrap gap-3 opacity-50">
            {["🌟 Newcomer", "🤝 Helper", "🛡️ Safety Hero", "📍 Local Expert", "🔥 Streak"].map((badge) => (
              <div key={badge} className="px-3 py-2 bg-secondary/50 rounded-lg text-sm">
                {badge}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Start posting to earn your first badge!
          </p>
        </div>
      )}

      {/* Menu */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors",
              index !== menuItems.length - 1 && "border-b border-border"
            )}
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-foreground">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <form action={logout}>
        <Button
          type="submit"
          variant="outline"
          className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </form>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className="text-muted-foreground mb-1 flex justify-center">{icon}</div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function getNextLevel(currentLevel: UserLevel): (typeof levelConfig)[UserLevel] | null {
  const levels: UserLevel[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex >= 0 && currentIndex < levels.length - 1) {
    const nextLevel = levels[currentIndex + 1];
    if (nextLevel) {
      return levelConfig[nextLevel];
    }
  }
  return null;
}

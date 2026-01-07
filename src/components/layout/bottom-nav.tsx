"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Newspaper, Trophy, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onCreatePost?: () => void;
}

const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "#create", label: "Post", icon: Plus, isCreate: true },
  { href: "/leaderboard", label: "Leaders", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav({ onCreatePost }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          if (item.isCreate) {
            return (
              <button
                key={item.href}
                onClick={onCreatePost}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

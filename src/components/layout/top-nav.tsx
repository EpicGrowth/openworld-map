"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Newspaper, Trophy, Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { User as UserType } from "@/types";

interface TopNavProps {
  user?: UserType | null;
}

const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border">
      <div className="flex items-center h-full px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:block">
            OpenWorld.Map
          </span>
        </Link>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              {/* Create Post Button (Desktop) */}
              <Button size="sm" className="hidden md:flex gap-2">
                <Plus className="w-4 h-4" />
                <span>Post</span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>

              {/* Profile */}
              <Link href="/profile">
                <Avatar
                  src={user.avatarUrl}
                  name={user.name}
                  size="sm"
                  className="cursor-pointer hover:ring-2 hover:ring-primary"
                />
              </Link>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

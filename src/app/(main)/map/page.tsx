"use client";

import { useState } from "react";
import { MapPin, Locate, Plus, Minus, Layers, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PostCategory } from "@/types";

const categoryFilters: { value: PostCategory | "ALL"; label: string; icon: string; color: string }[] = [
  { value: "ALL", label: "All", icon: "📍", color: "#6366F1" },
  { value: "TRAFFIC", label: "Traffic", icon: "🚗", color: "#EF4444" },
  { value: "SAFETY", label: "Safety", icon: "⚠️", color: "#F97316" },
  { value: "DEALS", label: "Deals", icon: "🏷️", color: "#22C55E" },
  { value: "AMENITIES", label: "Amenities", icon: "☕", color: "#3B82F6" },
  { value: "GENERAL", label: "General", icon: "💬", color: "#6B7280" },
];

// Mock pins for demonstration
const mockPins = [
  { id: "1", lat: 3.1390, lng: 101.6869, category: "TRAFFIC" as PostCategory, title: "Heavy traffic on Federal Highway", address: "Federal Highway, PJ" },
  { id: "2", lat: 3.1490, lng: 101.6769, category: "SAFETY" as PostCategory, title: "Road work ahead", address: "Jalan Ampang" },
  { id: "3", lat: 3.1290, lng: 101.6969, category: "DEALS" as PostCategory, title: "20% off at Shell", address: "Shell Bangsar" },
  { id: "4", lat: 3.1590, lng: 101.6669, category: "AMENITIES" as PostCategory, title: "Clean restroom", address: "Petronas KLCC" },
];

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | "ALL">("ALL");
  const [showUsersOnMap, setShowUsersOnMap] = useState(true);
  const [selectedPin, setSelectedPin] = useState<typeof mockPins[0] | null>(null);

  const filteredPins = selectedCategory === "ALL"
    ? mockPins
    : mockPins.filter((pin) => pin.category === selectedCategory);

  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] w-full">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-[#1a1a2e]">
        {/* Simulated map background */}
        <div className="w-full h-full relative overflow-hidden">
          {/* Grid pattern to simulate map */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Map pins */}
          {filteredPins.map((pin, index) => {
            const categoryInfo = categoryFilters.find((c) => c.value === pin.category);
            // Position pins in a spread pattern for demo
            const left = 20 + (index * 20) + Math.random() * 10;
            const top = 30 + (index * 12) + Math.random() * 10;

            return (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
                  style={{ backgroundColor: categoryInfo?.color }}
                >
                  {categoryInfo?.icon}
                </div>
              </button>
            );
          })}

          {/* User location marker */}
          <div
            className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          />

          {/* Map attribution placeholder */}
          <div className="absolute bottom-20 md:bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Map powered by Mapbox (integration pending)
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto">
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-card/95 backdrop-blur rounded-xl border border-border shadow-lg">
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-20 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-card/95 backdrop-blur shadow-lg"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card/95 backdrop-blur shadow-lg"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card/95 backdrop-blur shadow-lg"
          title="My location"
        >
          <Locate className="w-4 h-4" />
        </Button>
        <Button
          variant={showUsersOnMap ? "default" : "secondary"}
          size="icon"
          className={`shadow-lg ${!showUsersOnMap ? "bg-card/95 backdrop-blur" : ""}`}
          title="Show users on map"
          onClick={() => setShowUsersOnMap(!showUsersOnMap)}
        >
          <Users className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card/95 backdrop-blur shadow-lg"
          title="Map layers"
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Pin Popup */}
      {selectedPin && (
        <div className="absolute bottom-24 md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-80">
          <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge
                  variant={selectedPin.category.toLowerCase() as "traffic" | "safety" | "deals" | "amenities" | "general"}
                  className="mb-2"
                >
                  {categoryFilters.find((c) => c.value === selectedPin.category)?.icon}{" "}
                  {selectedPin.category}
                </Badge>
                <h3 className="font-semibold text-foreground">{selectedPin.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {selectedPin.address}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPin(null)}
              >
                Close
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1">View Post</Button>
              <Button size="sm" variant="outline" className="flex-1">Directions</Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="absolute bottom-24 md:bottom-4 right-4 hidden md:block">
        <div className="bg-card/95 backdrop-blur border border-border rounded-lg px-3 py-2 text-sm">
          <span className="text-muted-foreground">{filteredPins.length} pins nearby</span>
        </div>
      </div>
    </div>
  );
}

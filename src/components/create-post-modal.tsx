"use client";

import { useState, useEffect } from "react";
import { MapPin, Image, Camera, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { PostCategory } from "@/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreatePostData) => Promise<void>;
}

interface CreatePostData {
  content: string;
  category: PostCategory;
  location?: { lat: number; lng: number };
  address?: string;
  imageUrl?: string;
}

const categories: { value: PostCategory; label: string; icon: string; keywords: string[] }[] = [
  { value: "TRAFFIC", label: "Traffic", icon: "🚗", keywords: ["jam", "congestion", "accident", "road closed", "delay", "traffic"] },
  { value: "SAFETY", label: "Safety", icon: "⚠️", keywords: ["danger", "unsafe", "avoid", "warning", "attacked", "robbery", "scam"] },
  { value: "DEALS", label: "Deals", icon: "🏷️", keywords: ["discount", "offer", "sale", "free", "cheap", "promo", "deal"] },
  { value: "AMENITIES", label: "Amenities", icon: "☕", keywords: ["toilet", "restaurant", "parking", "rest stop", "fuel", "petrol", "food"] },
  { value: "GENERAL", label: "General", icon: "💬", keywords: [] },
];

const MAX_CHARS = 500;

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>("GENERAL");
  const [detectedCategory, setDetectedCategory] = useState<PostCategory | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect category from content
  useEffect(() => {
    const lowerContent = content.toLowerCase();

    for (const cat of categories) {
      if (cat.keywords.some((keyword) => lowerContent.includes(keyword))) {
        setDetectedCategory(cat.value);
        if (selectedCategory === "GENERAL") {
          setSelectedCategory(cat.value);
        }
        return;
      }
    }
    setDetectedCategory(null);
  }, [content, selectedCategory]);

  // Get user location on mount
  useEffect(() => {
    if (isOpen && !location) {
      detectLocation();
    }
  }, [isOpen, location]);

  const detectLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });

            // Try to get address from coordinates (reverse geocoding)
            try {
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}`
              );
              if (response.ok) {
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                  setAddress(data.features[0].place_name);
                }
              }
            } catch {
              setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error("Location error:", error);
            setIsLoadingLocation(false);
          }
        );
      }
    } catch {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        content: content.trim(),
        category: selectedCategory,
        location: location || undefined,
        address: address || undefined,
      });
      // Reset form
      setContent("");
      setSelectedCategory("GENERAL");
      setDetectedCategory(null);
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charsRemaining = MAX_CHARS - content.length;
  const isOverLimit = charsRemaining < 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post">
      <div className="p-6 space-y-4">
        {/* Content Input */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on the road? Share traffic updates, safety alerts, deals, or tips..."
            className="w-full h-32 bg-secondary border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={MAX_CHARS + 50} // Allow some overflow to show error
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${isOverLimit ? "text-red-500" : "text-muted-foreground"}`}>
              {charsRemaining} characters remaining
            </span>
            {detectedCategory && selectedCategory === detectedCategory && (
              <span className="text-xs text-muted-foreground">
                Auto-detected: {categories.find((c) => c.value === detectedCategory)?.label}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          {isLoadingLocation ? (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Getting location...
            </span>
          ) : address ? (
            <span className="text-foreground truncate flex-1">{address}</span>
          ) : (
            <button
              onClick={detectLocation}
              className="text-primary hover:underline"
            >
              Add location
            </button>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
        </div>

        {/* Media Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Image className="w-4 h-4 mr-2" />
            Photo
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </Button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isOverLimit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

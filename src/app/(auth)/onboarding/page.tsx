"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserType } from "@/types";

const USER_TYPES: { type: UserType; icon: string; label: string; description: string }[] = [
  {
    type: "RIDER",
    icon: "🛵",
    label: "Delivery Rider",
    description: "Food delivery, packages, courier services",
  },
  {
    type: "DRIVER",
    icon: "🚗",
    label: "Rideshare Driver",
    description: "Uber, Lyft, taxi services",
  },
  {
    type: "CHAUFFEUR",
    icon: "🎩",
    label: "Chauffeur",
    description: "Private hire, luxury transport",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<UserType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleType = (type: UserType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) {
      setError("Please select at least one option");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Insert user types
      const userTypes = selectedTypes.map((type) => ({
        user_id: user.id,
        type,
      }));

      const { error: insertError } = await supabase
        .from("user_types")
        .insert(userTypes);

      if (insertError) {
        throw insertError;
      }

      // Redirect to feed
      router.push("/feed");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl text-foreground">
          What do you do?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Select all that apply. This helps us show relevant content.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* User Type Options */}
        <div className="space-y-3">
          {USER_TYPES.map(({ type, icon, label, description }) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{icon}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {label}
                    </p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary-dark text-white mt-4"
          disabled={isSubmitting || selectedTypes.length === 0}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>

        {/* Skip for now */}
        <button
          onClick={() => router.push("/feed")}
          className="w-full text-center text-muted-foreground text-sm hover:text-muted-foreground"
          disabled={isSubmitting}
        >
          Skip for now
        </button>
      </CardContent>
    </Card>
  );
}

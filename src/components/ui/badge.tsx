import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
        traffic: "bg-[#EF4444]/20 text-[#EF4444]",
        safety: "bg-[#F97316]/20 text-[#F97316]",
        deals: "bg-[#22C55E]/20 text-[#22C55E]",
        amenities: "bg-[#3B82F6]/20 text-[#3B82F6]",
        general: "bg-[#6B7280]/20 text-[#6B7280]",
        rider: "bg-[#22C55E]/20 text-[#22C55E]",
        driver: "bg-[#3B82F6]/20 text-[#3B82F6]",
        chauffeur: "bg-[#FBBF24]/20 text-[#FBBF24]",
        level: "bg-[#8B5CF6]/20 text-[#8B5CF6]",
        xp: "bg-[#FBBF24]/20 text-[#FBBF24]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

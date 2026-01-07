import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-20 w-20 text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  name?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, name, showOnlineStatus, isOnline, ...props }, ref) => {
    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";

    // Generate a consistent color based on name
    const colors = [
      "bg-primary",
      "bg-[#22C55E]",
      "bg-[#3B82F6]",
      "bg-[#FBBF24]",
      "bg-[#8B5CF6]",
      "bg-[#F97316]",
      "bg-[#EF4444]",
    ];
    const colorIndex = name
      ? name.charCodeAt(0) % colors.length
      : 0;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), "relative", className)}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name || "Avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center font-semibold text-white",
              colors[colorIndex]
            )}
          >
            {initials}
          </div>
        )}
        {showOnlineStatus && (
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
              isOnline ? "bg-[#10B981]" : "bg-muted-foreground"
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };

"use client";

import { logout } from "@/features/auth/auth.actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-border text-muted-foreground hover:bg-secondary"
      >
        Sign out
      </Button>
    </form>
  );
}

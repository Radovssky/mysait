"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      className="font-mono"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      выйти
    </Button>
  );
}

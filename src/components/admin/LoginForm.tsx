"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Неверный email или пароль");
        return;
      }

      router.push(params.get("callbackUrl") ?? "/admin");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-8 rounded-2xl border border-border bg-card p-8"
    >
      <div className="space-y-1">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>admin
        </p>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">
          Вход
        </h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-mono text-xs">
            email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-mono text-xs">
            пароль
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
          />
        </div>
        {error && (
          <p role="alert" className="font-mono text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full font-mono" disabled={isPending}>
        {isPending ? "..." : "> войти"}
      </Button>
    </form>
  );
}

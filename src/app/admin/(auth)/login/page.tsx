import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 font-mono text-sm text-muted-foreground">
            загрузка…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}

import { LogoutButton } from "@/components/admin/LogoutButton";
import { auth } from "@/auth";

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">{"// "}</span>админ-панель
          </p>
          <h1 className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            Кейсы
          </h1>
        </div>
        <LogoutButton />
      </header>
      <section className="mt-16 rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">
          Управление кейсами появится на шаге 7 плана: список с публикацией,
          форма создания и редактирования.
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          вошли как: {session?.user?.email}
        </p>
      </section>
    </main>
  );
}

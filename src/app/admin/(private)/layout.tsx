import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

export default async function AdminPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <div className="min-h-screen bg-background">{children}</div>;
}

import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set — нужен в .env.local или production-окружении",
  );
}

const globalForDb = globalThis as unknown as {
  __mysaitClient?: ReturnType<typeof postgres>;
};

const queryClient =
  globalForDb.__mysaitClient ?? postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mysaitClient = queryClient;
}

export const db = drizzle(queryClient, { schema });

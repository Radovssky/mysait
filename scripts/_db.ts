import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../drizzle/schema";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL is not set — нужен в .env / .env.local или окружении CLI",
  );
}

const client = postgres(url, { max: 1 });
export const scriptDb = drizzle(client, { schema });
export const closeDb = () => client.end({ timeout: 5 });

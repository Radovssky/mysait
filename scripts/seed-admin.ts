import "dotenv/config";

import { eq } from "drizzle-orm";

import { users } from "../drizzle/schema";
import { db } from "../src/lib/db";

const email = process.env.ADMIN_EMAIL;
const passwordHash = process.env.ADMIN_PASSWORD_HASH;

if (!email || !passwordHash) {
  console.error(
    "ADMIN_EMAIL и ADMIN_PASSWORD_HASH обязаны быть выставлены в .env / .env.local",
  );
  process.exit(1);
}

const [existing] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

if (existing) {
  console.log(`Admin уже существует: ${email} — пропускаю`);
  process.exit(0);
}

await db.insert(users).values({ email, passwordHash });
console.log(`Сидирован admin: ${email}`);
process.exit(0);

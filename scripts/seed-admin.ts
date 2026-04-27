import "dotenv/config";

import { eq } from "drizzle-orm";

import { users } from "../drizzle/schema";
import { closeDb, scriptDb } from "./_db";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    console.error(
      "ADMIN_EMAIL и ADMIN_PASSWORD_HASH обязаны быть выставлены в .env / .env.local",
    );
    process.exit(1);
  }

  const [existing] = await scriptDb
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.log(`Admin уже существует: ${email} — пропускаю`);
    return;
  }

  await scriptDb.insert(users).values({ email, passwordHash });
  console.log(`Сидирован admin: ${email}`);
}

main()
  .then(async () => {
    await closeDb();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await closeDb();
    process.exit(1);
  });

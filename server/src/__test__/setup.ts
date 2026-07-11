import { migrate } from "drizzle-orm/bun-sqlite/migrator";

process.env.DATABASE_URL = ":memory:";

const { db } = await import("db");

migrate(db, { migrationsFolder: "../db/drizzle" });

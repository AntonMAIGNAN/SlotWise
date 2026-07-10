import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { users } from "./schemas/users";
import { reservations } from "./schemas/reservations";
import { config } from "./config";

const sqlite = new Database(config.DATABASE_URL);

const schema = {
  users,
  reservations,
};

export const db = drizzle(sqlite, { schema });

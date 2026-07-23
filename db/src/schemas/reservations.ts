import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const reservations = sqliteTable("reservations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  startDate: integer("start_date", { mode: "timestamp_ms" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp_ms" }).notNull(),
});

export type ReservationType = typeof reservations.$inferSelect;

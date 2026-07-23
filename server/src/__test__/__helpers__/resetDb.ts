import { db } from "db";
import { reservations } from "db/schemas/reservations";
import { users } from "db/schemas/users";

export async function resetDb() {
  await db.delete(reservations);
  await db.delete(users);
}

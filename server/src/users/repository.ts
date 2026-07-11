import { db } from "db";
import { users } from "db/schemas/users";
import type { CreateUserBodyType } from "./schema";

export async function createUser({ fullname, email }: CreateUserBodyType) {
  return db.insert(users).values({ fullname, email }).returning().get();
}

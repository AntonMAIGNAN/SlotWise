import { users, type UserType } from "db/schemas/users";
import { faker } from "@faker-js/faker/locale/fr";
import { db } from "db";

const userFactory = (override?: Partial<UserType>) => ({
  fullname: faker.person.fullName(),
  email: faker.internet.email(),
  ...override,
});

export async function createUser({
  override,
  insert,
}: {
  override?: Partial<UserType>;
  insert?: true;
}) {
  return insert
    ? db.insert(users).values(userFactory(override)).returning().get()
    : userFactory(override);
}

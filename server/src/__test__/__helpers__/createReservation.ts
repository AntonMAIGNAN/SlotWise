import { db } from "db";
import { faker } from "@faker-js/faker";
import { reservations, type ReservationType } from "db/schemas/reservations";
import { createUser } from "./createUser";
import { users } from "db/schemas/users";

const reservationFactory = async (override?: Partial<ReservationType>) => {
  const allUsers = await db.select().from(users).limit(100).all();

  const user = faker.helpers.arrayElement(
    allUsers.length ? allUsers : [await createUser({ insert: true })],
  );

  const startDate = faker.date.future();

  return {
    id: Number(faker.database.mongodbObjectId()),
    userId: Number(user?.id),
    startDate,
    endDate: faker.date.future({ refDate: startDate }),
    ...override,
  };
};

export async function createReservation<T extends true | undefined>({
  override,
  insert,
}: {
  override?: Partial<ReservationType>;
  insert?: T;
} = {}) {
  return insert
    ? db
        .insert(reservations)
        .values(await reservationFactory(override))
        .returning()
        .get()
    : reservationFactory(override);
}

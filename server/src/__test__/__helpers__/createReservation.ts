import { db } from "db";
import { faker } from "@faker-js/faker";
import { reservations, type ReservationType } from "db/schemas/reservations";
import { createUser } from "./createUser";
import { users } from "db/schemas/users";

const reservationFactory = async (override?: Partial<ReservationType>) => {
  const user = faker.helpers.arrayElement(await db.select().from(users).all());

  return {
    id: Number(faker.database.mongodbObjectId()),
    userId: user?.id ?? user.id,
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    ...override,
  };
};

export async function createReservation<T extends true | undefined>({
  override,
  insert,
}: {
  override?: Partial<ReservationType>;
  insert?: T;
}) {
  return insert
    ? db
        .insert(reservations)
        .values(await reservationFactory(override))
        .returning()
        .get()
    : reservationFactory(override);
}

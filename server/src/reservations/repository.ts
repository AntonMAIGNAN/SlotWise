import { db } from "db";
import { getTableColumns, and, lt, gt, lte, gte } from "drizzle-orm";
import type {
  CreateReservationBodyType,
  GetReservationQueryType,
  Reservation,
} from "./schema";
import { convertManyQueryFiltersToDrizzleWhere } from "../common/query-filters";
import { reservations, type ReservationType } from "db/schemas/reservations";
import { findWithPagination } from "../common/pagination";
import { HttpError } from "../common/error";
import { StatusCodes } from "http-status-codes";

const mapReservationToDto = (reservation: ReservationType): Reservation => {
  return {
    id: reservation.id.toString(),
    userId: reservation.userId.toString(),
    startDate: reservation.startDate.toISOString(),
    endDate: reservation.endDate.toISOString(),
  };
};

export async function getReservations(query: GetReservationQueryType) {
  const { page, pageSize, ...filters } = query;

  const where = convertManyQueryFiltersToDrizzleWhere(
    getTableColumns(reservations),
    filters,
  );

  const { items, ...pagination } = await findWithPagination({
    pagination: { page, pageSize },
    table: reservations,
    where,
  });

  return {
    items: items.map(mapReservationToDto),
    ...pagination,
  };
}

let lock = Promise.resolve();

export async function createReservationIfAvailable(
  payload: CreateReservationBodyType,
): Promise<Reservation> {
  const { userId, startDate, endDate } = payload;
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  const executeTransaction = async () => {
    return db.transaction(
      (t) => {
        const existing = t
          .select()
          .from(reservations)
          .where(
            and(
              lte(reservations.startDate, newEnd),
              gte(reservations.endDate, newStart),
            ),
          )
          .limit(1)
          .all();

        if (existing.length > 0) {
          throw new HttpError({
            message: "Reservation dates are not available.",
            status: StatusCodes.CONFLICT,
            payload,
          });
        }

        const [created] = t
          .insert(reservations)
          .values({
            userId: Number(userId),
            startDate: newStart,
            endDate: newEnd,
          })
          .returning()
          .all();

        if (!created) {
          throw new HttpError({
            message: "Failed to create reservation.",
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            payload,
          });
        }

        return mapReservationToDto(created);
      },
      { behavior: "exclusive" },
    );
  };

  const result = lock.then(executeTransaction, executeTransaction);
  lock = result.then(
    () => {},
    () => {},
  );

  return result;
}

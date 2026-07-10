import { db } from "db";
import { getTableColumns } from "drizzle-orm";
import type { GetReservationQueryType, Reservation } from "./schema";
import { convertManyQueryFiltersToDrizzleWhere } from "../query-filters";
import { reservations, type ReservationType } from "db/schemas/reservations";

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

  const [rows, total] = await Promise.all([
    db.query.reservations.findMany({
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    db.$count(reservations, where),
  ]);

  return {
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    items: rows.map(mapReservationToDto),
  };
}

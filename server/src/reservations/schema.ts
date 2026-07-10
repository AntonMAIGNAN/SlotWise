import { t } from "elysia/type-system";
import {
  DateQueryFilterSchema,
  StringQueryFilterSchema,
} from "../query-filters";
import type { Static } from "elysia";
import { PaginationQuerySchema, PaginationSchema } from "../pagination";

const ReservationSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  startDate: t.String({ format: "date-time" }),
  endDate: t.String({ format: "date-time" }),
});
export type Reservation = Static<typeof ReservationSchema>;

export const GetReservationQuerySchema = t.Composite([
  t.Object({
    id: t.Optional(StringQueryFilterSchema),
    userId: t.Optional(StringQueryFilterSchema),
    startDate: t.Optional(DateQueryFilterSchema),
    endDate: t.Optional(DateQueryFilterSchema),
  }),
  PaginationQuerySchema,
]);
export type GetReservationQueryType = Static<typeof GetReservationQuerySchema>;

export const GetReservationResponseSchema = PaginationSchema(ReservationSchema);

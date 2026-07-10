import Elysia from "elysia";
import {
  GetReservationQuerySchema,
  GetReservationResponseSchema,
} from "./schema";
import { StatusCodes } from "http-status-codes";
import { getReservations } from "./repository";
import { reservationService } from "../module";

export const reservationRoutes = new Elysia({ prefix: "/reservations" }).get(
  "/",
  async ({ status, query }) => {
    return status(
      StatusCodes.OK,
      await reservationService.getReservations(query),
    );
  },
  {
    query: GetReservationQuerySchema,
    response: GetReservationResponseSchema,
  },
);

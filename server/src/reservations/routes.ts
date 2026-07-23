import Elysia from "elysia";
import {
  CreateReservationBodySchema,
  GetReservationQuerySchema,
  GetReservationResponseSchema,
  ReservationSchema,
} from "./schema";
import { StatusCodes } from "http-status-codes";
import { reservationService } from "../module";

export const reservationRoutes = new Elysia({ prefix: "/reservations" })
  .get(
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
  )
  .post(
    "/",
    async ({ status, body }) => {
      return status(
        StatusCodes.CREATED,
        await reservationService.createReservation(body),
      );
    },
    {
      body: CreateReservationBodySchema,
      response: {
        [StatusCodes.CREATED]: ReservationSchema,
      },
    },
  );

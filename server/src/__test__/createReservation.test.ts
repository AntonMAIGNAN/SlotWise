import { describe, expect, it } from "bun:test";
import { StatusCodes } from "http-status-codes";
import { fetchRoute } from "./__helpers__/app";
import { faker } from "@faker-js/faker/locale/fr";
import { createReservation } from "./__helpers__/createReservation";
import { db } from "db";
import { reservations } from "db/schemas/reservations";

const URL = "/reservations" as const;

describe(`createReservation - POST - ${URL}`, () => {
  describe("Should throw", async () => {
    it("With transactional error (duplicate reservation)", async () => {
      const { id: _id, ...payload } = await createReservation();

      const body = {
        userId: payload.userId.toString(),
        startDate: payload.startDate.toISOString(),
        endDate: payload.endDate.toISOString(),
      };

      const req1 = fetchRoute({ method: "POST", url: URL, body });
      const req2 = fetchRoute({ method: "POST", url: URL, body });
      const req3 = fetchRoute({ method: "POST", url: URL, body });

      const [r1, r2, r3] = await Promise.all([req1, req2, req3]);
      const statuses = [r1.status, r2.status, r3.status].sort();

      const createdReservation = await db.select().from(reservations).all();

      expect(createdReservation).toHaveLength(1);
      expect(statuses).toEqual([
        StatusCodes.CREATED,
        StatusCodes.CONFLICT,
        StatusCodes.CONFLICT,
      ]);
      expect(
        createdReservation.filter((r) => r.userId === payload.userId),
      ).toEqual([
        {
          id: expect.any(Number),
          userId: payload.userId,
          startDate: payload.startDate,
          endDate: payload.endDate,
        },
      ]);
    });

    it("With empty body", async () => {
      const response = await fetchRoute({ method: "POST", url: URL, body: {} });
      const { errors } = (await response.json()) as { errors: unknown[] };

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(errors).toEqual([
        {
          errors: [],
          message: "Expected string",
          path: "/userId",
          schema: {
            type: "string",
          },
          summary:
            "Expected property 'userId' to be string but found: undefined",
          type: 54,
        },
        {
          errors: [],
          message: "Expected string",
          path: "/startDate",
          schema: {
            type: "string",
            format: "date-time",
          },
          summary:
            "Expected property 'startDate' to be string but found: undefined",
          type: 54,
        },
        {
          errors: [],
          message: "Expected string",
          path: "/endDate",
          schema: {
            type: "string",
            format: "date-time",
          },
          summary:
            "Expected property 'endDate' to be string but found: undefined",
          type: 54,
        },
      ]);
    });

    it("With unexisting userId", async () => {
      const payload = {
        userId: faker.string.uuid(),
        startDate: faker.date.past().toISOString(),
        endDate: faker.date.future().toISOString(),
      };

      const response = await fetchRoute({
        method: "POST",
        url: URL,
        body: payload,
      });
      const body = await response.json();

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(body).toEqual({
        name: "Error",
        message: "User does not exist.",
        cause: {
          message: "User does not exist.",
          status: StatusCodes.NOT_FOUND,
          payload: { userId: payload.userId },
        },
      });
    });

    it("With unavailable reservation dates", async () => {
      const { id: _id, ...payload } = await createReservation({ insert: true });

      const response = await fetchRoute({
        method: "POST",
        url: URL,
        body: {
          userId: payload.userId.toString(),
          startDate: payload.startDate.toISOString(),
          endDate: payload.endDate.toISOString(),
        },
      });
      const body = await response.json();

      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(body).toEqual({
        name: "Error",
        message: "Reservation dates are not available.",
        cause: {
          message: "Reservation dates are not available.",
          status: StatusCodes.CONFLICT,
          payload: {
            userId: payload.userId.toString(),
            startDate: payload.startDate.toISOString(),
            endDate: payload.endDate.toISOString(),
          },
        },
      });
    });
  });
});

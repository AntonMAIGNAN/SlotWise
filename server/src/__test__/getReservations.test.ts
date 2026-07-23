import { faker } from "@faker-js/faker";
import { beforeAll, describe, expect, it } from "bun:test";
import type { ReservationType } from "db/schemas/reservations";
import { createReservation } from "./__helpers__/createReservation";
import { createUser } from "./__helpers__/createUser";
import { resetDb } from "./__helpers__/resetDb";
import {
  GetReservationQuerySchema,
  type Reservation,
} from "../reservations/schema";
import { StatusCodes } from "http-status-codes";
import { fetchRoute } from "./__helpers__/app";

const mapReservationToDto = (reservation: ReservationType): Reservation => ({
  id: reservation.id.toString(),
  userId: reservation.userId.toString(),
  startDate: reservation.startDate.toISOString(),
  endDate: reservation.endDate.toISOString(),
});

const NUMBER_OF_RESERVATIONS = 15 as const;
const getReservationURL = "/reservations" as const;

describe(`getReservations - GET - ${getReservationURL}`, () => {
  let reservations: ReservationType[] = [];

  beforeAll(async () => {
    await resetDb();
    await createUser({ insert: true });

    reservations = await Promise.all(
      faker.helpers.multiple(() => createReservation({ insert: true }), {
        count: NUMBER_OF_RESERVATIONS,
      }),
    );
  });

  it("Should return all reservations", async () => {
    const params = new URLSearchParams({
      page: "1",
      pageSize: NUMBER_OF_RESERVATIONS.toString(),
    });

    const response = await fetchRoute({
      method: "GET",
      url: `${getReservationURL}?${params.toString()}`,
    });

    const body = await response.json();

    expect(response.status).toBe(StatusCodes.OK);
    expect(body).toEqual({
      page: 1,
      totalPages: 1,
      pageSize: NUMBER_OF_RESERVATIONS,
      items: reservations.map(mapReservationToDto),
    });
  });

  describe("Should return reservations filtered", () => {
    it("by id", async () => {
      const { id } = faker.helpers.arrayElement(reservations);

      const params = new URLSearchParams({
        page: "1",
        pageSize: NUMBER_OF_RESERVATIONS.toString(),
        id: JSON.stringify({ eq: id.toString() }),
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      const body = await response.json();

      expect(response.status).toBe(StatusCodes.OK);
      expect(body).toEqual({
        page: 1,
        totalPages: 1,
        pageSize: NUMBER_OF_RESERVATIONS,
        items: [mapReservationToDto(reservations.find((r) => r.id === id)!)],
      });
    });

    it("by userId", async () => {
      const { userId } = faker.helpers.arrayElement(reservations);

      const params = new URLSearchParams({
        page: "1",
        pageSize: NUMBER_OF_RESERVATIONS.toString(),
        userId: JSON.stringify({ eq: userId.toString() }),
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      const body = await response.json();

      expect(response.status).toBe(StatusCodes.OK);
      expect(body).toEqual({
        page: 1,
        totalPages: 1,
        pageSize: NUMBER_OF_RESERVATIONS,
        items: reservations
          .filter((r) => r.userId === userId)
          .map(mapReservationToDto),
      });
    });

    it("by startDate", async () => {
      const NOW = new Date();

      const params = new URLSearchParams({
        page: "1",
        pageSize: NUMBER_OF_RESERVATIONS.toString(),
        startDate: JSON.stringify({ gt: NOW.toISOString() }),
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      const body = await response.json();

      expect(response.status).toBe(StatusCodes.OK);
      expect(body).toEqual({
        page: 1,
        totalPages: 1,
        pageSize: NUMBER_OF_RESERVATIONS,
        items: reservations
          .filter((r) => r.startDate.getTime() > NOW.getTime())
          .map(mapReservationToDto),
      });
    });

    it("by endDate", async () => {
      const NOW = new Date();

      const params = new URLSearchParams({
        page: "1",
        pageSize: NUMBER_OF_RESERVATIONS.toString(),
        endDate: JSON.stringify({ gt: NOW.toISOString() }),
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      const body = await response.json();

      expect(response.status).toBe(StatusCodes.OK);
      expect(body).toEqual({
        page: 1,
        totalPages: 1,
        pageSize: NUMBER_OF_RESERVATIONS,
        items: reservations
          .filter((r) => r.endDate.getTime() > NOW.getTime())
          .map(mapReservationToDto),
      });
    });
  });

  describe("Should return reservations paginated", () => {
    const PAGE_SIZE = (NUMBER_OF_RESERVATIONS / 2).toFixed(0);

    it(`With limit of ${PAGE_SIZE}`, async () => {
      const params = new URLSearchParams({
        page: "1",
        pageSize: PAGE_SIZE,
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      const body = await response.json();

      expect(response.status).toBe(StatusCodes.OK);
      expect(body).toEqual({
        page: 1,
        totalPages: 2,
        pageSize: Number(PAGE_SIZE),
        items: reservations
          .slice(0, Number(PAGE_SIZE))
          .map(mapReservationToDto),
      });
    });

    it(`With limit of ${PAGE_SIZE} and page 2`, async () => {
      const params = new URLSearchParams({
        page: "2",
        pageSize: PAGE_SIZE,
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      const body = await response.json();

      expect(response.status).toBe(StatusCodes.OK);
      expect(body).toEqual({
        page: 2,
        totalPages: 2,
        pageSize: Number(PAGE_SIZE),
        items: reservations
          .slice(Number(PAGE_SIZE), NUMBER_OF_RESERVATIONS)
          .map(mapReservationToDto),
      });
    });
  });

  describe("With invalid query params", () => {
    it(`Should return ${StatusCodes.BAD_REQUEST} with invalid page`, async () => {
      const params = new URLSearchParams({
        page: "0",
        pageSize: NUMBER_OF_RESERVATIONS.toString(),
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it(`Should return ${StatusCodes.BAD_REQUEST} with invalid pageSize`, async () => {
      const params = new URLSearchParams({
        page: "1",
        pageSize: "0",
      });

      const response = await fetchRoute({
        method: "GET",
        url: `${getReservationURL}?${params.toString()}`,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    describe("With invalid filters", () => {
      it(`Should return ${StatusCodes.BAD_REQUEST} with invalid id filter`, async () => {
        const params = new URLSearchParams({
          page: "1",
          pageSize: NUMBER_OF_RESERVATIONS.toString(),
          [faker.helpers.arrayElement(
            Object.keys(GetReservationQuerySchema.properties),
          )]: JSON.stringify({
            eq: faker.datatype.boolean(),
          }),
        });

        const response = await fetchRoute({
          method: "GET",
          url: `${getReservationURL}?${params.toString()}`,
        });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });
    });
  });
});

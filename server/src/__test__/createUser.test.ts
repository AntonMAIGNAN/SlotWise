import { describe, expect, it } from "bun:test";
import { fetchRoute } from "./__helpers__/app";
import { faker } from "@faker-js/faker/locale/fr";
import { StatusCodes } from "http-status-codes";
import type { ParseError } from "elysia/error";

const URL = "/users" as const;

describe(`createUser - POST - ${URL}`, () => {
  it("should return 201 with the created user", async () => {
    const body = {
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const response = await fetchRoute({ method: "POST", url: URL, body });
    const createdUser = await response.json();

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(createdUser).toEqual({
      id: expect.any(String),
      ...body,
    });
  });

  describe(`Should return ${StatusCodes.UNPROCESSABLE_ENTITY} if the body is invalid`, async () => {
    it("With invalid email", async () => {
      const body = {
        fullname: faker.person.fullName(),
        email: "invalid-email",
      };

      const response = await fetchRoute({ method: "POST", url: URL, body });
      const { errors } = (await response.json()) as { errors: unknown[] };

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(errors).toEqual([
        {
          type: 50,
          schema: {
            format: "email",
            type: "string",
          },
          path: "/email",
          value: body.email,
          message: "Expected string to match 'email' format",
          errors: [],
          summary: "Property 'email' should be email",
        },
      ]);
    });

    it("With missing fullname", async () => {
      const body = {
        email: faker.internet.email(),
      };

      const response = await fetchRoute({ method: "POST", url: URL, body });
      const { errors } = (await response.json()) as { errors: unknown[] };

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(errors).toEqual([
        {
          errors: [],
          message: "Expected string",
          path: "/fullname",
          summary:
            "Expected property 'fullname' to be string but found: undefined",
          schema: { type: "string" },
          type: 54,
        },
      ]);
    });

    it("With missing email", async () => {
      const body = {
        fullname: faker.person.fullName(),
      };

      const response = await fetchRoute({ method: "POST", url: URL, body });
      const { errors } = (await response.json()) as { errors: unknown[] };

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(errors).toEqual([
        {
          errors: [],
          message: "Expected string",
          path: "/email",
          summary:
            "Expected property 'email' to be string but found: undefined",
          schema: { type: "string", format: "email" },
          type: 54,
        },
      ]);
    });
  });
});

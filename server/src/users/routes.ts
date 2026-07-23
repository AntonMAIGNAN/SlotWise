import Elysia from "elysia";
import { StatusCodes } from "http-status-codes";
import { userService } from "../module";
import { CreateUserBodySchema, UserSchema } from "./schema";

export const userRoutes = new Elysia({ prefix: "/users" }).post(
  "/",
  async ({ status, body }) => {
    return status(StatusCodes.CREATED, await userService.createUser(body));
  },
  {
    body: CreateUserBodySchema,
    response: {
      [StatusCodes.CREATED]: UserSchema,
    },
  },
);

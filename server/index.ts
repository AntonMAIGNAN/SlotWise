import Elysia, { ValidationError } from "elysia";
import { config } from "./config";
import { swagger } from "@elysiajs/swagger";
import { reservationRoutes } from "./src/reservations/routes";
import { userRoutes } from "./src/users/routes";
import { StatusCodes } from "http-status-codes";

export const app = new Elysia()
  .onError(({ error, set }) => {
    set.headers["content-type"] = "application/json";

    set.status =
      "status" in error ? error.status : StatusCodes.INTERNAL_SERVER_ERROR;

    return error;
  })
  .use(swagger())
  .use(reservationRoutes)
  .use(userRoutes)
  .listen(config.PORT);

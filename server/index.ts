import Elysia from "elysia";
import { config } from "./config";
import { swagger } from "@elysiajs/swagger";
import { reservationRoutes } from "./src/reservations/routes";
import { userRoutes } from "./src/users/routes";

export const app = new Elysia()
  .use(swagger())
  .use(reservationRoutes)
  .use(userRoutes)
  .listen(config.PORT);

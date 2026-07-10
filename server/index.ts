import Elysia from "elysia";
import { config } from "./config";
import { swagger } from "@elysiajs/swagger";
import { reservationRoutes } from "./src/reservations/routes";

export const app = new Elysia()
  .use(swagger())
  .use(reservationRoutes)
  .listen(config.PORT);

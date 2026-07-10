import { db } from "db";
import Elysia from "elysia";
import { config } from "./config";
import { swagger } from "@elysiajs/swagger";
import { reservationRoutes } from "./src/reservations/routes";

new Elysia()
  .use(swagger())
  .use(reservationRoutes)
  .listen(config.PORT, (server) => {
    console.log(`-> Server running: `, server.url.href);
  })
  .onRequest(({ request }) => console.log(request));

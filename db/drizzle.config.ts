import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: { url: config.DATABASE_URL },
});

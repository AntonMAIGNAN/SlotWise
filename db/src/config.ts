import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export const config = {
  DATABASE_URL: join(__dirname, "..", "sqlite.db"),
};

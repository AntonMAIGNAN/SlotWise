import type { TSchema } from "elysia";
import { t } from "elysia/type-system";

export const PaginationSchema = <T extends TSchema>(schema: T) =>
  t.Object({
    page: t.Number({ minimum: 1 }),
    pageSize: t.Number({ minimum: 1, maximum: 100 }),
    totalPages: t.Number({ minimum: 0 }),
    items: t.Array(schema),
  });

export const PaginationQuerySchema = t.Object({
  page: t.Number({ minimum: 1, default: 1 }),
  pageSize: t.Number({ minimum: 1, maximum: 100, default: 20 }),
});

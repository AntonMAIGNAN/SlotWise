import { db } from "db";
import type { SQL } from "drizzle-orm/sql/sql";
import type { SQLiteTable } from "drizzle-orm/sqlite-core/table";
import type { Static, TSchema } from "elysia";
import { t } from "elysia/type-system";

export const PaginationSchema = <T extends TSchema>(schema: T) =>
  t.Object({
    page: t.Number({ minimum: 1 }),
    pageSize: t.Number({ minimum: 1, maximum: 100 }),
    totalPages: t.Number({ minimum: 0 }),
    items: t.Array(schema),
  });

export type PaginationType<T extends TSchema> = Static<
  ReturnType<typeof PaginationSchema<T>>
>;

export const PaginationQuerySchema = t.Object({
  page: t.Number({ minimum: 1, default: 1 }),
  pageSize: t.Number({ minimum: 1, maximum: 100, default: 20 }),
});

export async function findWithPagination<T extends SQLiteTable>(params: {
  pagination: { page: number; pageSize: number };
  table: T;
  where?: SQL;
}) {
  const {
    pagination: { page, pageSize },
    table,
    where,
  } = params;

  const [rows, total] = await Promise.all([
    db
      .select()
      .from(table)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.$count(table, where),
  ]);

  return {
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    items: rows as T["$inferSelect"][],
  };
}

import {
  eq,
  ne,
  inArray,
  notInArray,
  gt,
  gte,
  lt,
  lte,
  and,
} from "drizzle-orm";
import type { AnyColumn, SQL } from "drizzle-orm";
import type { Static } from "elysia";
import { t } from "elysia/type-system";

export const StringQueryFilterSchema = (
  params: Parameters<typeof t.String>[0] = {},
) =>
  t.Partial(
    t.Object({
      eq: t.String(params),
      ne: t.String(params),
      in: t.ArrayQuery(t.String(params)),
      nin: t.ArrayQuery(t.String(params)),
    }),
  );

export const DateQueryFilterSchema = (
  params: Parameters<typeof t.Date>[0] = {},
) =>
  t.Partial(
    t.Object({
      eq: t.Date(params),
      ne: t.Date(params),
      gt: t.Date(params),
      gte: t.Date(params),
      lt: t.Date(params),
      lte: t.Date(params),
    }),
  );

type QueryFilters =
  | Static<ReturnType<typeof StringQueryFilterSchema>>
  | Static<ReturnType<typeof DateQueryFilterSchema>>;

const convertQueryFiltersToDrizzleWhere = (
  column: AnyColumn,
  filters?: QueryFilters,
): SQL | undefined => {
  if (!filters) return;

  const conditions: SQL[] = [];

  if (filters.eq) {
    conditions.push(eq(column, filters.eq));
  }
  if (filters.ne) {
    conditions.push(ne(column, filters.ne));
  }

  if ("gt" in filters && filters.gt) {
    conditions.push(gt(column, filters.gt));
  }
  if ("gte" in filters && filters.gte) {
    conditions.push(gte(column, filters.gte));
  }
  if ("lt" in filters && filters.lt) {
    conditions.push(lt(column, filters.lt));
  }
  if ("lte" in filters && filters.lte) {
    conditions.push(lte(column, filters.lte));
  }

  if ("in" in filters && filters.in && filters.in.length > 0) {
    conditions.push(inArray(column, filters.in));
  }
  if ("nin" in filters && filters.nin && filters.nin.length > 0) {
    conditions.push(notInArray(column, filters.nin));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
};

export const convertManyQueryFiltersToDrizzleWhere = (
  fields: Record<string, AnyColumn>,
  filters: Record<string, QueryFilters | undefined>,
): SQL | undefined => {
  const conditions: SQL[] = [];

  for (const [columnName, filter] of Object.entries(filters)) {
    if (filter) {
      const column = fields[columnName];
      if (column) {
        const condition = convertQueryFiltersToDrizzleWhere(column, filter);
        if (condition) {
          conditions.push(condition);
        }
      }
    }
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
};

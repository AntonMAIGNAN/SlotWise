import type { Static } from "elysia";
import { t } from "elysia/type-system";
import {
  DateQueryFilterSchema,
  StringQueryFilterSchema,
} from "../common/query-filters";
import { PaginationQuerySchema } from "../common/pagination";

export const UserSchema = t.Object({
  id: t.String(),
  fullname: t.String(),
  email: t.String(),
});

export type User = Static<typeof UserSchema>;

export const CreateUserBodySchema = t.Object({
  fullname: t.String(),
  email: t.String({ format: "email" }),
});
export type CreateUserBodyType = Static<typeof CreateUserBodySchema>;

const GetUserQuerySchema = t.Composite([
  t.Object({
    id: t.Optional(StringQueryFilterSchema()),
    userId: t.Optional(StringQueryFilterSchema()),
    startDate: t.Optional(DateQueryFilterSchema()),
    endDate: t.Optional(DateQueryFilterSchema()),
  }),
  PaginationQuerySchema,
]);
export type GetUserQueryType = Static<typeof GetUserQuerySchema>;

import type { Static } from "elysia";
import { t } from "elysia/type-system";

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

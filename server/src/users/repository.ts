import { db } from "db";
import { users, type UserType } from "db/schemas/users";
import type { CreateUserBodyType, GetUserQueryType } from "./schema";
import { convertManyQueryFiltersToDrizzleWhere } from "../common/query-filters";
import { getTableColumns } from "drizzle-orm/utils";
import { findWithPagination } from "../common/pagination";

const mapUserToDto = (user: UserType) => {
  return {
    id: user.id.toString(),
    fullname: user.fullname,
    email: user.email,
  };
};

export async function createUser({ fullname, email }: CreateUserBodyType) {
  const user = db.insert(users).values({ fullname, email }).returning().get();

  return mapUserToDto(user);
}

export async function getUsers(query: GetUserQueryType) {
  const { page, pageSize, ...filters } = query;

  const where = convertManyQueryFiltersToDrizzleWhere(
    getTableColumns(users),
    filters,
  );

  const { items, ...pagination } = await findWithPagination({
    pagination: { page, pageSize },
    table: users,
    where,
  });

  return {
    items: items.map(mapUserToDto),
    ...pagination,
  };
}

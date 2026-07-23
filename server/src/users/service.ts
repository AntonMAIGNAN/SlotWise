import type { UserType } from "db/schemas/users";
import { createUser } from "./repository";
import type { CreateUserBodyType } from "./schema";

export class UserService {
  async createUser(body: CreateUserBodyType) {
    return createUser(body);
  }
}

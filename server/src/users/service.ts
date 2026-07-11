import type { UserType } from "db/schemas/users";
import { createUser } from "./repository";
import type { CreateUserBodyType } from "./schema";

export class UserService {
  private mapUserToDto(user: UserType) {
    return {
      ...user,
      id: user.id.toString(),
    };
  }

  async createUser(body: CreateUserBodyType) {
    return this.mapUserToDto(await createUser(body));
  }
}

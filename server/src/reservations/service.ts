import {
  InternalServerError,
  NotFoundError,
  ParseError,
  status,
} from "elysia/error";
import { getUsers } from "../users/repository";
import { createReservationIfAvailable, getReservations } from "./repository";
import type {
  CreateReservationBodyType,
  GetReservationQueryType,
} from "./schema";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../common/error";

export class ReservationService {
  private async getUserByIdOrThrow(userId: string) {
    const {
      items: [user],
    } = await getUsers({ id: { eq: userId }, page: 1, pageSize: 1 });

    if (user) {
      return user;
    }

    throw new HttpError({
      message: "User does not exist.",
      status: StatusCodes.NOT_FOUND,
      payload: { userId },
    });
  }

  getReservations(query: GetReservationQueryType) {
    return getReservations(query);
  }

  async createReservation(body: CreateReservationBodyType) {
    await this.getUserByIdOrThrow(body.userId);
    return createReservationIfAvailable(body);
  }
}

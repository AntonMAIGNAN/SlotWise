import { getReservations } from "./repository";
import type { GetReservationQueryType } from "./schema";

export class ReservationService {
  getReservations(query: GetReservationQueryType) {
    return getReservations(query);
  }
}

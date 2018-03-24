import { Reservation } from "./entity/Reservation";
import { getRepository } from "typeorm";
import { User } from "./entity/User";
import { RequestReservationInput } from "../mutations/requestReservation";

export default async function(
    input: RequestReservationInput,
    requester: User)
    : Promise<Reservation>
{
    const repo = getRepository(Reservation);
    let reservation = await repo.findOne({
        where : {
            graphId: input.reservationId
        }
    });
    reservation.reservedBy = requester;
    
    reservation = await repo.save(reservation);   
    
    return reservation;
}
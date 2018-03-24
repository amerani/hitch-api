import { getRepository } from "typeorm";
import { RequestReservationInput } from "../../graphql/mutation/requestReservation";
import { User } from "../entity/User";
import { Reservation } from "../entity/Reservation";

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
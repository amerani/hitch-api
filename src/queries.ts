import { getRepository } from "typeorm";
import { User } from "./entity/User";
import { Trip } from "./entity/Trip";
import { Reservation } from "./entity/Reservation";
import { Leg } from "./entity/Leg";
import { Transport } from "./entity/Transport";

export function readWithCreatedReservations(creatorId: number){
    return getRepository(User)
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.reservationsCreated", "r")
    .where("u.id = :id", {id: creatorId})
    .getOne();
}

export async function fetchWithOpenReservations(tripId: number): Promise<Trip>{
    const trip = await getRepository(Trip).findOneById(tripId, {relations: ["legs", "legs.transport"]});
    trip.legs = await Promise.all(trip.legs.map(filterReservations));
    return trip;
}

async function filterReservations(leg: Leg): Promise<Leg> {
    const rezz = await getOpenReservations(leg);
    leg.transport.reservations = rezz;
    return leg;
}

async function getOpenReservations(leg: Leg): Promise<Reservation[]> {
    const transport = await getRepository(Transport).findOneById(leg.transport.id);
    const openReservations = transport.reservations.filter(res => res.reservedBy === null || res.reservedBy === undefined);
    return openReservations;
}
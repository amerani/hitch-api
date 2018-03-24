import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Trip } from "../entity/Trip";
import { Transport } from "../entity/Transport";
import { Leg } from "../entity/Leg";
import { Reservation } from "../entity/Reservation";

export function fetchUserByEmail(email: String): Promise<User> {
    return getRepository(User)
        .createQueryBuilder("u")
        .leftJoinAndSelect("u.userAccount", "ua")
        .where("ua.email = :email", {email})
        .getOne();
}

export function fetchUserById(id: number): Promise<User> {
    return getRepository(User).findOneById(id);
}

export function readWithCreatedReservations(creatorId: number){
    return getRepository(User)
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.reservationsCreated", "r")
    .where("u.id = :id", {id: creatorId})
    .getOne();
}

export async function fetchRiders(tripId: number, legId: number):Promise<User[]> {
    const trip = await getRepository(Trip).findOneById(tripId, {relations: ["legs", "legs.transport"]});
    const leg = trip.legs.find(l => l.id == legId);
    const transport = await getRepository(Transport).findOneById(leg.transport.id);
    return transport.reservations.map(r => r.reservedBy);
}

export async function fetchWithOpenReservations(tripId: number): Promise<Trip>{
    const trip = await getRepository(Trip).findOneById(tripId, {relations: ["legs", "legs.transport"]});
    trip.legs = await Promise.all(trip.legs.map(filterReservations));
    return trip;
}

export async function fetchTripByGraphId(graphId: number): Promise<Trip>{
    const trip = await getRepository(Trip).findOne({
        where: {graphId},
        relations: ["legs", "legs.transport", "legs.origin", "legs.destination"]
    });
    trip.legs = await Promise.all(trip.legs.map(withReservations));
    return trip;
}

async function withReservations(leg: Leg): Promise<Leg> {
    const transport = await getRepository(Transport).findOneById(leg.transport.id);
    leg.transport = transport;
    return leg;
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
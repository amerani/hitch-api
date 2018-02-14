import {getConnection, getManager, getRepository} from "typeorm";
import { User } from "./entity/User";
import { Trip } from "./entity/Trip";
import { UserAccount } from "./entity/UserAccount";
import { Reservation, ReservationType } from "./entity/Reservation";
import { TransportType } from "./entity/Transport";

export async function createAccountAsync(
    {firstName, lastName, email, passwordHash})
    : Promise<User> {

        const userRepo = getRepository(User);
        const user = userRepo
            .merge(new User(), {
                firstName, lastName, 
                userAccount: { email, passwordHash}
            });
        return userRepo.save(user);
}

export async function createReservationAsync(
    {type, description, price, creator}: CreateReservationModel)
    : Promise<Reservation> {

        const reservationRepo = getRepository(Reservation);
        let reservation = reservationRepo.create({
            type,
            description,
            price,
            createdBy: creator
        });
        return reservationRepo.save(reservation);
}

export async function createReservationsBulkAsync(
    reservations: CreateReservationModel[])
    : Promise<Reservation[]>{
    const reservationRepo = getRepository(Reservation);
    let entities = reservations.map(r => reservationRepo.create({
        type: r.type,
        description: r.description,
        price: r.price,
        createdBy: r.creator
    }));

    return reservationRepo.save(entities);
}

export async function createMinimalTrip(
    origin: string,
    destination: string,
    arrival: string,
    departure: string,
    transportType: TransportType,
    reservations: CreateReservationModel[]
    ) : Promise<Trip>
{
    const inputModel = getRepository(Trip)
        .merge(new Trip(), {
            legs: [
                {
                    origin: {
                        city: origin
                    },
                    destination: {
                        city: destination
                    },
                    arrival,
                    departure,
                    transport: {
                        type: transportType,
                        capacity: reservations.length,
                        reservations
                    }
                }
            ]
        });
    return getRepository(Trip).save(inputModel);
}

export declare type CreateReservationModel = 
{
    type: ReservationType;
    description: string | null;
    price: number;
    creator: User;
}
import {getConnection, getManager, getRepository} from "typeorm";
import { User } from "./entity/User";
import { UserAccount } from "./entity/UserAccount";
import { Reservation, ReservationType } from "./entity/Reservation";

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
    {type, description, price, creator}: 
    {type: ReservationType, description: string, price: number, creator: User})
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
import {getConnection, getManager, getRepository} from "typeorm";
import { User } from "./entity/User";
import { UserAccount } from "./entity/UserAccount";
import { Reservation, ReservationType } from "./entity/Reservation";

export async function createAccountAsync(
    {firstName, lastName, email, passwordHash})
    : Promise<User> {

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        const userAccount = new UserAccount();
        userAccount.email = email;
        userAccount.passwordHash = passwordHash;
        user.userAccount = userAccount;

        return getManager().save(user);
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
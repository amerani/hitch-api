import "reflect-metadata";
import {createConnection, getConnection, getRepository} from "typeorm";
import {createRoundTripListingAsync} from "./examples/createRoundTripListing";
import { createAccountAsync } from "./commands";
import { Transport } from "./entity/Transport";
import { Leg } from "./entity/Leg";
import { Reservation } from "./entity/Reservation";
import { fetchWithOpenReservations, fetchRiders, fetchUserByEmail } from "./queries";
import { User } from "./entity/User";
import { createUserAccount } from "./examples/createUserAccount";

createConnection().then(async connection => {

    const user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    });

    const byEmail = await fetchUserByEmail(user.userAccount.email);
    console.log(byEmail.userAccount.passwordHash);
    // const trip = await createRoundTripListingAsync(user);

    // let withRezz = await fetchWithOpenReservations(trip.id);
    // console.log(withRezz.legs.map(l => l.transport.reservations.length))

    // const rrepo = getRepository(Reservation);

    // const r1 = withRezz.legs[0].transport.reservations[0].id;
    // const ru1 = await createUserAccount();

    // const r2 = withRezz.legs[0].transport.reservations[1].id;
    // const ru2 = await createUserAccount();

    // rrepo.updateById(r1, {reservedBy: ru1});
    // rrepo.updateById(r2, {reservedBy: ru2});

    // const rus = await fetchRiders(trip.id, withRezz.legs[0].id);
    // console.log(rus);
    
    connection.close();

}).catch(error => {
    console.log(error);
    getConnection().close();
});

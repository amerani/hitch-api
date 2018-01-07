import "reflect-metadata";
import {createConnection, getConnection, getRepository} from "typeorm";
import {createRoundTripListingAsync} from "./examples/createRoundTripListing";
import { createAccountAsync } from "./commands";
import { Transport } from "./entity/Transport";
import { Leg } from "./entity/Leg";
import { Reservation } from "./entity/Reservation";

async function getOpenReservations(leg: Leg): Promise<Reservation[]> {
    const transport = await getRepository(Transport).findOneById(leg.transport.id);
    return transport.reservations.filter(res => res.reservedBy == null);
}

createConnection().then(async connection => {

    const user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    });

    const trip = await createRoundTripListingAsync(user);

    const rezz = await Promise.all(trip.legs.map(getOpenReservations));

    console.log(rezz);

    connection.close();

}).catch(error => {
    console.log(error);
    getConnection().close();
});

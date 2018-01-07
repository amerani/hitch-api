import "reflect-metadata";
import {createConnection, getConnection, getRepository} from "typeorm";
import {createRoundTripListingAsync} from "./examples/createRoundTripListing";
import { createAccountAsync } from "./commands";
import { Transport } from "./entity/Transport";
import { Leg } from "./entity/Leg";
import { Reservation } from "./entity/Reservation";
import { fetchWithOpenReservations } from "./queries";
import { User } from "./entity/User";

createConnection().then(async connection => {

    const user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    });

    const trip = await createRoundTripListingAsync(user);

    let withRezz = await fetchWithOpenReservations(trip.id);
    console.log(withRezz.legs.map(l => l.transport.reservations.length))

    const rId = withRezz.legs[0].transport.reservations[0].id;

    const reserver = await createAccountAsync({
        firstName: "john",
        lastName: "doe",
        email: `${Date.now()}@g.co`,
        passwordHash: "passwoed"
    })

    getRepository(Reservation).updateById(rId, {
        reservedBy: reserver
    })

    withRezz = await fetchWithOpenReservations(trip.id);
    console.log(withRezz.legs.map(l => l.transport.reservations.length))

    const driver = await getRepository(User).findOneById(user.id, {relations: ["reservations", "reservationsCreated"]});
    const rider = await getRepository(User).findOneById(reserver.id, {relations: ["reservations", "reservationsCreated"]});

    console.log(`driver: created=${driver.reservationsCreated.length} reserved=${driver.reservations.length}` )
    console.log(`rider: created=${rider.reservationsCreated.length} reserved=${rider.reservations.length}` )

    connection.close();

}).catch(error => {
    console.log(error);
    getConnection().close();
});

import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import {User} from "./entity/User";
import { UserAccount } from "./entity/UserAccount";
import {createAccountAsync, createReservationsBulkAsync, createReservationAsync} from "./commands";
import { Reservation } from "./entity/Reservation";
import { readWithCreatedReservations } from "./queries";

createConnection().then(async connection => {

    let user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    })

    await createReservationAsync({
        type: "seat", creator: user, price: 0, description: null
    })

    await createReservationsBulkAsync([{
        type: "recliner",
        description: "clean",
        price: 100,
        creator: user
    },
    {
        type: "seat",
        description: "leather",
        price: 150,
        creator: user
    }]);

    user = await readWithCreatedReservations(user.id);

    console.log(user);

    connection.close();

}).catch(error => console.log(error));

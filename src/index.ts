import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import {User} from "./entity/User";
import { UserAccount } from "./entity/UserAccount";
import {createAccountAsync, createReservationAsync} from "./commands";
import { Reservation } from "./entity/Reservation";

createConnection().then(async connection => {

    let user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    })

    await createReservationAsync({
        type: "seat",
        description: "clean",
        price: 100,
        creator: user
    });

    await createReservationAsync({
        type: "seat",
        description: "climate controlled",
        price: 150,
        creator: user
    });

    user = await getRepository(User)
        .createQueryBuilder("u")
        .leftJoinAndSelect("u.reservationsCreated", "r")
        .where("u.id = :id", {id: user.id})
        .getOne();

    console.log(user);

    connection.close();

}).catch(error => console.log(error));

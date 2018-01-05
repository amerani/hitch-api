import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import {User} from "./entity/User";
import { UserAccount } from "./entity/UserAccount";
import {createAccountAsync, createReservationsBulkAsync, createReservationAsync} from "./commands";
import { Reservation } from "./entity/Reservation";
import { readWithCreatedReservations } from "./queries";
import { Transport } from "./entity/Transport";

createConnection().then(async connection => {

    let user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    })

    const rv = {
        type: "rv",
        description: "burning man coach",
        capacity: 8,
        plateNumber: "LOVE420",
        ymm: "2000 RV RV",
        createdBy: user,
        operatedBy: user,
        reservations: [
            {
                type: "seat",
                price: 100,
                createdBy: user
            },
            {
                type: "seat",
                price: 100,
                createdBy: user
            },
            {
                type: "seat",
                price: 100,
                createdBy: user
            }
        ]
    }

    const transportEntity = getRepository(Transport)
        .merge(new Transport(), {
            type: "rv",
            description: "burning man coach",
            capacity: 8,
            plateNumber: "LOVE420",
            ymm: "2000 RV RV",
            createdBy: user,
            operatedBy: user,
            reservations: [
                {
                    type: "seat",
                    price: 100,
                    createdBy: user,
                    reservedBy: {
                        firstName: "buddy",
                        lastName: "bro"
                    }
                },
                {
                    type: "seat",
                    price: 100,
                    createdBy: user
                },
                {
                    type: "seat",
                    price: 100,
                    createdBy: user
                }
            ]
        });
    
    const createdRv = await getRepository(Transport).save(transportEntity);

    const t = await getRepository(Transport).findOneById(createdRv.id, {
        relations: ["createdBy", "reservations", "reservations.reservedBy"]
    });

    console.log(t);

    console.log(t.reservations.filter(r => r.reservedBy != null)[0].reservedBy)

    connection.close();

}).catch(error => console.log(error));

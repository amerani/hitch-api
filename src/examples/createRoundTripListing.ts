import { DateTime } from "luxon";
import "reflect-metadata";
import { getRepository} from "typeorm";
import { createAccountAsync } from "../commands";
import { Trip } from "../entity/Trip";

export const createRoundTripListing = async () => {

    let user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    })

    const inputModel = getRepository(Trip)
        .merge(new Trip(), {
            legs: [
                {
                    origin: {
                        city: "Austin"
                    },
                    destination: {
                        city: "Houston"
                    },
                    arrival: `${DateTime.utc().toString()}`,
                    departure: `${DateTime.utc().plus({hours:3}).toString()}`,
                    transport: {
                        type: "car",
                        description: "self driving",
                        capacity: 2,
                        plateNumber: "T-0XA",
                        ymm: "2017 Tesla ModelX",
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
                            }
                        ]
                    }
                },
                {
                    origin: {
                        city: "Houston"
                    },
                    destination: {
                        city: "Austin"
                    },
                    arrival: `${DateTime.local().toString()}`,
                    departure: `${DateTime.local().plus({hours:3}).toString()}`,
                    transport: {
                        type: "car",
                        description: "self driving",
                        capacity: 2,
                        plateNumber: "T-0XA",
                        ymm: "2017 Tesla ModelX",
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
                            }
                        ]
                    }
                }                
            ]
        })


    console.log("--INPUT MODEL--\n");
    inputModel.legs.map(l => l.LogInfo());
    
    const insertedModel = await getRepository(Trip).save(inputModel);

    console.log("--INSERT MODEL--\n");
    insertedModel.legs.map(l => l.LogInfo());

    const selectedModel = await getRepository(Trip).findOneById(insertedModel.id, {
        relations: ["legs", "legs.origin", "legs.destination"]
    });

    console.log("--SELECT MODEL--\n");
    selectedModel.legs.map(l => l.LogInfo());
}
import { DateTime } from "luxon";
import { getRepository} from "typeorm";
import { Trip } from "../entity/Trip";
import { Transport } from "../entity/Transport";
import { User } from "../entity/User";

export async function createRoundTripListingAsync(user: User): Promise<Trip> {

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

    return getRepository(Trip).save(inputModel);
}
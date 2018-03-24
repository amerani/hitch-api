import { TripModel } from "../models";
import authMutationFactory from "../authMutationFactory";
import { toTripModel } from "../../transformers";
import createTripCommand from "../../domain/command/createTripCommand";

export const schema = [
    `
        extend type Mutation {
            createMinimalTrip(input: CreateTripInput!):CreateTripPayload
        }

        input CreateTripInput {
            origin: String!
            destination: String!
            arrival: String!
            departure: String!
            transportType: TRANSPORT_TYPE!
            reservationType: RESERVATION_TYPE!
        }

        type CreateTripPayload {
            trip: Trip
        }
    `
]

export const resolver = {
    Mutation: {
        createMinimalTrip: authMutationFactory<CreateTripPayload>(
            async (root, args, ctx) => {
                return {
                    trip: toTripModel(
                        await createTripCommand(
                            args.input,
                            ctx.user
                        )
                    )
                }
        })
    }
}

export type CreateTripInput = {
    origin: string,
    destination: string,
    arrival: string,
    departure: string,
    transportType: string,
    reservationType: string   
}

export type CreateTripPayload = {
    trip: TripModel
}
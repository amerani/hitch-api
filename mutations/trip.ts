import authMutationFactory from "../src/authMutationFactory";
import createTripCommand from "../src/createTripCommand";
import { toTripModel } from "../transformers";
import { TripModel } from "../models";

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
        createMinimalTrip: authMutationFactory(async (root, args, ctx)
            :Promise<CreateTripPayload> => {
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
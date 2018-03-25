import authMutationFactory from "../authMutationFactory";
import { TripModel } from "../models";
import { toTripModel } from "../../transformers";
import createLegCommand from "../../domain/command/createLegCommand";

export const schema = [
    `
        extend type Mutation {
            createLeg(input: CreateLegInput!): CreateLegPayload
        }

        input CreateLegInput {
            tripId: ID!
            origin: String!
            destination: String!
            arrival: String!
            departure: String!
            transportType: TRANSPORT_TYPE!
            reservationType: RESERVATION_TYPE!
        }

        type CreateLegPayload {
            trip: Trip
        }
    `
]

export const resolver = {
    Mutation: {
        createLeg: authMutationFactory<CreateLegPayload>(
            async (root, args, ctx) => {
                const trip = await createLegCommand(args.input);
                return {
                    trip: toTripModel(trip)
                }
            }
        )
    }
}

export type CreateLegInput = {
    tripId: string,
    origin: string,
    destination: string,
    arrival: string,
    departure: string,
    transportType: string,
    reservationType: string
}

export type CreateLegPayload = {
    trip: TripModel
}
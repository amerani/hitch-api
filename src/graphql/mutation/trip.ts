import { TripModel } from "../models";
import authMutationFactory from "../authMutationFactory";
import { toTripModel } from "../../transformers";
import createTripCommand from "../../domain/command/createTripCommand";
import { pubSub } from '../../pubSubProvider';

export const schema = [
    `
        extend type Mutation {
            createTrip(input: CreateTripInput!):CreateTripPayload
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
        createTrip: authMutationFactory<CreateTripPayload>(
            async (root, args, ctx) => {
                const trip = toTripModel(
                    await createTripCommand(
                        args.input,
                        ctx.user
                    )
                );
                pubSub.publish('tripCreated', {
                    tripCreated: trip
                })
                pubSub.publish('notification', {
                    notification: trip
                })
                return {
                    trip
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
import { User } from "../src/entity/User";
import { fetchUserById } from "../src/queries";
import { createMinimalTrip, CreateReservationModel } from "../src/commands";
import { IResolvers, ITypeDefinitions } from "graphql-tools/dist/Interfaces";
import { toUserModel, toTripModel } from "../transformers";
import { ReservationModel, TripModel } from "../models";

export const schema : ITypeDefinitions = [
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

export const resolver : IResolvers = {
    Mutation: {
        createMinimalTrip: async (root, args, ctx):Promise<CreateTripPayload> => {
            
            const userContext = await ctx.user;
            if(!userContext) {
                throw new Error("Unauthorized");
            }

            const domainUser = await fetchUserById(userContext.id);

            const {
                origin,
                destination, 
                arrival,
                departure,
                transportType,
                reservationType
            } = args.input;
            
            const reservations: any = [
                {
                    type: reservationType,
                    price: 0
                }
            ];

            const trip = await createMinimalTrip(
                origin,
                destination,
                arrival,
                departure,
                transportType,
                reservations,
                domainUser
            );

            return {
                trip: toTripModel(trip)
            }
        }
    }
}

export type CreateTripPayload = {
    trip: TripModel
}
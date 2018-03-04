import { User } from "../src/entity/User";
import { fetchUserByEmail } from "../src/queries";
import { createMinimalTrip, CreateReservationModel } from "../src/commands";
import { IResolvers, ITypeDefinitions } from "graphql-tools/dist/Interfaces";
import { toUserModel, toTripModel } from "../transformers";
import { ReservationModel } from "../models";

export const schema : ITypeDefinitions = [
    `
        extend type Mutation {
            createMinimalTrip(
                origin: String!
                destination: String!
                arrival: String!
                departure: String!
                transportType: TRANSPORT_TYPE!
                reservationType: RESERVATION_TYPE!
            ):Trip
        }
    `
]

export const resolver : IResolvers = {
    Mutation: {
        createMinimalTrip: async (root, args, ctx) => {
            
            const userContext = await ctx.user;
            if(!userContext) {
                throw new Error("Unauthorized");
            }

            const domainUser = await fetchUserByEmail(userContext.email);

            const {
                origin,
                destination, 
                arrival,
                departure,
                transportType,
                reservationType
            } = args;
            
            const reservations: any = [
                {
                    type: reservationType,
                    createdBy: domainUser,
                    price: 0
                }
            ];

            const trip = await createMinimalTrip(
                origin,
                destination,
                arrival,
                departure,
                transportType,
                reservations
            );

            return toTripModel(trip);
        }
    }
}
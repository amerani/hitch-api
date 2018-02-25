import { User } from "../src/entity/User";
import { fetchUserByEmail } from "../src/queries";
import { CreateReservationModel, createMinimalTrip } from "../src/commands";
import { IResolvers, ITypeDefinitions } from "graphql-tools/dist/Interfaces";

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
                email: String!
            ):Trip
        }
    `
]

export const resolver : IResolvers = {
    Mutation: {
        createMinimalTrip: async (root, args, ctx) => {
            
            // const userContext = await ctx.user;
            // if(!userContext) {
            //     throw new Error("Unauthorized");
            // }

            // const domainUser = await fetchUserByEmail(userContext.email);

            const domainUser = await fetchUserByEmail(args.email);

            const {
                origin,
                destination, 
                arrival,
                departure,
                transportType,
                reservationType
            } = args;
            
            const reservations: CreateReservationModel[] = [
                {
                    type: reservationType,
                    creator: domainUser,
                    description: null,
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

            return {
                id: trip.graphId,
                createdBy: {
                    id: trip.createdBy.graphId,
                    userName: trip.createdBy.userAccount.userName,
                    email: trip.createdBy.userAccount.email
                },
                legs: trip.legs.map(l => {
                    return {
                        id: l.graphId,
                        origin: {
                            id: l.origin.graphId,
                            city: l.origin.city                            
                        },
                        destination: {
                            id: l.destination.graphId,
                            city: l.destination.city
                        },
                        arrival: l.arrival,
                        departure: l.departure,
                        transport: {
                            id: l.transport.graphId,
                            type: l.transport.type,
                            reservations: l.transport.reservations.map(r => {
                                return {
                                    id: r.graphId,
                                    type: r.type
                                }
                            })
                        }
                    }
                })
            }
        }
    }
}
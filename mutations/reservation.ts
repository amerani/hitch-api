import { getRepository } from "typeorm";
import { Transport } from "../src/entity/Transport";
import { Reservation } from "../src/entity/Reservation";
import { toTransportModel, toReservationModel } from "../transformers";
import { fetchUserByEmail, fetchUserById } from "../src/queries";
import { Trip } from "../src/entity/Trip";
import { TransportModel } from "../models";
import createReservationCommand from "../src/createReservationCommand";
import requestReservationCommand from "../src/requestReservationCommand";

export const schema = [
    `
        extend type Mutation {
            createReservation(input: CreateReservationInput!)
            :CreateReservationPayload

            requestReservation(input: RequestReservationInput!)
            :RequestReservationPayload
        }

        input CreateReservationInput {
            transportId: ID!
            type: RESERVATION_TYPE!
            description: String
            price: Int
            exchangeRequest: String
        }

        type CreateReservationPayload {
            transport: Transport
        }

        input RequestReservationInput {
            reservationId: ID!
        }

        type RequestReservationPayload {
            reservation: Reservation
        }
    `
]

export const resolver = {
    Mutation: {
        createReservation: async(root, args, ctx):Promise<CreateReservationPayload> => {
            const userContext = await ctx.user;
            if(!userContext) {
                throw new Error("Unauthorized");
            }

            const transport = await createReservationCommand(args.input);

            return {
                transport: toTransportModel(transport)
            }
        },

        requestReservation: async(root, args, ctx) => {
            const userContext = await ctx.user;
            if(!userContext){
                throw new Error("Unauthorized");
            }

            const reservation = await requestReservationCommand(
                args.input, userContext);

            return {
                reservation: toReservationModel(reservation)
            };
        }
    }
}

export type CreateReservationPayload = {
    transport: TransportModel
}

export type CreateReservationInput = {
    transportId: string,
    type: string, 
    description: string,
    exchangeRequest: string,
    price: number
}

export type RequestReservationPayload = {
    reservation: Reservation
}

export type RequestReservationInput = {
    reservationId: string
}
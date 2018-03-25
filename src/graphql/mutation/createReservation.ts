import { TransportModel, ReservationModel } from "../models";
import authMutationFactory from "../authMutationFactory";
import { toTransportModel } from "../../transformers";
import createReservationCommand from "../../domain/command/createReservationCommand";

export const schema = [
    `
        extend type Mutation {
            createReservation(input: CreateReservationInput!)
            :CreateReservationPayload
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
    `
]

export const resolver = {
    Mutation: {
        createReservation: authMutationFactory<CreateReservationPayload>(
            async (root, args, ctx) => {
                return {
                    transport: toTransportModel(
                        await createReservationCommand(args.input))
                }
        })
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
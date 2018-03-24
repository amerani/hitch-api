import { toTransportModel, toReservationModel } from "../transformers";
import { TransportModel, ReservationModel } from "../models";
import createReservationCommand from "../src/createReservationCommand";
import authMutationFactory from "../src/authMutationFactory";

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
        createReservation: authMutationFactory(async (root, args, ctx)
            :Promise<CreateReservationPayload> => {
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
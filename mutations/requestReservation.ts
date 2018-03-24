import { toTransportModel, toReservationModel } from "../transformers";
import { TransportModel, ReservationModel } from "../models";
import createReservationCommand from "../src/createReservationCommand";
import requestReservationCommand from "../src/requestReservationCommand";
import authMutationFactory from "../src/authMutationFactory";

export const schema = [
    `
        extend type Mutation {
            requestReservation(input: RequestReservationInput!)
            :RequestReservationPayload
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
        requestReservation: authMutationFactory(async (root, args, ctx)
            :Promise<RequestReservationPayload> => {
                return {
                    reservation: toReservationModel(
                        await requestReservationCommand(args.input, ctx.user)
                    )
                }
        })
    }
}

export type RequestReservationPayload = {
    reservation: ReservationModel
}

export type RequestReservationInput = {
    reservationId: string
}
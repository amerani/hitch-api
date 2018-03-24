import { TransportModel, ReservationModel } from "../models";
import authMutationFactory from "../authMutationFactory";
import { toReservationModel } from "../../transformers";
import requestReservationCommand from "../../domain/command/requestReservationCommand";

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
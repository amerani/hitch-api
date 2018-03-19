import { getRepository } from "typeorm";
import { Transport } from "../src/entity/Transport";
import { Reservation } from "../src/entity/Reservation";
import { toTransportModel, toReservationModel } from "../transformers";
import { fetchUserByEmail, fetchUserById } from "../src/queries";
import { Trip } from "../src/entity/Trip";
import { TransportModel } from "../models";

export const schema = [
    `
        extend type Mutation {
            createReservation(input: CreateReservationInput!):CreateReservationPayload

            reserve(
                reservationId: ID!
            ):Reservation
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
        createReservation: async(root, args, ctx):Promise<CreateReservationPayload> => {
            const userContext = await ctx.user;
            if(!userContext) {
                throw new Error("Unauthorized");
            }

            const {
                transportId, 
                type, 
                description,
                exchangeRequest,
                price
            } = args.input;

            const repo = getRepository(Transport);

            let transport = await repo.findOne({
                where: {
                    graphId: transportId
                }
            })

            let res = new Reservation();
            res.type = type;
            res.description = description;
            res.price = price;
            res.exchangeRequest = exchangeRequest;

            transport.reservations.push(res);
            transport = await repo.save(transport);

            return {
                transport: toTransportModel(transport)
            };
        },

        reserve: async(root, args, ctx) => {
            const userContext = await ctx.user;
            if(!userContext){
                throw new Error("Unauthorized");
            }

            const { reservationId } = args;

            const repo = getRepository(Reservation);
            let reservation = await repo.findOne({
                where : {
                    graphId: reservationId
                }
            });
            reservation.reservedBy = userContext;
            
            reservation = await repo.save(reservation);

            return toReservationModel(reservation);
        }
    }
}

export type CreateReservationPayload = {
    transport: TransportModel
}
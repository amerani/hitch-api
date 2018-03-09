import { getRepository } from "typeorm";
import { Transport } from "../src/entity/Transport";
import { Reservation } from "../src/entity/Reservation";
import { toTransportModel, toReservationModel } from "../transformers";
import { fetchUserByEmail, fetchUserById } from "../src/queries";
import { Trip } from "../src/entity/Trip";

export const schema = [
    `
        extend type Mutation {
            createReservation(
                transportId: ID!
                type: RESERVATION_TYPE!
                description: String
            ):Transport

            reserve(
                reservationId: ID!
            ):Reservation
        }
    `
]

export const resolver = {
    Mutation: {
        createReservation: async(root, props, ctx) => {
            const userContext = await ctx.user;
            if(!userContext) {
                throw new Error("Unauthorized");
            }

            const {transportId, type, description} = props;

            const repo = getRepository(Transport);

            let transport = await repo.findOne({
                where: {
                    graphId: transportId
                }
            })

            let res = new Reservation();
            res.type = type;
            res.description = description;
            res.price = 0;

            transport.reservations.push(res);
            transport = await repo.save(transport);

            return toTransportModel(transport);
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
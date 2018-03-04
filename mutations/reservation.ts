import { getRepository } from "typeorm";
import { Transport } from "../src/entity/Transport";
import { Reservation } from "../src/entity/Reservation";
import { toTransportModel } from "../transformers";
import { fetchUserByEmail } from "../src/queries";

export const schema = [
    `
        extend type Mutation {
            createReservation(
                transportId: ID!
                type: RESERVATION_TYPE!
                description: String
            ):Transport
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

            const domainUser = await fetchUserByEmail(userContext.email);

            const {transportId, type, description} = props;
            const repo = getRepository(Transport);
            const transport = await repo.findOne({
                where: {
                    graphId: transportId
                }
            })

            const reservation = new Reservation();
            reservation.type = type;
            reservation.description = description;
            reservation.price = 0;
            reservation.createdBy = domainUser;

            const resRepo = getRepository(Reservation);
            const saved = await resRepo.save(reservation);

            transport.reservations.push(saved);

            const savedTransport = await repo.save(transport);

            return toTransportModel(savedTransport);
        }
    }
}
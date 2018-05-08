import { getRepository, FindManyOptions } from "typeorm";
import { Trip } from "../../domain/entity/Trip";
import { toTripModel } from "../../transformers";

export const schema = [
    `
        extend type Query {
            myTrips(skip:Int, take:Int): [Trip]
        }
    `
]

export const resolver = {
    Query: {
        myTrips: async (root, args, ctx) => {
            const userCtx = ctx.user;
            if(!userCtx){
                throw new Error('Unauthorized')
            }
            const { skip, take} = args;

            const repo = getRepository(Trip);
            const findOpt:FindManyOptions<Trip> = {
                skip: skip || 0,
                take: take || 10,
                relations: [
                    "legs", 
                    "legs.origin", 
                    "legs.destination",
                    "legs.transport"
                ],
                order: {
                    "id": "DESC"
                },
                where: {
                    createdBy: userCtx.id
                }
            }
            const trips = await repo.find(findOpt);
            return trips.map(t => toTripModel(t))
        }
    }
}
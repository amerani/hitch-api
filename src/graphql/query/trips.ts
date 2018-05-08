import { getRepository, FindManyOptions } from "typeorm";
import { Trip } from "../../domain/entity/Trip";
import { toTripModel } from "../../transformers";

export const schema = [
    `
        extend type Query {
            trips(skip:Int, take:Int): [Trip]
        }
    `
]

export const resolver = {
    Query: {
        trips: async (root, args, ctx) => {
            const { skip, take } = args;

            const repo = getRepository(Trip);
            const findOpt:FindManyOptions<Trip> = {
                skip: skip || 0,
                take: take || 10,
                relations: [
                    "legs", 
                    "legs.origin", 
                    "legs.destination"],
                order: {
                    "id": "DESC"
                }
            }
            const trips = await repo.find(findOpt);
            return trips.map(t => toTripModel(t))
        }
    }
}
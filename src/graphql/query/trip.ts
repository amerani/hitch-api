import { getRepository } from "typeorm";
import { Trip } from "../../domain/entity/Trip";
import { toTripModel } from "../../transformers";
import { fetchTripByGraphId } from "../../domain/query/queries";

export const schema = [
    `
        extend type Query {
            trips(skip: Int, take: Int): [Trip]
            trip(id: ID!):Trip
        }
    `
];

export const resolver = {
    Query: {
        trips: async (root, args, ctx) => {
            const {
                skip,
                take
            } = args

            const repo = getRepository(Trip);

            const trips = await repo.find({
                skip: skip || 0,
                take: take || 10,
                relations: ["legs", "legs.origin", "legs.destination"]
            })

            return trips.map(t => toTripModel(t))
        },

        trip: async (root, args, ctx) => {
            const userContext = await ctx.user;
            if(!userContext){
                throw new Error("Unauthorized");
            }

            const { id } = args;

            const trip = await fetchTripByGraphId(id);

            return toTripModel(trip);
        }
    }
}
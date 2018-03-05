import { getRepository } from "typeorm";
import { Trip } from "../src/entity/Trip";
import { toTripModel } from "../transformers";

export const schema = [
    `
        extend type Query {
            trips(pageNum: Int, pageSize: Int): [Trip]
            trip(id: ID!):Trip
        }
    `
];

export const resolver = {
    Query: {
        trips: async (root, args, ctx) => {
            const {
                pageNum,
                pageSize
            } = args

            const repo = getRepository(Trip);

            const trips = await repo.find({
                skip: pageNum || 0,
                take: pageSize || 10,
                relations: ["legs", "legs.origin", "legs.destination", "legs.transport"]
            })

            return trips.map(t => toTripModel(t))
        },

        trip: async (root, args, ctx) => {
            const { id } = args;

            const repo = getRepository(Trip);

            const trip = await repo.findOne({
                where: { graphId : id },
                relations: ["legs", "legs.origin", "legs.destination", "legs.transport"]
            })

            return toTripModel(trip);
        }
    }
}
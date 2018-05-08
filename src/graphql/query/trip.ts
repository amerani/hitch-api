import { getRepository, FindManyOptions } from "typeorm";
import { Trip } from "../../domain/entity/Trip";
import { toTripModel } from "../../transformers";
import { fetchTripByGraphId } from "../../domain/query/queries";
import { merge } from 'lodash';
import { readAsync } from "../../domain/query/tripQuery";

export const schema = [
    `
        extend type Query {
            trip(id: ID!):Trip
        }
    `
];

export const resolver = {
    Query: {
        trip: async (root, args, ctx) => {
            const userContext = await ctx.user;
            const userId = userContext && userContext.id;
            const { id } = args;

            const trip = await readAsync(id, userId)

            return toTripModel(trip);
        }
    }
}


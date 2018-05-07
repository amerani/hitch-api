import { getRepository, FindManyOptions } from "typeorm";
import { Trip } from "../../domain/entity/Trip";
import { toTripModel } from "../../transformers";
import { fetchTripByGraphId } from "../../domain/query/queries";
import { merge } from 'lodash';

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
            const userContext = await ctx.user;
            const {
                skip,
                take
            } = args

            const repo = getRepository(Trip);

            const queries:Promise<Trip[]>[] = [];
            let findOptions:FindManyOptions<Trip> = {
                skip: skip || 0,
                take: take || 10,
                relations: ["legs", "legs.origin", "legs.destination"],
                order: {
                    "id": "DESC"
                }
            };

            queries.push(repo.find(findOptions));

            if(userContext) {
                findOptions = merge(findOptions, {
                    where: {
                        createdBy: userContext.id
                    }
                })
                queries.push(repo.find(findOptions))
            }

            const tripsResponses = await Promise.all(queries);
            const trips = tripsResponses.reduce((prev, cur) => {
                prev.push(...cur);
                return prev;
             }, [])
            
            return trips.map(t => toTripModel(t))
        },

        trip: async (root, args, ctx) => {
            const userContext = await ctx.user;
            if(!userContext){
                throw new Error("Unauthorized");
            }

            const { id } = args;

            const trip = await fetchTripByGraphId(id);

            if(trip.createdBy.id !== userContext.id) {
                throw new Error("Unauthorized: Not creator");
            }

            return toTripModel(trip);
        }
    }
}
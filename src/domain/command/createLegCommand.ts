import { CreateLegInput } from "../../graphql/mutation/createLeg";
import { Trip } from "../entity/Trip";
import { getRepository } from "typeorm";
import { Leg } from "../entity/Leg";
import { fetchTripByGraphId } from "../query/queries";
import { pubSub } from '../../pubSubProvider';
import { toLegModel } from "../../transformers";

export default async function(
    input: CreateLegInput)
    :Promise<Trip> 
{
    const repo = getRepository(Trip);
    let trip = await repo.findOne({
        where: {
            graphId: input.tripId
        },
        relations: ['legs']
    })

    let leg = getRepository(Leg)
        .merge(new Leg(), {
            origin: {
                city: input.origin
            },
            destination: {
                city: input.destination
            },
            arrival: input.arrival,
            departure: input.departure,
            transport: {
                type: <any>input.transportType,
                reservations: [
                    {
                        type: input.reservationType
                    }
                ]
            }
        });
    
    trip.legs.push(leg);
    await repo.save(trip);
    pubSub.publish('notification', {
        notification: toLegModel(leg)
    });

    return await fetchTripByGraphId(<any>input.tripId);
}
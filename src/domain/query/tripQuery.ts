import { getRepository } from "typeorm";
import { merge } from 'lodash';
import { Trip } from "../entity/Trip";
import { Transport } from "../entity/Transport";

export async function readAsync(
    graphId: number, 
    userId: number = -1) 
    {
        let findOptions = {
            relations: [
                "legs", 
                "legs.transport", 
                "legs.origin", 
                "legs.destination"
            ],
            where: {
                graphId
            }
        }
        
        const trip = await getRepository(Trip).findOne(findOptions);

        console.log(trip.createdBy.id, userId);

        //get entire trip when viewer is owner
        if(userId && userId != -1 && trip.createdBy.id == userId){
            trip.legs = await Promise.all(
                trip.legs.map(async (leg) => {
                        leg.transport = await getRepository(Transport)
                            .findOneById(leg.transport.id);
                        return leg;
                    })
            )
        }

        return trip;
}
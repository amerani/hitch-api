import { CreateTripInput } from "../mutations/trip";
import { User } from "./entity/User";
import { Trip } from "./entity/Trip";
import { fetchUserById } from "./queries";
import { createMinimalTrip } from "./commands";

export default async function (
    input: CreateTripInput,
    user: User)
    :Promise<Trip> 
{
    const reservations: any = [
        {
            type: input.reservationType,
            price: 0
        }
    ];

    const trip = await createMinimalTrip(
        input.origin,
        input.destination,
        input.arrival,
        input.departure,
        <any>input.transportType,
        reservations,
        user
    );
    
    return trip;
}
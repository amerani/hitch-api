import { schema as trip } from "./trip";
import { schema as myTrips } from "./myTrips";
import { schema as trips } from "./trips";

export const schema = [
    ...trip,
    ...myTrips,
    ...trips
]
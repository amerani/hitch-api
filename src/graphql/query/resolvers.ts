import { merge } from "lodash";
import { resolver as trip } from "./trip";
import { resolver as myTrips } from "./myTrips";
import { resolver as trips } from "./trips";

export const resolvers = merge(
    trip,
    myTrips,
    trips
)
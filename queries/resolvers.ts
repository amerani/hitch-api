import { merge } from "lodash";
import { resolver as trip } from "./trip";

export const resolvers = merge(
    trip
)
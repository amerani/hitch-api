import { merge } from "lodash";
import { resolver as login } from "./login";
import { resolver as signup } from "./signup";
import { resolver as createReservation } from "./createReservation";
import { resolver as requestReservation } from "./requestReservation";
import { resolver as trip } from "./trip";

export const resolvers = merge(
    login, 
    signup, 
    createReservation,
    requestReservation,
    trip
);
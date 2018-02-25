import { merge } from "lodash";
import { resolver as login } from "./login";
import { resolver as signup } from "./signup";
import { resolver as reservation } from "./reservation";
import { resolver as trip } from "./trip";

export const resolvers = merge(
    login, 
    signup, 
    reservation,
    trip
);
import { schema as login } from "./login";
import { schema as signup } from "./signup";
import { schema as createReservation } from "./createReservation";
import { schema as requestReservation } from "./requestReservation";
import { schema as trip } from "./trip";

export const schemas = [
    ...trip,
    ...login, 
    ...signup, 
    ...createReservation,
    ...requestReservation
];
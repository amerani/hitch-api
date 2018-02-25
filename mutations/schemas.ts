import { schema as login } from "./login";
import { schema as signup } from "./signup";
import { schema as reservation } from "./reservation";
import { schema as trip } from "./trip";

export const schemas = [
    ...trip,
    ...login, 
    ...signup, 
    ...reservation
];
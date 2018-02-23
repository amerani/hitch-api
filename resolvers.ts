import { merge } from "lodash";
import { resolver as login } from "./login";
import { resolver as signup } from "./signup";

export const resolvers = merge(login, signup);
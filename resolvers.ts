import { merge } from "lodash";
import { resolvers as mutations } from "./mutations/resolvers";

export const resolvers = merge(mutations);

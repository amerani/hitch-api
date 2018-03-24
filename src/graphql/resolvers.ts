import { merge } from "lodash";
import { resolvers as mutations } from "./mutation/resolvers";
import { resolvers as queries } from "./query/resolvers";

export const resolvers = merge(mutations, queries);

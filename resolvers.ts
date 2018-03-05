import { merge } from "lodash";
import { resolvers as mutations } from "./mutations/resolvers";
import { resolvers as queries } from "./queries/resolvers";

export const resolvers = merge(mutations, queries);

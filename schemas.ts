import { schema as models } from "./models";
import { schemas as mutations } from "./mutations/schemas";
import { schema as queries } from "./queries/schemas";

export const schemas = [
    ...models,
    ...mutations,
    ...queries
];
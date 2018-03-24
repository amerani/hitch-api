import { schema as models } from "./models";
import { schemas as mutations } from "./mutation/schemas";
import { schema as queries } from "./query/schemas";

export const schemas = [
    ...models,
    ...mutations,
    ...queries
];
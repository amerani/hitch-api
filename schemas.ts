import { schema as models } from "./models";
import { schemas as mutations } from "./mutations/schemas";

export const schemas = [
    ...models,
    ...mutations
];
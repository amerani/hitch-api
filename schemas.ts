import { schema as user } from "./UserModel";
import { schema as login } from "./login";
import { schema as signup } from "./signup";

export const schemas = [...user, ...login, ...signup];
import { createAccountAsync } from "../commands";

export function createUserAccount() {
    return createAccountAsync({
        firstName: Math.random().toString(36),
        lastName: Math.random().toString(36),
        email: `${Date.now().toString()}@gmail.com`,
        passwordHash: Math.random().toString(16)
    })
}
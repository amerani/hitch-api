import {getConnection, getManager} from "typeorm";
import { User } from "./entity/User";
import { UserAccount } from "./entity/UserAccount";

export async function createAccountAsync(
    {firstName, lastName, email, passwordHash})
    : Promise<User> {

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        const userAccount = new UserAccount();
        userAccount.email = email;
        userAccount.passwordHash = passwordHash;
        user.userAccount = userAccount;

        return getManager().save(user);
}
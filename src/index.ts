import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { UserAccount } from "./entity/UserAccount";

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";

    user.userAccount = new UserAccount();
    user.userAccount.email = `${Date.now()}@g.co`;
    user.userAccount.passwordHash = "password";

    const createdUser = await connection.manager.save(user);
    
    console.log(await connection.manager.findOneById<User>(User, createdUser.id));
    
}).catch(error => console.log(error));

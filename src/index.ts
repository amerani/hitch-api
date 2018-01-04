import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { UserAccount } from "./entity/UserAccount";
import {createAccountAsync} from "./commands";

createConnection().then(async connection => {

    const user = await createAccountAsync({
        firstName: "alek",
        lastName: "merani",
        email: `${Date.now()}@g.co`,
        passwordHash: "password"
    })

    console.log(user);

    connection.close();

}).catch(error => console.log(error));

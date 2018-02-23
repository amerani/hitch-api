import { fetchUserByEmail } from "./src/queries";
import { createAccountAsync } from "./src/commands";
import { JWT_SECRET } from './config';
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';

export const schema = [
    `
        extend type Mutation {
            signup(
                username: String
                email: String!
                password: String!
            ):User
        }    
    `
]

export const resolver = {
    Mutation: {
        signup: async (root, {email, password, username}, ctx) => {
            const user = await fetchUserByEmail(email);
            if(!user){
                const passwordHash = await bcrypt.hash(password, 10);
                const user = await createAccountAsync({
                    firstName: username, lastName: username, email, passwordHash
                })
                const { id } = user;
                const token = jwt.sign({id, email}, JWT_SECRET);
                const u = {
                    id: user.graphId,
                    jwt: token,
                    firstName: user.firstName,
                    lastName: user.lastName, 
                    email: user.userAccount.email
                }
                ctx.user = Promise.resolve(u);
                return u;
            }

            throw new Error('email already exists');
        }
    }
}
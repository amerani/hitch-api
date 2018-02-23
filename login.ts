import { fetchUserByEmail } from "./src/queries";
import { createAccountAsync } from "./src/commands";
import { JWT_SECRET } from './config';
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';

export const schema = [
    `
        extend type Mutation {
            login(
                username: String
                email: String!
                password: String!
            ):User
        }
    `
]

export const resolver = {
    Mutation: {
        login: async (root, {email, password}, ctx) => {
            const user = await fetchUserByEmail(email);
            if(user) {
                const same = await bcrypt.compare(password, user.userAccount.passwordHash);
                if(same) {
                    const token = jwt.sign({
                        id: user.id,
                        email: user.userAccount.email
                    }, JWT_SECRET);
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
                throw new Error('incorrect password')
            }
            throw new Error('email not found')
        }        
    }
}
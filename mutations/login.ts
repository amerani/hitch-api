import { fetchUserByEmail } from "../src/queries";
import { createAccountAsync } from "../src/commands";
import { JWT_SECRET } from '../config';
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { UserModel } from "../models";
import { toUserModel } from "../transformers";

export const schema = [
    `
        extend type Mutation {
            login(input: LoginInput!):LoginPayload
        }

        input LoginInput {
            username: String
            email: String!
            password: String!
        }

        type LoginPayload {
            user: User
        }
    `
]

export const resolver = {
    Mutation: {
        login: async (root, args, ctx):Promise<LoginPayload> => {
            const {email, password} = args.input;
            const user = await fetchUserByEmail(email);
            if(user) {
                const same = await bcrypt.compare(password, user.userAccount.passwordHash);
                if(same) {
                    const { id } = user;
                    const token = jwt.sign({id, email}, JWT_SECRET);
                    const userModel : UserModel = toUserModel(user, token);
                    ctx.user = Promise.resolve(userModel);
                    return {
                        user: userModel
                    }
                }
                throw new Error('incorrect password')
            }
            throw new Error('email not found')
        }        
    }
}

export type LoginPayload = {
    user: UserModel
}
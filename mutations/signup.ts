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
            signup(input: SignUpInput!):SignUpPayload
        }

        input SignUpInput {
            email: String!
            password: String!
            userName: String
            firstName: String
            lastName: String
        }

        type SignUpPayload {
            user: User
        }
    `
]

export const resolver = {
    Mutation: {
        signup: async (root, props, ctx) : Promise<SignUpPayload> => {
            const {
                email, 
                password,
                userName,
                firstName,
                lastName
            } = props.input;
            const user = await fetchUserByEmail(email);
            if(!user){
                const passwordHash = await bcrypt.hash(password, 10);
                const user = await createAccountAsync({
                    firstName, lastName, email, userName, passwordHash
                })
                const { id } = user;
                const token = jwt.sign({id, email}, JWT_SECRET);
                const userModel : UserModel = toUserModel(user, token);
                ctx.user = Promise.resolve(userModel);
                return {
                    user: userModel
                }
            }

            throw new Error('email already exists');
        }
    }
}

export type SignUpPayload = {
    user: UserModel
}
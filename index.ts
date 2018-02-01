import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {graphqlExpress, graphiqlExpress} from "apollo-server-express";
import {makeExecutableSchema} from "graphql-tools";
import { Entity } from "typeorm";
import { createAccountAsync } from "./src/commands";
import * as bcrypt from "bcrypt";
import { fetchUserByEmail } from "./src/queries";

createConnection({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "am",
    "database": "hitch_test",
    "synchronize": true,
    "entities": [
       "src/entity/**/*.ts"
    ],
    "migrations": [
       "src/migration/**/*.ts"
    ],
    "subscribers": [
       "src/subscriber/**/*.ts"
    ],
    "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
    }
 }).then(() => {

        const typeDefs = `
        type User {
            id: ID!
            firstName: String
            lastName: String
            email: String
            password: String
        }

        type Trip {
            id: ID!
            createdBy: User
        }

        type Query {
            trips(id: ID!): Trip
            user(email: String!): User
        }

        type Mutation {
            createUser(
                firstName: String!
                lastName: String!
                email: String!
                password: String!
            ):User
            verifyLogin(
                email: String!
                password: String!
            ):Boolean
        }

        type schema {
            query: Query
            mutation: Mutation
        }
    `
    const resolvers = {
        Query: {
            user: async (root, {email}) => {
                var user = await fetchUserByEmail(email);
                return {
                    id: user.graphId,
                    firstName: user.firstName,
                    lastName: user.lastName, 
                    email: user.userAccount.email
                }
            }
        },
        Mutation: {
            createUser: async (root, {firstName, lastName, email, password}) => {
                const passwordHash = await bcrypt.hash(password, 10);
                const user = await createAccountAsync({
                    firstName, lastName, email, passwordHash
                })
                return {
                    id: user.graphId,
                    firstName: user.firstName,
                    lastName: user.lastName, 
                    email: user.userAccount.email
                }
            },
            verifyLogin: async (root, {email, password}) => {
                const user = await fetchUserByEmail(email);
                const same = await bcrypt.compare(password, user.userAccount.passwordHash);
                return same;
            }
        }
    }

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const app = express();

    app.use('/graphql', bodyParser.json(), cors(), graphqlExpress({schema}));
    app.use('/graphiql', graphiqlExpress({endpointURL: 'graphql'}));

    app.listen(3000, () => {
        console.log('Go to http://localhost:3000/graphiql to run queries!');
    })
})
.catch(err => {
    console.log(err);
    getConnection().close;
})

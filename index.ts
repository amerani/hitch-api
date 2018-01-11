import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {graphqlExpress, graphiqlExpress} from "apollo-server-express";
import {makeExecutableSchema} from "graphql-tools";
import { Entity } from "typeorm";
import { createAccountAsync } from "./src/commands";

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
        }

        type Trip {
            id: ID!
            createdBy: User
        }

        type Query {
            trips(id: ID!): Trip
        }

        type Mutation {
            createUser(
                firstName: String!
                lastName: String!
                email: String!
            ):User
        }

        type schema {
            query: Query
            mutation: Mutation
        }
    `
    const resolvers = {
        Mutation: {
            createUser: async (root, {firstName, lastName, email}) => {
                const user = await createAccountAsync({
                    firstName, lastName, email, passwordHash: "password"
                })
                return {
                    id: user.graphId,
                    firstName: user.firstName,
                    lastName: user.lastName, 
                    email: user.userAccount.email
                }
            }
        }
    }

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const app = express();

    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
    app.use('/graphiql', graphiqlExpress({endpointURL: 'graphql'}));

    app.listen(3000, () => {
        console.log('Go to http://localhost:3000/graphiql to run queries!');
    })
})
.catch(getConnection().close)

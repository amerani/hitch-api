import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {graphqlExpress, graphiqlExpress} from "apollo-server-express";
import {makeExecutableSchema} from "graphql-tools";
import { Entity } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwtExpress from 'express-jwt';
import { JWT_SECRET } from './config';
import * as jwt from 'jsonwebtoken';
import { typeorm } from "./connectionFactory";
import { schemas } from "./graphql/schemas";
import { resolvers } from "./graphql/resolvers";
import { merge } from "lodash";
import { fetchUserById } from "./domain/query/queries";

createConnection(typeorm()).then(() => {

    const rootSchema = [
        `
            type Query {
                query:String
            }

            type Mutation {
                mutation:String
            }

            type schema {
                query: Query
                mutation: Mutation
            }
        `
    ]

    const rootResolvers = {
        Query: {
            query: () => "query"
        },
        Mutation: {
            mutation: () => "mutation"
        }
    }

    const executableSchema = makeExecutableSchema({
        typeDefs: [...rootSchema, ...schemas],
        resolvers: merge(rootResolvers, resolvers),
    });

    const app = express();

    const jwtMiddleware = () => jwtExpress({
        secret: JWT_SECRET,
        credentialsRequired: false
    });
   
    const graphqlExpressMiddleware = () => graphqlExpress(async (req: any, res) => {
        const user = req.user && await fetchUserById(req.user.id);
        return {
            schema: executableSchema,
            context: {
                user: user || Promise.resolve(null)
            }
        }
    });

    const requestLogger: express.RequestHandler = (req, res, next) => {
        console.log("REQUEST BODY\n", req.method, req.body, "\n")
        next();
    } 

    const middlewares: express.RequestHandler[] = [
        bodyParser.json(),
        cors(),
        requestLogger,
        jwtMiddleware(),
        graphqlExpressMiddleware()
    ]

    app.options("/*", (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');        
        res.send(200);
    })

    app.post('/', ...middlewares, (req, res) => res.redirect(307, 'graphql'))
    app.get('/', (req, res) => res.redirect(307, 'graphiql'));
    app.use('/graphql', ...middlewares);
    app.use('/graphiql', graphiqlExpress({endpointURL: 'graphql'}));

    app.listen(process.env.API_PORT, () => {
        console.log(`Go to http://localhost:${process.env.API_PORT}/graphiql to run queries!`);
    })
})
.catch(err => {
    console.log(err);
    getConnection().close;
})

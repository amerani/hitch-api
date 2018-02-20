import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {graphqlExpress, graphiqlExpress} from "apollo-server-express";
import {makeExecutableSchema} from "graphql-tools";
import { Entity } from "typeorm";
import { createAccountAsync, createMinimalTrip, CreateReservationModel } from "./src/commands";
import * as bcrypt from "bcrypt";
import { fetchUserByEmail, fetchUserById } from "./src/queries";
import * as jwtExpress from 'express-jwt';
import { JWT_SECRET } from './config';
import * as jwt from 'jsonwebtoken';
import { User } from "./src/entity/User";
import { typeorm } from "./connectionFactory";

createConnection(typeorm()).then(() => {

        const typeDefs = `
        type User {
            id: ID!
            firstName: String
            lastName: String
            email: String
            password: String
            jwt: String
        }

        type Trip {
            id: ID!
            createdBy: User
        }

        type Query {
            user(email: String!):User
            trips(id: ID!): Trip
        }

        type Mutation {
            createMinimalTrip(
                origin: String!
                destination: String!
                arrival: String!
                departure: String!
                transportType: String!
                reservationType: String!         
            ):Trip
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
            signup(
                email: String!
                password: String!
                username: String!
            ):User
            login(
                email: String!
                password: String!
            ):User
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
            },
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
            },
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
            },
            createMinimalTrip: async (root, {
                origin,
                destination,
                arrival,
                departure,
                transportType,
                reservationType
            }, ctx) => {
                const user = await ctx.user;
                if(!user){
                    throw new Error('Unauthorized')
                }
                const creator: User = new User();
                creator.id = user.id;
                const reservations: CreateReservationModel[] = [
                    {
                        type: reservationType,
                        creator,
                        description: null,
                        price: 0
                    }
                ]
                var trip = await createMinimalTrip(
                    origin,
                    destination,
                    arrival,
                    departure,
                    transportType,
                    reservations
                );
                console.log(trip)
                return {
                    id: trip.graphId,
                    // createdBy: {
                    //     id: trip.createdBy.graphId,
                    //     firstName: trip.createdBy.firstName,
                    //     lastName: trip.createdBy.lastName,
                    //     email: trip.createdBy.userAccount.email
                    // }
                }
            }
        }
    }

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const app = express();

    const jwtMiddleware = () => jwtExpress({
        secret: JWT_SECRET,
        credentialsRequired: false,
    });
   
    const graphqlExpressMiddleware = () => graphqlExpress(async (req: any, res) => {
        const user = req.user && await fetchUserById(req.user.id);
        return {
            schema,
            context: {
                user: user || Promise.resolve(null)
            }
        }
    });

    app.use('/graphql', bodyParser.json(), cors(), jwtMiddleware(), graphqlExpressMiddleware());
    app.use('/graphiql', graphiqlExpress({endpointURL: 'graphql'}));

    app.listen(3000, () => {
        console.log('Go to http://localhost:3000/graphiql to run queries!');
    })
})
.catch(err => {
    console.log(err);
    getConnection().close;
})

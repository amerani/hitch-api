import { ReservationType } from "./src/entity/Reservation";
import { TransportType } from "./src/entity/Transport";

export const schema = [
    `
        type User {
            id: ID!
            userName: String
            email: String!
            firstName: String
            lastName: String
            jwt: String
        }    
        
        type Trip {
            id: ID!
            createdBy: User
            legs: [Leg]!
        }

        type Leg {
            id: ID!
            origin: Location!
            destination: Location!
            arrival: String!
            departure: String!
            transport: Transport!
        }

        type Transport {
            id: ID!
            type: TRANSPORT_TYPE!
            description: String
            capacity: Int
            plateNumber: String
            ymm: String
            createdBy: User
            operatedBy: User
            reservations: [Reservation]!
        }

        type Reservation {
            id: ID!
            type: RESERVATION_TYPE!
            description: String
            createdBy: User
            reservedBy: User
        }

        enum RESERVATION_TYPE {
            SEAT
            BED
            RECLINER
        }

        type Location {
            id: ID!
            city: String!
        }

        enum TRANSPORT_TYPE {
            CAR
            BUS
            RV
        }
    `
]

export type UserModel = {
    id: number,
    userName: string,
    email: string,
    firstName: string,
    lastName: string,
    jwt: string
}

export type LocationModel = {
    id: number,
    city: string
}

export type ReservationModel = {
    id: number, 
    type: ReservationType,
    description: string,
    createdBy: UserModel,
    reservedBy: UserModel
}

export type TransportModel = {
    id: number,
    type: TransportType,
    description: string,
    capacity: number,
    plateNumber: string,
    ymm: string,
    createdBy: UserModel,
    operatedBy: UserModel,
    reservations: ReservationModel[]
}

export type LegModel = {
    id: number,
    origin: LocationModel,
    destination: LocationModel,
    arrival: string,
    departure: string,
    transport: TransportModel
}

export type TripModel = {
    id: number,
    createdBy: UserModel,
    legs: LegModel[]
}
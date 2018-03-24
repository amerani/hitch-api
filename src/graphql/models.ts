import { ReservationType } from "../domain/entity/Reservation";
import { TransportType } from "../domain/entity/Transport";

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
            transport: Transport
        }

        type Transport {
            id: ID!
            type: TRANSPORT_TYPE!
            description: String
            capacity: Int
            plateNumber: String
            ymm: String
            reservations: [Reservation]
        }

        type Reservation {
            id: ID!
            type: RESERVATION_TYPE!
            description: String
            price: Int
            exchangeRequest: String
            exchangeOffer: String
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
    price: number,
    description: string,
    exchangeRequest: string,
    exchangeOffer: string,
    reservedBy: UserModel
}

export type TransportModel = {
    id: number,
    type: TransportType,
    description: string,
    capacity: number,
    plateNumber: string,
    ymm: string,
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
export const schema = [
    `
        type User {
            id: ID!
            userName: String
            email: String
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
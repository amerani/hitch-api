import { UserAccount } from "./src/entity/UserAccount";
import { User } from "./src/entity/User";
import { UserModel, LegModel, LocationModel, TransportModel, ReservationModel, TripModel } from "./models";
import { Leg } from "./src/entity/Leg";
import { Location } from "./src/entity/Location";
import { Transport } from "./src/entity/Transport";
import { Reservation } from "./src/entity/Reservation";
import { Trip } from "./src/entity/Trip";

export const toUserModel = 
    function(user: User, jwt: string): UserModel {
        if(user == null)
            return null;
        return {
            id: user.graphId,
            jwt,
            firstName: user.firstName,
            lastName: user.lastName, 
            email: user.userAccount.email,
            userName: user.userAccount.userName,
        }
    }

export const toLocationModel = 
    function(location: Location) : LocationModel {
        if(location == null) return null;
        return {
            id: location.graphId,
            city: location.city
        }
    }

export const toLegModel =
    function(leg: Leg):LegModel {
        return {
            id: leg.graphId,
            origin: toLocationModel(leg.origin),
            destination: toLocationModel(leg.destination),
            arrival: leg.arrival,
            departure: leg.departure,
            transport: toTransportModel(leg.transport)
        }
    }

export const toTransportModel =
    function(transport: Transport): TransportModel {
        if(transport == null) return null;
        return {
            id: transport.graphId,
            type: transport.type,
            description: transport.description,
            capacity: transport.capacity,
            plateNumber: transport.plateNumber,
            ymm: transport.ymm,
            reservations: transport.reservations && transport.reservations.map(toReservationModel)
        }
    }

export const toReservationModel = 
    function(reservation: Reservation): ReservationModel {
        return {
            id: reservation.graphId, 
            type: reservation.type,
            description: reservation.description,
            reservedBy: toUserModel(reservation.reservedBy, null)
        }
    }

export const toTripModel = 
    function(trip: Trip): TripModel {
        return {
            id: trip.graphId,
            createdBy: toUserModel(trip.createdBy, null),
            legs: trip.legs.map(toLegModel)
        }
    }
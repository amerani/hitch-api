const gql = require("graphql-tag");
const createUser = require("./signupHelper");
const {DateTime} = require("luxon");

test('should create minimal trip', async () => {
    const createUserResponse = await createUser();
    const user = createUserResponse.user;

    const mutation = gql`
        mutation {
            createMinimalTrip (
                input: {
                    origin: "Austin",
                    destination: "New York",
                    arrival:"2013-02-04T18:35:24+00:00",
                    departure: "2013-02-04T18:35:24+00:00",
                    transportType: CAR,
                    reservationType: SEAT
                }
            ) {
                trip {
                    createdBy {
                        id
                    }
                    id
                    legs {
                        id
                        transport {
                            id
                            reservations {
                                id
                                reservedBy {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const res = await Client.mutate({
            mutation,
            context: {
                headers: {
                    authorization: `Bearer ${user.jwt}`
                }
            }
        })
    
        const trip = res.data.createMinimalTrip.trip;
    
        console.log("Trip ID: ", trip.id);
    
        expect(trip.id).not.toBeNull();
        expect(trip.createdBy.id).toEqual(user.id);
        expect(trip.legs[0].id).not.toBeNull();
        expect(trip.legs[0].transport.id).not.toBeNull();
        expect(trip.legs[0].transport.reservations[0].id).not.toBeNull();        
    } catch (error) {
        console.log(JSON.stringify(error))
        expect(error).toBeNull();
    }
})

test('should not create trip with unauthorized request', async () => {

    const mutation = gql`
        mutation {
            createMinimalTrip (
                input: {
                    origin: "Austin",
                    destination: "New York",
                    arrival:"2013-02-04T18:35:24+00:00",
                    departure: "2013-02-04T18:35:24+00:00",
                    transportType: CAR,
                    reservationType: SEAT
                }
            ) {
                trip {
                    id
                }
            }
        }
    `;

    try {
        const res = await Client.mutate({
            mutation
        })
    } catch (error) {
        console.log(JSON.stringify(error))
        expect(error).not.toBeNull();
        expect(error.graphQLErrors[0].message).toEqual('Unauthorized')
    }
})
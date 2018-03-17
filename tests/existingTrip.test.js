const gql = require('graphql-tag');
const createUser = require("./signupHelper");
const createTrip = require("./createTrip");
const getTrip = require('./getTrip');

let user;
let trip;

beforeEach(async () => {
    const createUserResponse = await createUser();
    user = createUserResponse.user;
    trip = await createTrip(user);
})

test('should create new reservation on existing trip', async () => {

    const numReservations = trip.legs[0].transport.reservations.length;

    const mutation = gql`
        mutation createReservation($transportId: ID!){
            createReservation(
                transportId: $transportId,
                type: SEAT
            )
            {
                id
                reservations {
                    id
                }
            }
        }        
    `;

    const res = await Client.mutate({
        mutation,
        variables: {
            transportId: trip.legs[0].transport.id
        },
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    })

    expect(res).not.toBeNull();

    const data = res.data.createReservation;

    expect(data.reservations).toHaveLength(numReservations + 1);
})

test('should query existing trip', async () => {
    const query = gql`
        query getTrip($id: ID!){
            trip(id: $id)
            {
                createdBy {
                    email
                }
                legs {
                    origin {
                        city
                    }
                    transport {
                        reservations {
                            type
                        }
                    }
                }
            }
        }        
    `;

    const res = await Client.query({
        query,
        variables: {
            id: trip.id
        },
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    })

    expect(res).not.toBeNull();

    const data = res.data.trip;

    expect(data.createdBy.email).not.toBeNull();
    expect(data.legs[0].origin.city).not.toBeNull();
    expect(data.legs[0].transport.reservations).not.toBeNull();
    expect(data.legs[0].transport.reservations[0].type).not.toBeNull();
})

test('should reserve existing reservation', async () => {

    expect(trip.legs[0].transport.reservations[0].reservedBy).toBeNull();

    const mutation = gql`
        mutation reserve($id: ID!) {
            reserve(reservationId: $id) {
                id
            }
        }
    `

    const res = await Client.mutate({
        mutation,
        variables: {
            id: trip.legs[0].transport.reservations[0].id
        },
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    })
    
    const data = res.data.reserve;

    expect(data.id).not.toBeNull();

    trip = await getTrip(trip.id, user);

    expect(trip.legs[0].transport.reservations[0].reservedBy.id).not.toBeNull();
})
const gql = require('graphql-tag');
const createUser = require("./signupHelper");
const createTrip = require("./createTrip");
const getTrip = require('./getTrip');

let user;
let trip;
let legCount;

beforeEach(async () => {
    const createUserResponse = await createUser();
    user = createUserResponse.user;
    const createTripResponse = await createTrip(user);
    trip = createTripResponse.trip;
    legCount = trip.legs.length;
})

test('should create leg on existing trip', async () => {
    const mutation = gql`
        mutation createLeg($tripId: ID!) {
            createLeg(input: {
                tripId: $tripId,
                origin: "Austin cool",
                destination: "Houston cool",
                arrival:"2013-02-04T18:35:24+00:00",
                departure:"2013-02-04T18:35:24+00:00",
                transportType: CAR,
                reservationType: SEAT
            })
            {
                trip {
                    id
                    legs {
                        id
                        origin {
                            city
                        }
                        transport {
                            id
                            type
                            reservations {
                                id
                                type
                            }
                        }
                    }
                }
            }
        }
    `

    try {
        const res = await Client.mutate({
            mutation,
            context: {
                headers: {
                    authorization: `Bearer ${user.jwt}`
                }
            },
            variables: {
                tripId: trip.id
            }
        })
        const data = res.data.createLeg.trip;
        expect(data.legs).toHaveLength(legCount + 1);

    } catch (error) {
        console.log(JSON.stringify(error))
        expect(error).toBeNull();
    }
})
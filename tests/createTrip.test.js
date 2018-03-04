const gql = require("graphql-tag");
const createUser = require("./signupHelper");
const {DateTime} = require("luxon");

test('should create minimal trip', async () => {
    const email = `${DateTime.utc().toString()}@hitch.cool`;
    const password = "password";
    const user = await createUser(email, password);

    const mutation = gql`
        mutation {
            createMinimalTrip (
                origin: "Austin",
                destination: "New York",
                arrival:"2013-02-04T18:35:24+00:00",
                departure: "2013-02-04T18:35:24+00:00",
                transportType: CAR,
                reservationType: SEAT
            ) {
                id
                legs {
                    id
                    transport {
                        id
                        reservations {
                            id
                        }
                    }
                }
            }
        }
    `;

    const res = await Client.mutate({
        mutation,
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    })

    const trip = res.data.createMinimalTrip;
    expect(trip.id).not.toBeNull();
    expect(trip.legs[0].id).not.toBeNull();
    expect(trip.legs[0].transport.id).not.toBeNull();
    expect(trip.legs[0].transport.reservations[0].id).not.toBeNull();
})
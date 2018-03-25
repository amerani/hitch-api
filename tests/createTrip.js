const gql = require('graphql-tag');

module.exports = async function(user) {
    const mutation = gql`
        mutation {
            createTrip (
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

    const res = await Client.mutate({
        mutation,
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    })

    const trip = res.data.createTrip;

    return trip;
}
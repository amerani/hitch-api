const gql = require('graphql-tag');
const createUser = require('./signupHelper');
const createTrip = require('./createTrip');

test('should only get publicly available trips when un auth', async () => {
    const query = gql`
        query {
            trips(take:2) {
                createdBy {
                    email
                }
                legs {
                    origin {
                        city
                    }
                    transport {
                        type
                    }
                }
            }
        }
    `

    const response = await Client.query({
        query
    });

    const data = response.data.trips;

    expect(data).toHaveLength(2);
    expect(data[0].createdBy.email).not.toBeNull();
    expect(data[0].legs[0].origin.city).not.toBeNull();
    expect(data[0].legs[0].transport).toBeNull();
})

test('should only get my trips', async () => {
    const query = gql`
        query {
            myTrips(take:1) {
                createdBy {
                    email
                }
                legs {
                    origin {
                        city
                    }
                    transport {
                        type
                    }
                }
            }
        }
    `

    const user = (await createUser()).user;
    const trip = await createTrip(user);

    const response = await Client.query({
        query,
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    });

    const data = response.data.myTrips;

    expect(data).toHaveLength(1);
})
const gql = require('graphql-tag');
const createUser = require("./signupHelper");
const createTrip = require("./createTrip");
const getTrip = require('./getTrip');

let user;
let trip;

beforeEach(async () => {
    const createUserResponse = await createUser();
    user = createUserResponse.user;
    const createTripResponse = await createTrip(user);
    trip = createTripResponse.trip;
})

test('my trip should not be visible to another user', async () => {
    const query = gql`
        query getTrip($id: ID!) {
            trip(id: $id) {
                createdBy {
                    email
                }
            }
        }
    `
    
    const anotherUser = (await createUser()).user;

    try {
        await Client.query({
            query,
            variables: {
                id: trip.id
            },
            context: {
                headers: {
                    authorization: `Bearer ${anotherUser.jwt}`
                }
            }
        })
    } catch (error) {
        expect(error).not.toBeNull();
    }
})
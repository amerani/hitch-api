const gql = require('graphql-tag');
const createUser = require("./signupHelper");
const createTrip = require("./createTrip");

test.only('should create new reservation on existing trip', async () => {
    const user = await createUser();
    const trip = await createTrip(user);

    const mutation = gql`
        mutation createReservation($transportId: ID!){
            createReservation(
                transportId: $transportId,
                type: SEAT
            )
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
})
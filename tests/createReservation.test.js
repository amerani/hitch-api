const gql = require('graphql-tag');
const createUser = require("./signupHelper");
const createTrip = require("./createTrip");

test('should create new reservation on existing trip', async () => {
    const user = await createUser();
    const trip = await createTrip(user);

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
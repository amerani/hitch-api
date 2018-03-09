const gql = require('graphql-tag');

module.exports = async function(tripId, user){
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
                            id
                            type
                            reservedBy {
                                id
                            }
                        }
                    }
                }
            }
        }        
    `;

    const res = await Client.query({
        query,
        variables: {
            id: tripId
        },
        context: {
            headers: {
                authorization: `Bearer ${user.jwt}`
            }
        }
    })

    return res.data.trip;
}

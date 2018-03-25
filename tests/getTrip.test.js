const gql = require('graphql-tag');

test('should get publicly available trips', async () => {
    const query = gql`
        query {
            trips(skip:0, take:2) {
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
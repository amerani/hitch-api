const gql = require('graphql-tag');
const { DateTime } = require('luxon');

test('should signup with email and password', async () => {
    const query = gql`
        mutation($email: String!) {
            signup(email: $email, password: "password") {
                id,
                jwt
            }
        }
    `;

    const email = `${DateTime.utc().toString()}@hitch.cool`;
    const response = await global.Client.mutate({
        mutation: query,
        variables: {
            email
        }
    })

    expect(response.data.signup.jwt).not.toBeNull();

})
const gql = require('graphql-tag');
const { DateTime } = require('luxon');

test('should signup with email and password', async () => {
    const query = gql`
        mutation($input: SignupInput!) {
            signup(input: $input) {
                id,
                jwt
            }
        }
    `;

    const email = `${DateTime.utc().toString()}@hitch.cool`;
    const response = await global.Client.mutate({
        mutation: query,
        variables: {
            input: {
                email,
                password: "password"
            }
        }
    })

    expect(response.data.signup.jwt).not.toBeNull();

})
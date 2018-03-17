const gql = require('graphql-tag');
const { DateTime } = require('luxon');

test('should signup with email and password', async () => {
    const query = gql`
        mutation($input: SignUpInput!) {
            signup(input: $input) {
                user {
                    id,
                    jwt
                }
            }
        }
    `;

    const email = `${DateTime.utc().toString()}@hitch.cool`;

    try {
        const response = await global.Client.mutate({
            mutation: query,
            variables: {
                input: {
                    email,
                    password: "password"
                }
            }
        })
        expect(response.data.signup.user.jwt).not.toBeNull();
        
    } catch (error) {
        console.log(JSON.stringify(error));
        expect(error).toBeNull();
    }
})
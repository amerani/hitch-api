const gql = require('graphql-tag');
const {DateTime} = require('luxon');

module.exports = async function(email, password) {
    const query = gql`
        mutation($email: String!, $password: String!) {
            signup(input:{email: $email, password: $password}) {
                id,
                jwt
            }
        }
    `;

    email = email || `${DateTime.utc().toString()}@hitch.cool`;
    password = password || "password";

    const response = await global.Client.mutate({
        mutation: query,
        variables: {
            email,
            password
        }
    })

    return response.data.signup;
}
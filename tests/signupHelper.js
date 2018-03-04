const gql = require('graphql-tag');

module.exports = async function(email, password) {
    const query = gql`
        mutation($email: String!, $password: String!) {
            signup(email: $email, password: $password) {
                id,
                jwt
            }
        }
    `;

    const response = await global.Client.mutate({
        mutation: query,
        variables: {
            email,
            password
        }
    })

    return response.data.signup;
}
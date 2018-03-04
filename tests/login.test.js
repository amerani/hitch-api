const gql = require('graphql-tag');
const {DateTime} = require("luxon");
const signup = require("./signupHelper");

test.only('should login with email and password', async () => {
    const email = `${DateTime.utc().toString()}@hitch.cool`;
    const password = "password";
    const signupRes = await signup(email, password);

    const loginMutation = gql`
        mutation($email:String!, $password:String!) {
            login(email:$email, password:$password) {
                id, jwt
            }
        }
    `;

    const loginRes = await Client.mutate({
        mutation: loginMutation,
        variables: {
            email, password
        }
    })

    expect(loginRes.data.login.jwt).not.toBeNull();
})
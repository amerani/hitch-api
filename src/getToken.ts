import * as request from "request-promise";

const options = { 
    method: 'POST',
    url: 'https://project-hitch.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: {
        client_id: 'C0qEeSb7AHGU2oMTEutZsURC3YCJzSMC',
        client_secret: 'nQ0cO2Yx0ChxWceZPEYkYe8kzdGLREp_aci-rIFHHIzc-jo4nYyEABdhKTq1xVdQ',
        audience: 'localhost:3000',
        grant_type: 'client_credentials'
    },
    json: true
  };

(async () => {
    const body = await request(options);
    console.log(body);
})()
.catch(err => console.log(err))

module.exports.basicAuthorizer = (event, context, callback) => {
    console.log(event, 'event');

    try {
        const { headers } = event;
        if (!headers.authorization) {
            callback('Unauthorized');
        }

        const authorizationToken = headers.authorization;

        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');

        const username = plainCreds[0];
        const password = plainCreds[1];

        console.log(username, 'username');
        console.log(password, 'password');

        const storeUserPassword = process.env[username];
        const effect = !storeUserPassword || storeUserPassword != password ? 'Deny' : 'Allow';
        
        const policy = generatePolicy(encodedCreds, event.routeArn, effect);

        console.log(policy, 'policy');
        console.log(encodedCreds, 'encodedCreds');
        console.log(event.routeArn, 'event.routeArn');
        console.log(effect, 'effect');

        callback(null, policy);

    } catch (error) {
        callback(`Unauthorized: ${error.message}`);
    }
}

const generatePolicy = (principalId, resource, effect) => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        },
    };
};
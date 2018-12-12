const cfenv = require('cfenv');
const request = require('request');

/**
 * @param {Map} oOptions - configuration for CloudFoundry destination service instance
 * @param {string} oOptions.url - the url to call in the destination, absolute path (including leading slash) e.g. /api/v1/json
 * @param {string} oOptions.destinationInstance - name of the instance of the destination service
 * @param {string} oOptions.destinationName - name of the destination to use
 * @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS')} oOptions.httpMethod - HTTP method to use
 */
async function doItNow(oOptions) {
    getToken(oOptions.destinationInstance).then(sToken => {
        return getDestination(sToken, oOptions.destinationName);
    }).then(oDestination => {
        //TODO: return promise with response from destination
        const oOptions = {
            method: oOptions.httpMethod,
            url: `${oDestination.destinationConfiguration.URL}${oOptions.url}`
        };

        if (oDestination.hasOwnProperty('authTokens')) {
            const oToken = oDestination.authTokens[0];
            oOptions.headers = {
                'Authorization': `${oToken.type} ${oToken.value}`
            };
        }
    });
}

/**
 * get the destination from destination service 
 * @param {string} sToken - JWT token to access the destination service
 * @param {string} sDestinationName - destination name
 * @returns {Promise.<Any>} - Promise object represents the destination
 */
async function getDestination(sToken, sDestinationName) {
    return new Promise((resolve, reject) => {
        const oDestinationService = cfenv.getAppEnv().getService(oOptions.destinationInstance);

        request({
            url: `${oDestinationService.credentials.uri}/destination-configuration/v1/destinations/${sDestinationName}`,
            headers: {
                'Authorization': `Bearer ${sToken}`
            }
        }, (error, response, data) => {
            if (error) {
                reject(error);
            } else if (response.statusCode == 200) {
                resolve(JSON.parse(data));
            } else {
                //TODO: handle error
                console.error("Something bad happened on getDestination");
                reject();
            }
        });
    });
}

/**
 * get a JWT token to access the destination service 
 * @param {string} sDestinationInstance - destination service instance name
 * @returns {Promise.<string>} - Promise object represents the token
 */
async function getToken(sDestinationInstance) {
    return new Promise((resolve, reject) => {
        const oDestinationService = cfenv.getAppEnv().getService(sDestinationInstance);
        const sCredentials = `${oDestinationService.credentials.clientid}:${oDestinationService.credentials.clientsecret}`;

        request({
            url: `${oDestinationService.credentials.url}/oauth/token`,
            method: 'POST',
            headers: {
                'Authorization': `Basic  ${Buffer.from(sCredentials).toString('base64')}`,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                'client_id': oDestinationService.credentials.clientid,
                'grant_type': 'client_credentials'
            }
        }, (error, response, data) => {
            if (error) {
                reject(error);
            } else if (response.statusCode == 200) {
                const sToken = JSON.parse(data).access_token;
                resolve(sToken);
            } else {
                //TODO: handle error
                console.error("Something bad happened on getToken");
                reject();
            }
        });
    });
}

module.exports = doItNow;

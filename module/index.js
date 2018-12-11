const cfenv = require('cfenv');
const request = require('request');

//TODO: documentar função

/**
 * @param {Map} oOptions - configuration for CloudFoundry destination service instance
 * @param {string} oOptions.url - the url to call in the destination, absolute path (including leading slash) e.g. /api/v1/json
 * @param {string} oOptions.destinationInstance - name of the instance of the destination service
 * @param {string} oOptions.destinationName - name of the destination to use
 */

exports = function(oOptions) {
   const oDestinationService = cfenv.getAppEnv().getService(oOptions.destinationInstance);
   const sCredentials = `${oDestinationService.credentials.clientid}:${oDestinationService.credentials.clientsecret}`;

   //TODO: usar promise
   //TODO: handle errors
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
    }, (err, res, data) => {
       if (res.statusCode === 200) {
           const oToken = JSON.parse(data).access_token;

           request({
                url: `${oDestinationService.credentials.uri}/destination-configuration/v1/destinations/${oOptions.destinationName}`,
                headers: {
                    'Authorization': `Bearer ${oToken}`
                }
            }, (err, res, data) => {
               const oDestination = JSON.parse(data);
                //TODO: call destination using options
                const options = {
                    method: 'GET',
                    url: oDestination.destinationConfiguration.URL + sEndpoint
                };

                if (oDestination.hasOwnProperty('authTokens')) {
                    const token = oDestination.authTokens[0];
                    options.headers = {
                        'Authorization': `${token.type} ${token.value}`
                    };
                }

               //TODO: return promise with response from destination
           });
       }
   });
};
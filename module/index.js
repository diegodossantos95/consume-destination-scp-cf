const cfenv = require('cfenv');
const request = require('request');

exports = function(sDestinationName, sServiceInstance, fnCallback) {
   const dest_service = cfenv.getAppEnv().getService(sServiceInstance);
   const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

   const post_options = {
       url: dest_service.credentials.url + '/oauth/token',
       method: 'POST',
       headers: {
           'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
           'Content-type': 'application/x-www-form-urlencoded'
       },
       form: {
           'client_id': dest_service.credentials.clientid,
           'grant_type': 'client_credentials'
       }
   }

   request(post_options, (err, res, data) => {
       if (res.statusCode === 200) {
           const token = JSON.parse(data).access_token;
           const get_options = {
               url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + sDestinationName,
               headers: {
                   'Authorization': 'Bearer ' + token
               }
           }

           request(get_options, (err, res, data) => {
               const oDestination = JSON.parse(data);
               const sURL = oDestination.destinationConfiguration.URL;
               fnCallback(sURL)
           });
       }
   });
};
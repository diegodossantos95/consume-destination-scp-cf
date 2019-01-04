const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const consumeDestination = require("../module/index");

chai.use(chaiAsPromised);
chai.should();

describe('validate requests', () => {
    beforeEach(() => {
        nock('https://auth-url.com.br')
            .post('/oauth/token')
            .reply(200, {
                "access_token": "access_token"
            });

        nock('https://destination-url.com.br')
            .get('/destination-configuration/v1/destinations/destination_name')
            .reply(200, {
                "destinationConfiguration": {
                    "URL": "https://final-destination.com.br"
                }
            });
        
        nock('https://final-destination.com.br')
            .get('/')
            .reply(200, "destination working as expected");
    });

    it('consuming destination without url', () => {
        return consumeDestination({
            httpMethod: 'GET',
            destinationInstance: 'destination-lite',
            destinationName: 'destination_name'
        }).then(response => {
            response.should.equal("destination working as expected");
        }).catch(error => {
            error.should.not.exist();
        });
    });
});
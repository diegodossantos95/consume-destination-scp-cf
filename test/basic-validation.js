const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const consumeDestination = require("../module/index");

chai.use(chaiAsPromised);
chai.should();

describe('validate input options', () => {
    it('should throw when an unsupported http method is supplied', () => {
            return consumeDestination({
                httpMethod: 'BLA',
                destinationInstance: 'instanceName',
                destinationName: 'destinationName'
            }).should.be.rejected;
    });

    it('should throw when no destination instance is supplied', () => {
        return consumeDestination({
            httpMethod: 'GET',
            destinationName: 'destinationName'
        }).should.be.rejected;
    });

    it('should throw when no destination name is supplied', () => {
        return consumeDestination({
            httpMethod: 'GET',
            destinationInstance: 'instanceName'
        }).should.be.rejected;
    });
});
# consume-destination-scp-cf
[![npm Package](https://img.shields.io/npm/v/consume-destination-scp-cf.svg)](https://www.npmjs.com/package/consume-destination-scp-cf)
[![Build Status](https://travis-ci.org/diegodossantos95/consume-destination-scp-cf.svg?branch=master)](https://travis-ci.org/diegodossantos95/consume-destination-scp-cf)
[![Generic badge](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](CONTRIBUTING.md)

NodeJS Module for accessing destination details on SAP Cloud Platform Cloud Foundry stack

## Install
~~~
npm i consume-destination-scp-cf
~~~

## Prerequisites
- Destination service instance created
- Destination configured
- All of the above instances bound to the node app, e.g. via `manifest.yml`:
  ~~~ yaml
  applications:
  - name: my_app
    path: my_app
    memory: 128M
    services:
      - destination-instance
  ~~~  
  
## Usage
~~~ js
const consumeDestination = require('consume-destination-scp-cf');

// Promise chain
consumeDestination({
        url: '/api/json',
        destinationInstance: 'my-destination-instance',
        destinationName: 'myDestination',
        http_verb: 'POST',
        payload: {
            "me": "here"
        }
    })
    .then(response => {
        // handle response
    })
    .catch(err => {
        // handle error
    })
~~~

## API
## consume-destination-scp-cf(options)
- `url` = Optional, the url to call in the destination, absolute path (including leading slash) e.g. /api/v1/json
- `destinationInstance` = Name of the instance of the destination service
- `destinationName` = Name of the destination to use
- `httpMethod` = HTTP method to use on Destination. Supported GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS.
- `payload` = Optional, payload for POST, PUT or PATCH

## License
MIT

## References
- Adaptation of [vobu/sap-cf-destination](https://github.com/vobu/sap-cf-destination) to consume destination without Connectivity and XSUAA services.

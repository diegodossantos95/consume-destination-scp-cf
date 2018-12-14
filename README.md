# consume-destination-scp-cf
NodeJS Module for accessing destination details on SAP Cloud Platform Cloud Foundry stack

## Install
~~~
npm i consume-destination-scp-cf
~~~

## Prerequisites
- destination service instance created
- destination configured
- all of the above instances bound to the node app, e.g. via `manifest.yml`:
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
- `url` = optional, the url to call in the destination, absolute path (including leading slash) e.g. /api/v1/json
- `destinationInstance` = name of the instance of the destination service
- `destinationName` = name of the destination to use
- `httpMethod` = HTTP method to use on Destination. Supported GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS.
- `payload` = optional, payload for POST, PUT or PATCH

## License
MIT

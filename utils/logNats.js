var nats = require('nats').connect();

// Log everythin that comes to core
nats.subscribe('core_in', function(msg) {
    console.log('Received a message: ' + msg);
    setTimeout(function() {
        nats.publish('core_out', "HELLO BABY!");
    }, 1000);
});

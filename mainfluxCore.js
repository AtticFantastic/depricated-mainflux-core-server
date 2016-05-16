/**
 * Copyright (c) Mainflux
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */

var uuid = require('node-uuid');
var nats = require('nats').connect();

var replySubject = '';

/**
 * createDevice()
 */
var createDevice = function(params) {
    console.log("createDevice");
 
    nats.publish(replySubject, 'Response from createDevice()');
}

/**
 * getDevices()
 */
var getDevices = function(params) {
    console.log("getDevices");
 
    nats.publish(replySubject, 'Response from getDevices()');
}

/**
 * getDevice()
 */
var getDevice = function(params) {
    console.log("getDevice");
 
    nats.publish(replySubject, 'Response from getDevice()');
}

/**
 * updateDevice()
 */
var updateDevice = function(params) {
    console.log("updateDevice");
 
    nats.publish(replySubject, 'Response from updateDevice()');
}

/**
 * deleteDevice()
 */
var deleteDevice = function(params) {
    console.log("deleteDevice");
 
    nats.publish(replySubject, 'Response from deleteDevice()');
}


/**
 * Lookup table of all API functions
 */
var fnList = {
    'createDevice' : createDevice,
    'getDevices' : getDevices,
    'getDevice' : getDevice,
    'updateDevice' : updateDevice,
    'deleteDevice' : deleteDevice
}

/** Subscribe to core_in subject */
nats.subscribe('core_in', function(req, replyTo) {
    console.log('Received a message: ' + req);

    var rpc = JSON.parse(req);
    replySubject = replyTo;

    console.log(replySubject);
    
    /** Call the function */
    fnList[rpc.method](rpc.params)

});


var banner = `
                                     
_|      _|            _|                _|_|  _|                      
_|_|  _|_|    _|_|_|      _|_|_|      _|      _|  _|    _|  _|    _|  
_|  _|  _|  _|    _|  _|  _|    _|  _|_|_|_|  _|  _|    _|    _|_|    
_|      _|  _|    _|  _|  _|    _|    _|      _|  _|    _|  _|    _|  
_|      _|    _|_|_|  _|  _|    _|    _|      _|    _|_|_|  _|    _|  
                                                                      
    
                == Industrial IoT System ==
       

                Made with <3 by Mainflux Team

[w] http://mainflux.io
[t] @mainflux

`

console.log(banner);


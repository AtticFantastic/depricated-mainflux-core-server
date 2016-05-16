/**
 * Copyright (c) Mainflux
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */

var deviceController = require('./app/controllers/devices');
var nats = require('nats').connect();

var replySubject = '';

/**
 * createDevice()
 */
var createDevice = function(params) {
    console.log("createDevice");
    
    var res = {};
    deviceController.createDevice(req, res, function() {
        nats.publish(replySubject, 'Response from createDevice(): ', res);
    });
}

/**
 * getDevices()
 */
var getDevices = function(params) {
    console.log("getDevices");
 
    var res = {};
    deviceController.getDevices(req, res, function() {
        nats.publish(replySubject, 'Response from getDevices(): ', res);
    });
}

/**
 * getDevice()
 */
var getDevice = function(params) {
    console.log("getDevice");

    var res = {};
    deviceController.getDevice(req, res, function() {
        nats.publish(replySubject, 'Response from getDevice(): ', res);
    });
}

/**
 * updateDevice()
 */
var updateDevice = function(params) {
    console.log("updateDevice");

    var res = {};
    deviceController.updateDevice(req, res, function() {
        nats.publish(replySubject, 'Response from updateDevice(): ', res);
    });
}

/**
 * deleteDevice()
 */
var deleteDevice = function(params) {
    console.log("deleteDevice");

    var res = {};
    deviceController.deleteDevice(req, res, function() {
        nats.publish(replySubject, 'Response from deleteDevice()');
    });
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


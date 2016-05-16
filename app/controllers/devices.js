var mongojs = require('mongojs');
var devicesDb = require('../database').collection('devices');
var uuid = require('node-uuid');
var config = require('../../config');
var log = require('../logger');
var os = require('os');


/** createDevice() */
exports.createDevice = function(req, res, next) {

    var deviceId = uuid.v1();
    req.body.deviceId = deviceId;
        
    /** Save the device and check for errors */
    devicesDb.save(req.body, function(err, device) {
        if (err)
            return next(err);

        res.json({
                'status': 200,
                'message': 'Device created',
                'deviceId': deviceId
        });
    });

    return next();
}

/** getAllDevices() */
exports.getAllDevices = function(req, res, next) {

	console.log("req.headers['x-auth-token'] = ", req.headers['x-auth-token']);

    log.info('hi');
		
    devicesDb.find(req.body, function(err, devices) {
        if (err)
            return next(err);

        res.json(devices);
        return next();
    });
}

/** getDevice() */
exports.getDevice = function(req, res, next) {

    devicesDb.findOne({deviceId: req.deviceId}, function(err, device) {
        if (err)
            return next(err);
        
        if (device) {
            res.json(device);
        } else {
            res.send("NOT FOUND");
        }
        return next();
    });
}

/** updateDevice() */
exports.updateDevice = function(req, res, next) {
    /** Use our device model to find the device we want */
    console.log(req.body);
    devicesDb.update({
        deviceId: req.deviceId
    },
        {$set: req.body},
        function(err, device) {
            if (err)
                return next(err);

            res.send('OK');
            return next();
    });
}

/** deleteDevice() */
exports.deleteDevice = function(req, res, next) {

    devicesDb.remove({
        deviceId: req.deviceId
    }, function(err, device) {
        if (err)
            return next(err);

        res.send('OK');
        return next();
    });
}


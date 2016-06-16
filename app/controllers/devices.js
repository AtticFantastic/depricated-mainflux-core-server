/**
 * Copyright (c) Mainflux (https://mainflux.com)
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */

var mongoDb = require('../database').mongoDb;
var uuid = require('node-uuid');
var config = require('../../config');
var log = require('../logger');
var os = require('os');

var Ajv = require('ajv');
var ajv = new Ajv();
var ajvDef = new Ajv({useDefaults: true}); /** prefill with defaults */
var deviceSchema = require('../models/deviceSchema.json');

var moment = require('moment');

/** createDevice() */
exports.createDevice = function(req, cb) {
    var res = {};

    var valid = ajvDef.validate(deviceSchema, req);
    if (!valid) {
        console.log(ajvDef.errors)
        res = JSON.stringify({
            'status' : 400,
            'message' : 'Bad Request'
        });

        return cb(ajvDef.errors, res);
    }

    req.id = uuid.v1();

    /** Timestamp */
    req.created = req.updated = moment().toISOString();
    
    /** Save the device and check for errors */
    mongoDb.devices.insert(req, function(err, ins) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message' : 'Internal Server Error'
            });
            return cb(err, res);
        }

        res = JSON.stringify({
                'status': 201,
                'message': 'Created',
                'id': req.id
        });

        return cb(err, res);
    });
}

/** getDevices() */
exports.getDevices = function(req, cb) {
    var res = {};

    mongoDb.devices.find(function(err, devices) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }

        console.log("DEVICES: ", devices);

        res = JSON.stringify(devices);
        return cb(err, res);
    });
}

/** getDevice() */
exports.getDevice = function(req, cb) {
    var res = {};

    /** HTTP API server has assured that req.id exists before sending us req */
    mongoDb.devices.findOne({'id': req.id}, function(err, device) {
        if (err) {
            res = JSON.stringify({
                'status' : 505,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }
        
        if (device) {
            res = JSON.stringify(device);
        } else {
            res = res = JSON.stringify({
                'status' : 404,
                'message': 'Not found',
                'deviceId': req.id
            });
        }
        return cb(err, res);
    });
}

/** updateDevice() */
exports.updateDevice = function(req, cb) {
    var res = {};

    var valid = ajv.validate(deviceSchema, req);
    if (!valid) {
        console.log(ajv.errors)
        res = JSON.stringify({
            'status' : 400,
            'message' : 'Bad Request'
        });

        return cb(ajv.errors, res);
    }

    /** Timestamp */
    req.updated = moment().toISOString();

    mongoDb.devices.update(
            {'id': req.id},
            {$set: req},
            function(err, upd) {
            if (err) {
                res = JSON.stringify({
                    'status' : 500,
                    'message': 'Internal Server Error'
                });
                return cb(err, res);
            }

            if (upd.n === 1) {
                res = JSON.stringify({
                    'status': 200,
                    'message': 'OK',
                    'deviceId': req.id
                });
            } else {
                res = JSON.stringify({
                    'status' : 404,
                    'message': 'Not found',
                    'deviceId': req.id
                });
            }

            return cb(err, res);
    });
}

/** deleteDevice() */
exports.deleteDevice = function(req, cb) {
    var res = {};

    mongoDb.devices.remove({
        'id': req.Id
    }, function(err, rem) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }

        if (rem.n === 1) {
            res = JSON.stringify({
                'status': 200,
                'message': 'OK',
                'deviceId': req.id
            });
        } else {
            res = JSON.stringify({
                'status': 404,
                'message': 'Not Found',
                'deviceId': req.id
            });
        }

        return cb(err, res);
    });
}


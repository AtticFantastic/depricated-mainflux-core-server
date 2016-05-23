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

/**
 * Stream Model
 *
 * {
 *      "name": "temperature",
 *      "display_name": "Temperature",
 *      "type": "numeric",
 *      "value": 32,
 *      "latest_value_at":"2014-09-10T19:15:01.325Z",
 *      "unit": { "label": "celsius", "symbol": "C" },
 *      "url": "https://api-m2x.att.com/v2/devices/a4f919d931c265ddd7b76649eac22f7e/streams/temperature",
 *      "created": "2014-09-09T19:15:00.344Z",
 *      "updated": "2014-09-10T19:15:00.390Z"
 * }
 */

/** createDevice() */
exports.createDevice = function(req, cb) {
    var res = {};
    var id = uuid.v1();

    /** TODO: req must contain streamId, streamName and streamType - form validation */
    var entity = {
        'name' : req.name,
        'type' : req.type
    }
        
    /** Save the stream and check for errors */
    mongoDb.streams.insert(entity, function(err, stream) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message' : 'Internal Server Error'
            });
            return cb(res, err);
        }

        res = JSON.stringify({
                'status': 200,
                'message': 'OK',
                'id': id
        });

        return cb(err, res);
    });
}

/** getDevices() */
exports.getDevices = function(req, cb) {
    var res = {};

    mongoDb.streams.find(function(err, streams) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }

        console.log("DEVICES: ", streams);

        res = JSON.stringify(streams);
        return cb(err, res);
    });
}

/** getDevice() */
exports.getDevice = function(req, cb) {
    var res = {};

    mongoDb.streams.findOne({'streamId': req.streamId}, function(err, stream) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }
        
        if (stream) {
            res = JSON.stringify(stream);
        } else {
            res = res = JSON.stringify({
                'status' : 404,
                'message': 'Not found',
                'streamId': req.streamId
            });
        }
        return cb(err, res);
    });
}

/** updateDevice() */
exports.updateDevice = function(req, cb) {
    var res = {};

    /** Use our stream model to find the stream we want */
    console.log(req);

    mongoDb.streams.update(
            {streamId: req.streamId},
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
                    'streamId': req.streamId
                });
            } else {
                res = JSON.stringify({
                    'status' : 404,
                    'message': 'Not found',
                    'streamId': req.streamId
                });
            }

            return cb(err, res);
    });
}

/** deleteDevice() */
exports.deleteDevice = function(req, cb) {
    var res = {};

    mongoDb.streams.remove({
        streamId: req.streamId
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
                'streamId': req.streamId
            });
        } else {
            res = JSON.stringify({
                'status': 404,
                'message': 'Not Found',
                'streamId': req.streamId
            });
        }

        return cb(err, res);
    });
}


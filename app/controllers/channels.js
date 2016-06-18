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

/** JSON Validation */
var Ajv = require('ajv');
var ajv = new Ajv();
var ajvDef = new Ajv({useDefaults: true}); /** prefill with defaults */
var channelSchema = require('../models/channelSchema.json');

/** Timestamp */
var moment = require('moment');

/** Logs */
log.info("hi");

/** createChannel() */
exports.createChannel = function(req, cb) {
    var res = {};

    var valid = ajvDef.validate(channelSchema, req);
    if (!valid) {
        log.error(ajvDef.errors)
        res = JSON.stringify({
            'status' : 400,
            'message' : 'Bad Request'
        });

        return cb(ajvDef.errors, res);
    }

    req.id = uuid.v1();

    /** Timestamp */
    req.created = req.updated = moment().toISOString();
    
    /** Save the channel and check for errors */
    mongoDb.channels.insert(req, function(err, ins) {
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

/** getChannels() */
exports.getChannels = function(req, cb) {
    var res = {};

    mongoDb.channels.find(function(err, channels) {
        if (err) {
            res = JSON.stringify({
                'status' : 500,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }

        log.info("DEVICES: ", channels);

        res = JSON.stringify(channels);
        return cb(err, res);
    });
}

/** getChannel() */
exports.getChannel = function(req, cb) {
    var res = {};

    /** HTTP API server has assured that req.id exists before sending us req */
    mongoDb.channels.findOne({'id': req.id}, function(err, channel) {
        if (err) {
            res = JSON.stringify({
                'status' : 505,
                'message': 'Internal Server Error'
            });
            return cb(err, res);
        }
        
        if (channel) {
            res = JSON.stringify(channel);
        } else {
            res = res = JSON.stringify({
                'status' : 404,
                'message': 'Not found',
                'id': req.id
            });
        }
        return cb(err, res);
    });
}

/** updateChannel() */
exports.updateChannel = function(req, cb) {
    var res = {};

    var valid = ajv.validate(channelSchema, req);
    if (!valid) {
        log.error(ajv.errors)
        res = JSON.stringify({
            'status' : 400,
            'message' : 'Bad Request'
        });

        return cb(ajv.errors, res);
    }

    /** Timestamp */
    req.updated = moment().toISOString();

    mongoDb.channels.update(
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
                    'id': req.id
                });
            } else {
                res = JSON.stringify({
                    'status' : 404,
                    'message': 'Not found',
                    'id': req.id
                });
            }

            return cb(err, res);
    });
}

/** deleteChannel() */
exports.deleteChannel = function(req, cb) {
    var res = {};

    mongoDb.channels.remove({
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
                'id': req.id
            });
        } else {
            res = JSON.stringify({
                'status': 404,
                'message': 'Not Found',
                'id': req.id
            });
        }

        return cb(err, res);
    });
}


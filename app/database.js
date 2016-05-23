/**
 * Copyright (c) Mainflux (https://mainflux.com)
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */

var config = require('../config');
var mongojs = require('mongojs');
var influx = require('influx');

/**
 * MONGO DB
 */
var collections = ['devices', 'streams'];
var dbUrl = '';
dbUrl = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.name;

var mongoConn = mongojs(dbUrl, collections);


/**
 * InfluxDB
 */
var influxClient = influx(config.influx);

module.exports = {
    mongoDb: mongoConn,
    influxDb: influxClient
}

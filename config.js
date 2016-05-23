/**
 * Copyright (c) Mainflux
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */
var config = {};

/**
 * Core HTTP server
 */
config.server = {
    message : 'We are in development',
    port : 6969,
    version: 0.1
}

/**
 * MongoDB
 */
config.mongo = {
    host : 'localhost',
    port : 27017,
    name : 'test'
}

/**
 * NATS
 */
config.nats = {
    host : 'localhost',
    port : 4222
}

/**
 * InfluxDB
 */
config.influx = {
  host : 'localhost',
  port : 8086, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  username : 'mainflux',
  password : '',
  database : '_internal'
}

module.exports = config;

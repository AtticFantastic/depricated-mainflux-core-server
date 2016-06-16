/**
 * Copyright (c) Mainflux (https://mainflux.com)
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */

/**
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "Mainflux"});
*/

var log = require('bristol');
var palin = require('palin');
log.addTarget('console').withFormatter(palin);


module.exports = log;

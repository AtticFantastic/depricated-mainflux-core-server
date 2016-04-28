/**
 * Copyright (c) Mainflux
 *
 * Mainflux server is licensed under an Apache license, version 2.0 license.
 * All rights not explicitly granted in the Apache license, version 2.0 are reserved.
 * See the included LICENSE file for more details.
 */
var restify = require('restify');
var domain = require('domain');
var config = require('./config');
var log = require('./app/logger');


/**
 * HTTP Restify
 */

/** Create coreServer */
var coreServer = restify.createServer({
    name: "Mainflux"
});


coreServer.pre(restify.pre.sanitizePath());
coreServer.use(restify.acceptParser(coreServer.acceptable));
coreServer.use(restify.bodyParser());
coreServer.use(restify.queryParser());
coreServer.use(restify.authorizationParser());
coreServer.use(restify.CORS());
coreServer.use(restify.fullResponse());

/** Global error handler */
coreServer.use(function(req, res, next) {
    var domainHandler = domain.create();

    domainHandler.on('error', function(err) {
        var errMsg = 'Request: \n' + req + '\n';
        errMsg += 'Response: \n' + res + '\n';
        errMsg += 'Context: \n' + err;
        errMsg += 'Trace: \n' + err.stack + '\n';

        console.log(err.message);

        log.info(err);
    });

    domainHandler.enter();
    next();
});


/**
 * ROUTES
 */
var route = require('./app/routes');
route(coreServer);


/**
 * SERVER START
 */
var port = process.env.PORT || config.server.port;

coreServer.listen(port, function() {
    console.log('HTTP magic happens on port ' + port);
});

var banner = `
oocccdMMMMMMMMMWOkkkkoooolcclX
llc:::0MMMMMMMM0xxxxxdlllc:::d
lll:::cXMMMMMMXxxxxxxxdlllc:::
lllc:::cXMMMMNkxxxdxxxxolllc::
olllc:::oWMMNkxxxdloxxxxolllc:   ##     ##    ###    #### ##    ## ######## ##       ##     ## ##     ##
xolllc:::xWWOxxxdllloxxxxolllc   ###   ###   ## ##    ##  ###   ## ##       ##       ##     ##  ##   ## 
xxolllc:::x0xxxdllll:oxxxxllll   #### ####  ##   ##   ##  ####  ## ##       ##       ##     ##   ## ##  
xxxolllc::oxxxxllll:::dxxxdlll   ## ### ## ##     ##  ##  ## ## ## ######   ##       ##     ##    ###   
xxxdllll:lxxxxolllc:::Okxxxdll   ##     ## #########  ##  ##  #### ##       ##       ##     ##   ## ##  
0xxxdllloxxxxolllc:::OMNkxxxdl   ##     ## ##     ##  ##  ##   ### ##       ##       ##     ##  ##   ## 
W0xxxdllxxxxolllc:::xMMMXxxxxd   ##     ## ##     ## #### ##    ## ##       ########  #######  ##     ##
MWOxxxdxxxxdlllc:::oWMMMMKxxxx
MMWkxxxxxxdlllc:::oNMMMMMM0xxx
MMMXxxxxxdllllc::cXMMMMMMMWOxx
MMMM0xxxxolllc:::kMMMMMMMMMXxx
`

console.log(banner);

console.log(config.server.message);


/**
 * Exports
 */
module.exports = coreServer;

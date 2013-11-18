// Configs
var config = require('./config.js');

// UDP REQ
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Database
var db = require('./database/' + config.db.name);
var dbConn = null;

// Flush
var flushCache = {};
var flushLoop = null;

// Get db connection
console.log('Connecting to the ' + config.db.name + ' database on: ' + config.db.url);
db.connect(config.db.url, function(err, db) {
	if (err) throw err;
	dbConn = db;

	// Bind the server
	server.bind(config.server.port, config.server.host);
});

// When do we start listening
server.on('listening', function() {
	var serverInfo = server.address();
	console.log('listening on: ' + serverInfo.address + ':' + serverInfo.port);

	// MAIN LOOP
	// Flush cache to db
	flushLoop = setInterval(function() {
		// Preserve flushCache, this way we can get new msg's
		var tempCache = flushCache;
		flushCache = {};

		// Flush the tempCache
		db.flush(dbConn, tempCache, function(err) {
			// Delete the tempcache
			delete tempCache;
		});
	}, config.server.flushInterval);
});

// What do to with received messages
server.on('message', function(message, remote) {
	var messageComponents = message.toString().split('|');

	if (messageComponents.length != 3) {
		throw 'Wrong message structure';
	}

	// Handle the message
	switch (messageComponents[0]) {
		case 'c':
			handleCounter(messageComponents[1], messageComponents[2], remote);
			break;
		default:
			console.log('Unhandled message: ' + message);
	}
});

var handleCounter = function(table, value, remote) {
	if (!flushCache[table]) {
		flushCache[table] = { rows:[] };
	}

	var countDefinition = {
		type: 'counter',
		timestamp: new Date().getTime(),
		value: value
	};

	flushCache[table]['rows'].push(countDefinition);
};
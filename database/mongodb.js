var MongoClient = require('mongodb').MongoClient;
var async = require('async');

/**
 * Connect to the database
 * @param  {string}   url      [the url]
 * @param  {Function} callback [cb]
 * @return {Function}          [cb]
 */
exports.connect = function(url, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) return callback(err);
		return callback(null, db);
	});
};

/**
 * Save to the database
 * @param  {object}   dbConn     [dbConn]
 * @param  {object}   flushCache [cache object]
 * @param  {Function} callback   [cb]
 * @return {Function}            [cb]
 */
exports.flush = function(dbConn, flushCache, callback) {
	async.each(Object.keys(flushCache), function(collectionName, cb) {
		var collection = dbConn.collection(collectionName); // Coll name
		var docs = flushCache[collectionName]['rows'];

		// Insert the docs in the collection
		collection.insert(docs, function (err, insertedDocs) {
			if (err) cb(err);
			cb();
		});
	}, function(err) {
		return callback();
	});
};

//async.each({a: 1, b: 2, c: 3}, function (val, key, callback) {});
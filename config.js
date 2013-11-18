var config = {
	server: {
		port: 8088,
		host: '127.0.0.1',
		flushInterval: 10000
	},
	authentication: {
		key: 'adminkey'
	},
	db: {
		name: 'mongodb',
		url: 'mongodb://127.0.0.1:27017/metrics'
	}
};

module.exports = config;
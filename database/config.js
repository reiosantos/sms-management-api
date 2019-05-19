const env = require('../config/environment');

process.env.DATABASE_URL = env.DATABASE_URL;

const defaultConfig = {
	databaseUrl: env.DATABASE_URL,
	dialect: env.DATABASE_DIALECT || 'mysql',
	logging: false,
	use_env_variable: 'DATABASE_URL',
	operatorsAliases: false
};

module.exports = {
	development: {
		...defaultConfig
	},
	test: {
		...defaultConfig
	},
	production: {
		...defaultConfig
	}
};

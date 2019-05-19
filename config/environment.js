require('dotenv').config();

const generalOptionalEnvVariables = [
	'DATABASE_DIALECT',
	'DATABASE_HOST',
	'DATABASE_PORT',
	'DATABASE_PASSWORD'
];

const optionalEnvVariables = {
	development: generalOptionalEnvVariables,
	staging: generalOptionalEnvVariables,
	test: generalOptionalEnvVariables,
	production: generalOptionalEnvVariables
};

const envExists = (env) => {
	const undefinedVariables = Object.keys(env)
		.filter(variable => env[variable] === undefined
			&& !optionalEnvVariables[process.env.NODE_ENV].includes(variable));

	if (!undefinedVariables.length) return env;
	throw new Error(`
    \nThe following variables are required and missing in .env:
    \n${undefinedVariables.join('\n')}`);
};

const DATABASE_URL = process.env.NODE_ENV === 'test'
	? process.env.SMS_TEST_DATABASE_URL
	: process.env.SMS_DATABASE_URL;

const envVars = {
	PORT: process.env.PORT || 5000,
	DATABASE_URL,
	DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'mysql',
	NODE_ENV: process.env.NODE_ENV || 'production'
};

const env = envExists(envVars);

module.exports = env;

import swaggerJSDoc from 'swagger-jsdoc';

const jsDoc = {
	definition: {
		swagger: '2.0', // Specification (optional, defaults to swagger: '2.0')
		info: {
			// API informations (required)
			title: 'SMS management API docs', // Title (required)
			version: '1.0.0', // Version (required)
			description: 'A simple SMS API', // Description (optional)
			termsOfService: 'http://swagger.io/terms/',
			contact: {
				name: 'API Support',
				url: 'http://sms-management-api.com/support',
				email: 'ronireiosantos@gmail.com'
			}
		},
		host: 'http://sms-management-api.com', // Host (optional)
		basePath: '/api/v1' // Base path (optional)
	},
	apis: ['**/routes/*.js']
};


const swaggerSpecification = swaggerJSDoc(jsDoc);

export default swaggerSpecification;

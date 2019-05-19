import debug from 'debug';
import http from 'http';
import app from '.';
import env from '../config/environment';

const logger = debug('sms-management-api');
const server = http.createServer(app);

server.listen(env.PORT, () => {
	const address = server.address();
	logger(`Find me on http://localhost:${address.port}`);
});

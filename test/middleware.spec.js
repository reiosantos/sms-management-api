import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import UserMiddleware from '../app/middlewares/userMiddleware';
import { login } from './__helpers__';

chai.should();

chai.use(chaiHttp);

describe('Middleware', () => {
	let token;

	before(async () => {
		token = await login();
	});

	it('should return empty array', () => {
		const ret = UserMiddleware.validate();
		expect(ret).to.be.a('Array');
		expect(ret).to.eql([]);
	});

	it('should return unknown URL 404', (done) => {
		chai.request(server)
			.post('/api/v1/unknown')
			.set('Authorization', `JWT ${token}`)
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('message');
				expect(res.body.message).to.eql('Not Found. Use /api/v1 to access the api.');
				done();
			});
	});

	it('should return 401', (done) => {
		chai.request(server)
			.post('/api/v1/users')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('message');
				expect(res.body.message).to.eql('No authorization token was found');
				done();
			});
	});
});

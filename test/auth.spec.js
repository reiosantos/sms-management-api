import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import { deleteAllModals } from './__helpers__';

chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
	beforeEach(async () => {
		await deleteAllModals();
	});

	afterEach(async () => {
		await deleteAllModals();
	});

	describe('Signup', () => {
		it('should create new user account', (done) => {
			chai.request(server)
				.post('/api/v1/signup')
				.send({
					password: 'santos',
					contact: '0779898652',
					username: 'Moses'
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('record');
					res.body.record.should.have.property('id');
					done();
				});
		});
	});

	describe('Login', () => {
		it('No credentials provided', (done) => {
			chai.request(server)
				.post('/api/v1/login')
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					expect(res.body.message.username)
						.to
						.eql('username is required');
					done();
				});
		});

		it('Password is required', (done) => {
			chai.request(server)
				.post('/api/v1/login')
				.send({ username: '2345' })
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					expect(res.body.message.password)
						.to
						.eql('password is required');
					done();
				});
		});

		it('Invalid credentials', (done) => {
			chai.request(server)
				.post('/api/v1/login')
				.send({
					username: '2345',
					password: 'santos'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					expect(res.body.message.user)
						.to
						.eql('username or password is invalid');
					done();
				});
		});

		it('Successful login credentials', async () => {
			const user = await chai.request(server)
				.post('/api/v1/signup')
				.send({
					password: 'santos',
					contact: '0779898652',
					username: 'Moses'
				});
			user.should.have.status(201);
			user.body.should.be.a('object');
			user.body.should.have.property('record');
			user.body.record.should.have.property('id');

			const loggedInUser = await chai.request(server)
				.post('/api/v1/login')
				.send({
					username: 'Moses',
					password: 'santos'
				});

			loggedInUser.should.have.status(200);
			loggedInUser.body.should.be.a('object');
			loggedInUser.body.should.have.property('user');
			loggedInUser.body.user.should.have.property('token');
		});
	});
});

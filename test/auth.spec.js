import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import ModelFactory from '../app/models/models.factory';

chai.should();

chai.use(chaiHttp);

const UserModel = ModelFactory.getModel('user');

describe('Authentication', () => {
	afterEach(() => {
		UserModel.deleteMany({}).exec();
	});

	describe('Signup', () => {
		it('should create new user account', (done) => {
			chai.request(server)
				.post('/api/v1/signup')
				.send({
					email: 'reiosantos@gmail.com',
					password: 'santos',
					contact: '779898652',
					firstName: 'Moses',
					lastName: 'santos'
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					res.body.user.should.have.property('token');
					done();
				});
		});
	});

	describe('Login', () => {
		it('No credentials provided', (done) => {
			chai.request(server)
				.post('/api/v1/login')
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors.username).to.eql('username is required');
					done();
				});
		});

		it('Password is required', (done) => {
			chai.request(server)
				.post('/api/v1/login')
				.send({ username: '2345' })
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors.password).to.eql('password is required');
					done();
				});
		});

		it('Invalid credentials', (done) => {
			chai.request(server)
				.post('/api/v1/login')
				.send({ username: '2345', password: 'santos' })
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors.user).to.eql('username or password is invalid');
					done();
				});
		});

		it('Successful login credentials', async () => {
			const user = await chai.request(server)
				.post('/api/v1/signup')
				.send({
					email: 'reiosantos@gmail.com',
					password: 'santos',
					contact: '779898652',
					firstName: 'Moses',
					lastName: 'santos'
				});
			user.should.have.status(201);
			user.body.should.be.a('object');
			user.body.should.have.property('user');
			user.body.user.should.have.property('token');

			const loggedInUser = await chai.request(server)
				.post('/api/v1/login')
				.send({ username: '779898652', password: 'santos' });

			loggedInUser.should.have.status(200);
			loggedInUser.body.should.be.a('object');
			loggedInUser.body.should.have.property('user');
			loggedInUser.body.user.should.have.property('token');
		});
	});
});

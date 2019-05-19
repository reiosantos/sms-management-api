import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../app';
import ModelFactory from '../app/models/models.factory';
import { login } from './__helpers__';

chai.should();

chai.use(chaiHttp);

const UserModel = ModelFactory.getModel('user');

describe('User Actions', () => {
	let token;
	let sandbox;
	let expectedResult;
	let expectedOneResult;

	beforeEach((done) => {
		sandbox = sinon.createSandbox();

		expectedResult = [
			{
				id: 'aefb6b0f-f518-4112-8209-c420559a2d1b',
				isAdmin: false,
				username: 'reiosantos1',
				contact: '1234567890',
				password: '$2b$10$5zCaVXaPEPLMGLbKFOi/q.G4UIa.fTpnyr2E4ubendDIKNLS36F1C',
				updatedAt: '2019-05-19T16:24:51.165Z',
				createdAt: '2019-05-19T16:24:51.165Z'
			},
			{
				id: 'aefb6b0f-f518-4112-8209-c420559a2d2b',
				isAdmin: false,
				username: 'reiosantos2',
				contact: '2223456789',
				password: '$2b$10$5zCaVXaPEPLMGLbKFOi/q.G4UIa.fTpnyr2E4ubendDIKNLS36F1C',
				updatedAt: '2019-05-19T16:24:51.165Z',
				createdAt: '2019-05-19T16:24:51.165Z'
			}
		];

		expectedOneResult = {
			id: 'aefb6b0f-f518-4112-8209-c420559a2d3b',
			isAdmin: false,
			username: 'reiosantos3',
			contact: '0987654321',
			password: '$2b$10$5zCaVXaPEPLMGLbKFOi/q.G4UIa.fTpnyr2E4ubendDIKNLS36F1C',
			updatedAt: '2019-05-19T16:24:51.165Z',
			createdAt: '2019-05-19T16:24:51.165Z'
		};

		sandbox.stub(UserModel, 'findAll')
			.returns(expectedResult);
		sandbox.stub(UserModel, 'findByPk')
			.returns(expectedOneResult);
		sandbox.stub(UserModel, 'create')
			.returns(expectedOneResult);
		done();
	});

	before(async () => {
		token = await login();
	});

	afterEach('restore sandbox', () => {
		sandbox.restore();
	});

	describe('/POST users', () => {
		it('should create new users', (done) => {
			sandbox.stub(UserModel, 'findOne')
				.returns(null);
			chai.request(server)
				.post('/api/v1/users')
				.set('Authorization', `JWT ${token}`)
				.send({
					password: 'santos',
					contact: '0779898652',
					username: 'Moses'
				})
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('record');
					expect(res.body.record.contact)
						.to
						.eql('0987654321');
					done();
				});
		});

		it('should raise validation error', (done) => {
			chai.request(server)
				.post('/api/v1/users')
				.set('Authorization', `JWT ${token}`)
				.send({
					password: 'santos'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.message.should.be.a('array')
						.to
						.have
						.length(2);

					expect(res.body.message[0].field)
						.to
						.deep
						.equal('username');
					expect(res.body.message[1].field)
						.to
						.deep
						.equal('contact');
					done();
				});
		});
	});

	describe('/GET users', () => {
		it('should fetch all users', (done) => {
			chai.request(server)
				.get('/api/v1/users')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('records');
					res.body.records.should.be.a('array');
					res.body.records.should.have.length(2);

					// due to sorting, the order of the records changes
					expect(res.body.records[0].username)
						.to
						.deep
						.equal('reiosantos1');
					expect(res.body.records[0].contact)
						.to
						.deep
						.equal('1234567890');
					done();
				});
		});

		it('should fetch a single user', (done) => {
			chai.request(server)
				.get('/api/v1/users/aefb6b0f-f518-4112-8209-c420559a2d2b')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('record');
					expect(res.body.record)
						.to
						.deep
						.equal(expectedOneResult);
					done();
				});
		});
	});

	describe('/PUT users', () => {
		const user = {
			email: 'reiosantos@gmail.com',
			password: 'santos',
			contact: '779898652',
			firstName: 'Moses kings',
			lastName: 'santos'
		};

		it('should update user called moses', (done) => {
			sandbox.stub(UserModel, 'findOne')
				.returns(
					Promise.resolve({
						update: () => ({
							dataValues: {
								...user,
								username: 'Moses king',
								contact: '1234567890'
							}
						})
					})
				);
			chai.request(server)
				.put('/api/v1/users/aefb6b0f-f518-4112-8209-c420559a2d3b')
				.set('Authorization', `JWT ${token}`)
				.send({
					username: 'Moses king',
					contact: '1234567890'
				})
				.end((err, res) => {
					res.should.have.status(202);
					res.body.should.be.a('object');
					res.body.should.have.property('record');
					expect(res.body.record.contact)
						.to
						.eql('1234567890');
					expect(res.body.record.username)
						.to
						.eql('Moses king');
					done();
				});
		});

		it('should throw error  when updating unknown user', (done) => {
			sandbox.stub(UserModel, 'findOne')
				.rejects(new Error('Unknown user'));

			chai.request(server)
				.put('/api/v1/users/aefb6b0f-f518-4112-8209-c420559a2d3b')
				.set('Authorization', `JWT ${token}`)
				.send({
					username: 'Moses king',
					contact: '1234567890'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					expect(res.body.message)
						.to
						.eql(
							'Record could not be updated. we were unable to find the Unknown user.'
						);
					done();
				});
		});
		it('should throw TypeError when updating unknown user', (done) => {
			sandbox.stub(UserModel, 'findOne')
				.rejects(new TypeError('Unknown user'));

			chai.request(server)
				.put('/api/v1/users/aefb6b0f-f518-4112-8209-c420559a2d3b')
				.set('Authorization', `JWT ${token}`)
				.send({
					username: 'Moses king',
					contact: '1234567890'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					expect(res.body.message)
						.to
						.eql(
							'We were unable to update this user. Its probably due to an invalid ID'
						);
					done();
				});
		});
	});

	describe('/DELETE user', () => {
		const user = {
			email: 'reiosantos@gmail.com',
			password: 'santos',
			contact: '779898652',
			firstName: 'Moses kings',
			lastName: 'santos'
		};

		beforeEach((done) => {
			sandbox.stub(UserModel, 'destroy')
				.returns(
					{
						dataValues: {
							...user,
							username: 'Moses king',
							contact: '1234567890'
						}
					}
				);
			done();
		});

		it('should delete user called moses', (done) => {
			chai.request(server)
				.delete('/api/v1/users/aefb6b0f-f518-4112-8209-c420559a2d1b')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});
});

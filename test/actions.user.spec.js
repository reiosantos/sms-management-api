import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../app';
import ModelFactory from '../app/models/models.factory';
import login from './__helpers__/login';

chai.should();

const UserModel = ModelFactory.getModel('user');

chai.use(chaiHttp);

describe('User Actions', () => {
	let UserSchema;
	let token;

	before(async () => {
		token = await login();
	});

	after(() => {
		UserModel.deleteMany({}).exec();
	});

	describe('/GET users', () => {
		beforeEach((done) => {
			UserSchema = sinon.mock(UserModel);
			const expectedResult = [
				{ firstName: 'ronald', _id: '5c2528916780fb838682d41f' },
				{ firstName: 'santos', _id: '5c2528916780fb838682d42f' },
				{ firstName: 'rona sek', _id: '5c2528916780fb838682d43f' }
			];
			const expectedOneResult = { firstName: 'rona sek', _id: '5c2528916780fb838682d43f' };

			UserSchema.expects('find').yields(null, expectedResult);
			UserSchema.expects('findOne').yields(null, expectedOneResult);
			done();
		});

		afterEach((done) => {
			UserSchema.restore();
			done();
		});

		it('should fetch all users', (done) => {
			chai.request(server)
				.get('/api/v1/users')
				.set('Authorization', `Token ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('users');
					res.body.users.should.be.a('array');
					res.body.users.should.have.length(3);

					// due to sorting, the order of the records changes
					expect(res.body.users[0]).to.deep.equal(
						{ firstName: 'rona sek', _id: '5c2528916780fb838682d43f' }
					);
					expect(res.body.error).to.deep.equal(null);
					done();
				});
		});

		it('should fetch a single user', (done) => {
			chai.request(server)
				.get('/api/v1/users/5c2528916780fb838682d43f')
				.set('Authorization', `Token ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					res.body.should.have.property('error');
					expect(res.body.user).to.deep.equal(
						{ firstName: 'rona sek', _id: '5c2528916780fb838682d43f' }
					);
					done();
				});
		});
	});

	describe('/POST users', () => {
		beforeEach((done) => {
			UserSchema = sinon.mock(UserModel);
			const expectedResult = {
				_id: '5c2528916780fb838682d43f',
				email: 'reiosantos@gmail.com',
				password: 'santos',
				contact: '779898652',
				firstName: 'Moses',
				lastName: 'santos'
			};
			UserSchema.expects('create').yields(null, expectedResult);
			done();
		});

		afterEach((done) => {
			UserSchema.restore();
			done();
		});

		it('should create new users', (done) => {
			chai.request(server)
				.post('/api/v1/users')
				.set('Authorization', `Token ${token}`)
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
					expect(res.body.user.contact).to.eql('779898652');
					expect(res.body.user._id).to.eql('5c2528916780fb838682d43f');
					done();
				});
		});

		it('should raise validation error', (done) => {
			chai.request(server)
				.post('/api/v1/users')
				.set('Authorization', `Token ${token}`)
				.send({
					email: 'reiosantos@gmail.com',
					password: 'santos',
					lastName: 'santos'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.be.a('array').to.have.length(2);

					expect(res.body.errors[0].field).to.deep.equal('firstName');
					expect(res.body.errors[1].field).to.deep.equal('contact');
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

		beforeEach((done) => {
			UserSchema = sinon.mock(UserModel);

			const expectedResult = { _id: '5c2528916780fb838682d43f', ...user };
			UserSchema.expects('create').yields(null, expectedResult);
			UserSchema.expects('findByIdAndUpdate').yields(null, {
				...expectedResult, firstName: 'Moses king'
			});

			chai.request(server)
				.post('/api/v1/users')
				.send(user);
			done();
		});

		afterEach((done) => {
			UserSchema.restore();
			done();
		});

		it('should update user called moses', (done) => {
			chai.request(server)
				.put('/api/v1/users/5c2528916780fb838682d43f')
				.set('Authorization', `Token ${token}`)
				.send({ firstName: 'Moses king' })
				.end((err, res) => {
					res.should.have.status(202);
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					expect(res.body.user.contact).to.eql('779898652');
					expect(res.body.user.firstName).to.eql('Moses king');
					expect(res.body.user._id).to.eql('5c2528916780fb838682d43f');
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
			UserSchema = sinon.mock(UserModel);

			const expectedResult = { _id: '5c2528916780fb838682d43f', ...user };
			UserSchema.expects('create').yields(null, expectedResult);
			UserSchema.expects('findByIdAndDelete').yields(null, {
				...expectedResult, firstName: 'Moses king'
			});

			chai.request(server)
				.post('/api/v1/users')
				.send(user);
			done();
		});

		afterEach((done) => {
			UserSchema.restore();
			done();
		});

		it('should delete user called moses', (done) => {
			chai.request(server)
				.delete('/api/v1/users/5c2528916780fb838682d43f')
				.set('Authorization', `Token ${token}`)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});
});

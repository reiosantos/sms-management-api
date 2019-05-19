import chai from 'chai';
import server from '../../app';
import ModelFactory from '../../app/models/models.factory';

const SmsModel = ModelFactory.getModel('sms');
const UserModel = ModelFactory.getModel('user');

const deleteAllModals = async () => {
	await SmsModel.destroy({ where: {} });
	await UserModel.destroy({ where: {} });
};

const login = async () => {
	await deleteAllModals();

	await chai.request(server)
		.post('/api/v1/signup')
		.send({
			password: 'santos',
			contact: '0000000000',
			username: 'sekibuule'
		});

	const loggedInUser = await chai.request(server)
		.post('/api/v1/login')
		.send({
			username: 'sekibuule',
			password: 'santos'
		});

	return loggedInUser.body.user.token;
};

export { login, deleteAllModals };

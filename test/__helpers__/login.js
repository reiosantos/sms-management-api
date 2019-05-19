import chai from 'chai';
import server from '../../app';

const login = async () => {
	await chai.request(server)
		.post('/api/v1/signup')
		.send({
			email: 'reiosantos@gmail.com',
			password: 'santos',
			contact: '779898652',
			firstName: 'Moses',
			lastName: 'santos'
		});

	const loggedInUser = await chai.request(server)
		.post('/api/v1/login')
		.send({ username: '779898652', password: 'santos' });

	return loggedInUser.body.user.token;
};

export default login;

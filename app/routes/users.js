import express from 'express';
import UserActions from '../actions/users';
import Helpers from '../helpers';
import UserMiddleware from '../middlewares/userMiddleware';

const userRouter = express.Router({});

userRouter
	.get('/users', UserActions.getAllUsers)
	.get('/users/:userId',
		UserMiddleware.validate('getUser'),
		Helpers.returnErrors,
		UserActions.getUser)
	.post('/users',
		UserMiddleware.validate('createUser'),
		Helpers.returnErrors,
		UserActions.createUser)
	.put('/users/:userId',
		UserMiddleware.validate('updateUser'),
		Helpers.returnErrors,
		UserActions.updateUser)
	.delete('/users/:userId',
		UserMiddleware.validate('getUser'),
		Helpers.returnErrors,
		UserActions.deleteUser);

export default userRouter;

import passport from 'passport';
import { USER_MODAL } from '../constants';
import { generateJWTToken, hashPassword, toAuthJSON } from '../helpers/auth.helpers';
import DatabaseWrapper from '../models';

export const signup = async (req, res) => {
	const { body: user } = req;
	try {
		user.password = await hashPassword(user.password);
		const userData = await DatabaseWrapper.findOne(USER_MODAL, { username: user.username });

		if (userData && userData.id) {
			return res.status(400).json({
				message: 'This username is already taken, please choose a different name'
			});
		}
		const data = await DatabaseWrapper.createOne(USER_MODAL, user);
		return res.status(201).json({ record: data });
	} catch (err) {
		let resp = err.message;
		if (err.name === 'SequelizeUniqueConstraintError') {
			resp = 'Sorry, This user already has an account.';
		}
		return res.status(400).json({ message: resp });
	}
};

export const login = (req, res, next) => {
	const { body: user } = req;

	if (!user.username) {
		return res.status(400)
			.json({ message: { username: 'username is required' } });
	}

	if (!user.password) {
		return res.status(400).json({ message: { password: 'password is required' } });
	}

	return passport.authenticate('local', { session: false },
		(err, passportUser, info) => {
			if (err) return res.status(400).json({ message: err });

			const userObject = passportUser;
			if (userObject) {
				userObject.token = generateJWTToken(userObject);
				return res.json({ user: toAuthJSON(userObject) });
			}
			return res.status(400).json({ message: err || info });
		})(req, res, next);
};

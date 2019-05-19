import passport from 'passport';
import LocalStrategy from 'passport-local';
import { USER_MODAL } from '../constants';
import DatabaseWrapper from '../models';
import { validatePassword } from './auth.helpers';

passport.use(new LocalStrategy({

	usernameField: 'username',
	passwordField: 'password'

}, async (username, password, next) => {
	const user = await DatabaseWrapper.findOne(
		USER_MODAL, { username }, undefined, undefined, false
	);

	if (!user) {
		return next(null, false, { user: 'username or password is invalid' });
	}

	return validatePassword(password, user.password)
		.then((isValid) => {
			if (isValid) {
				return next(null, user);
			}
			return next(null, false, { user: 'username or password is invalid.' });
		})
		.catch(error => next(null, false, { user: error }));
}));

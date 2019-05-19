import { body, param } from 'express-validator/check';

class ValidatorHelper {
	static validateContact = (value) => {
		if (!value
			|| value.match(/[^0-9 \-+\\)(]/)
			|| value.length < 10
			|| value.length > 13
		) {
			throw Error('Please input a valid phone number');
		}
		return value;
	};

	static validateCreateUser = () => [
		body('username', 'Username is required').exists(),
		body('contact').exists().custom(this.validateContact),
		body('email').optional().isEmail(),
		body('password', 'Password is required').exists(),
		body('isAdmin').optional().isBoolean()
	];

	static validateUpdateUser = () => [
		param('userId', 'The user ID provided is invalid').exists().isUUID(),
		body('username', 'Username is required').exists(),
		body('contact').exists().custom(this.validateContact),
		body('email').optional().isEmail(),
		body('password').optional(),
		body('isAdmin').optional().isBoolean()
	]
}

class UserMiddleware {
	static validate(method) {
		switch (method) {
			case 'createUser':
				return ValidatorHelper.validateCreateUser();
			case 'getUser':
				return [
					param('userId', 'The user ID provided is invalid').exists().isUUID()
				];
			case 'updateUser':
				return ValidatorHelper.validateUpdateUser();
			default:
				return [];
		}
	}
}

export default UserMiddleware;

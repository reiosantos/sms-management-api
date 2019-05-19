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

	static validateCreateSms = () => [
		body('username', 'Smsname is required').exists(),
		body('contact').exists().custom(this.validateContact),
		body('email').optional().isEmail(),
		body('password', 'Password is required').exists(),
		body('isAdmin').optional().isBoolean()
	];
}

class SmsMiddleware {
	static validate(method) {
		switch (method) {
			case 'createSms':
				return ValidatorHelper.validateCreateSms();
			case 'getSms':
				return [
					param('smsId', 'The sms ID provided is invalid').exists().isUUID()
				];
			default:
				return [];
		}
	}
}

export default SmsMiddleware;

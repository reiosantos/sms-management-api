import { body, param } from 'express-validator/check';

class ValidatorHelper {
	static validateContact = (value) => {
		if (!value
			|| value.match(/[^0-9 \-+\\)(]/)
			|| value.length < 10
			|| value.length > 13
		) {
			throw Error('A valid receiver phone number is required');
		}
		return value;
	};

	static validateCreateSms = () => [
		body('message', 'Message is required').exists(),
		body('contact').custom(this.validateContact)
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

import { Sequelize } from 'sequelize';
import { USER_MODAL } from '../constants';

const { Op } = Sequelize;

class Helpers {
	static modifyWhereClause(objectModel, where = {}) {
		const obj = {};
		if (objectModel === USER_MODAL) {
			obj.username = { [Op.ne]: 'admin' };
		} else {
			obj[`${objectModel}Name`] = { [Op.ne]: 'admin' };
		}
		return { ...where, ...obj };
	}

	static getErrorMessage(error) {
		let message = null;
		if (error.code === 11000) {
			message = error.errmsg.includes('contact')
				? 'This phone number has already been used.' : message;

			message = error.errmsg.includes('email')
				? 'This Email has already been taken' : message;
		}
		return message || error;
	}

	static async returnErrors(req, res, next) {
		const errors = await req.getValidationResult();
		if (errors.isEmpty()) {
			return next();
		}
		const responseErrors = errors.array()
			.map(error => ({
				field: error.param,
				message: error.msg
			}));
		return res.status(400).json({ errors: responseErrors });
	}
}

export default Helpers;

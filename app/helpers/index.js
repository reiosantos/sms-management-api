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
		return res.status(400)
			.json({ message: responseErrors });
	}
}

export default Helpers;

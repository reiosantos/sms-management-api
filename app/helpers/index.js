
class Helpers {
	static modifyWhereClause(objectModel, where = {}) {
		return { ...where };
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

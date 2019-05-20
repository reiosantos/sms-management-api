import { USER_MODAL } from '../constants';
import { hashPassword } from '../helpers/auth.helpers';
import DatabaseWrapper from '../models';
import { signup } from './auth';

class UserActions {
	static async getAllUsers(req, res) {
		try {
			const users = await DatabaseWrapper.findAll(USER_MODAL, {});
			return res.status(200).json({ records: users });
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	}

	static async getUser(req, res) {
		const { userId } = req.params;

		const user = await DatabaseWrapper.findOne(USER_MODAL, userId);

		return res.status(200).json({ record: user });
	}

	static createUser(req, res) {
		return signup(req, res);
	}

	static async updateUser(req, res) {
		const { userId } = req.params;
		const update = req.body;

		if (update.password && update.password.trim()) {
			update.password = await hashPassword(update.password);
		}

		try {
			const user = await DatabaseWrapper.updateOne(
				USER_MODAL, { id: userId }, update
			);

			return res.status(202).json({ record: user });
		} catch (err) {
			return res.status(400).json({ message: err.message });
		}
	}

	static async deleteUser(req, res) {
		const { userId } = req.params;

		const data = await DatabaseWrapper.deleteOne(USER_MODAL, { id: userId });

		if (data) return res.status(204).json({ message: data });

		return res.status(400).json({ message: 'Could not delete the requested record' });
	}
}

export default UserActions;

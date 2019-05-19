import models from '../../database/models';

const { User, Sms } = models;

class ModelFactory {
	/**
	 * Creates a modal of Type `name`
	 * Returns the modal matching the name or null
	 *
	 * @param name
	 * @returns Sequelize.Sequelize.Model
	 */
	static getModel = (name) => {
		if (!name) return null;
		const modelName = name.toLowerCase();

		if (modelName.match(/^users?$/)) return User;
		if (modelName.match(/^sms?$/)) return Sms;

		return null;
	};
}

export default ModelFactory;

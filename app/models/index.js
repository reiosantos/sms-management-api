import Helpers from '../helpers';
import ModelFactory from './models.factory';

class DatabaseWrapper {
	/**
	 *
	 * @param objectName { string }
	 * @param document {Object}, the object to be saved/created
	 * @returns {document}
	 */
	static async createOne(objectName, document) {
		const Modal = ModelFactory.getModel(objectName);
		const data = await Modal.create(document);

		if (data && data.dataValues) return data.dataValues;
		return data;
	}

	/**
	 *
	 * @param objectName {string}
	 * @param where {Object}
	 * @param attributes {Array}
	 * @param include {Array}
	 * @param order {Array}
	 * @param raw {boolean}
	 * @returns {*}
	 */
	static async findAll(
		objectName, where = {}, attributes = undefined,
		include = [{ all: true }], order = [], raw = false
	) {
		const Modal = ModelFactory.getModel(objectName);
		const modifiedWhere = Helpers.modifyWhereClause(objectName, where);

		const data = await Modal.findAll({
			attributes,
			where: modifiedWhere,
			raw,
			include,
			order
		});

		if (data && data.dataValues) return data.dataValues;
		return data;
	}

	/**
	 *
	 * @param objectName {string}
	 * @param where {Object || string}
	 * @param attributes {Array}
	 * @param include {Array}
	 * @param raw {boolean}
	 * @returns {*|Query|void|Promise}
	 */
	static async findOne(
		objectName, where = {}, attributes = undefined, include = [{ all: true }], raw = false
	) {
		const Modal = ModelFactory.getModel(objectName);

		let data;
		if (typeof where === 'string') {
			data = await Modal.findByPk(where, {
				include,
				attributes,
				raw
			});
		} else {
			data = await Modal.findOne({
				where,
				include,
				attributes,
				raw
			});
		}
		if (data && data.dataValues) return data.dataValues;
		return data;
	}

	/**
	 *
	 * @param objectName {string}
	 * @param update {Object} data on the record to update
	 * @param where {Object}
	 * @param attributes {Array}
	 * @param raw {boolean}
	 * @returns {Query}
	 */
	static async updateOne(
		objectName, where = {}, update, attributes = undefined, raw = false
	) {
		const data = await ModelFactory.getModel(objectName).findOne({
			where,
			attributes,
			raw
		})
			.then(modal => modal.update(update, { returning: true }))
			.catch(error => error);

		if (!data.dataValues) {
			if (data instanceof TypeError) {
				throw new Error(
					`We were unable to update this ${objectName}. Its probably due to an invalid ID`
				);
			}
			throw new Error(
				`Record could not be updated. we were unable to find the ${
					data.table || data.message
				}.`
			);
		}
		if (data && data.dataValues) return data.dataValues;
		return data;
	}

	/**
	 *
	 * @param objectName { string }
	 * @param where {Object}
	 * @returns {Query}
	 */
	static async deleteOne(objectName, where = {}) {
		const Modal = ModelFactory.getModel(objectName);
		const data = await Modal.destroy({ where });

		if (data && data.dataValues) return data.dataValues;
		return data;
	}
}

export default DatabaseWrapper;

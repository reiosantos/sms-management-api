import { Op } from 'sequelize';
import { SMS_MODAL, USER_MODAL } from '../constants';
import DatabaseWrapper from '../models';

class SmsActions {
	static async getAllSms(req, res) {
		try {
			const { id: userId } = req.userData;
			let sent = await DatabaseWrapper.findAll(SMS_MODAL, { senderId: userId });
			let received = await DatabaseWrapper.findAll(SMS_MODAL, { receiverId: userId });

			sent = sent.map((message) => {
				const data = message.dataValues;
				delete data.sender;
				delete data.senderId;
				return data;
			});

			received = received.map((message) => {
				const data = message.dataValues;
				delete data.receiver;
				delete data.receiverId;
				return data;
			});

			return res.status(200).json({ records: { sent, received } });
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	}

	static async getSms(req, res) {
		const { smsId } = req.params;
		const { id: userId } = req.userData;

		const sms = await DatabaseWrapper.findOne(SMS_MODAL, {
			id: smsId, [Op.or]: [{ senderId: userId }, { receiverId: userId }]
		});

		if (!sms) {
			return res.status(404).json({ message: 'Message Not Found' });
		}

		if (sms.sender.id === userId) {
			delete sms.sender;
			delete sms.senderId;
		}

		if (sms.receiver.id === userId) {
			delete sms.receiver;
			delete sms.receiverId;
		}

		return res.status(200).json({ record: sms });
	}

	static async createSms(req, res) {
		try {
			const { body, userData } = req;
			const { contact, message } = body;
			const receiver = await DatabaseWrapper.findOne(USER_MODAL, { contact });

			if (!receiver) {
				return res.status(404).json({ message: `Receiver '${contact}' was not found` });
			}

			const data = {
				receiverId: receiver.id,
				senderId: userData.id,
				message,
				status: 'Delivered'
			};

			const resp = await DatabaseWrapper.createOne(SMS_MODAL, data);
			return res.status(201).json({ record: resp });
		} catch (err) {
			if (err.name === 'SequelizeForeignKeyConstraintError') {
				return res.status(400).json({
					message: `Could not find the ${err.table} selected`
				});
			}
			return res.status(400).json({ message: err.message });
		}
	}

	static async deleteSms(req, res) {
		const { smsId } = req.params;
		const { id: sender } = req.userData;

		const data = await DatabaseWrapper.deleteOne(SMS_MODAL, {
			id: smsId, senderId: sender
		});

		if (data) return res.status(204).json({ message: data });

		return res.status(400).json({ message: 'Could not delete the requested record' });
	}
}

export default SmsActions;

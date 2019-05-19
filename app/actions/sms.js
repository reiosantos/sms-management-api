import { SMS_MODAL } from '../constants';
import DatabaseWrapper from '../models';

class SmsActions {
	static async getAllSms(req, res) {
		const sms = await DatabaseWrapper.findAll(SMS_MODAL, {});
		return res.status(200).json({ records: sms });
	}

	static async getSms(req, res) {
		const { smsId } = req.params;

		const sms = await DatabaseWrapper.findOne(SMS_MODAL, smsId);

		return res.status(200).json({ record: sms });
	}

	static createSms(req, res) {
		// TODO: create sms record
		// return signup(req, res);
	}

	static async deleteSms(req, res) {
		const { smsId } = req.params;

		const data = await DatabaseWrapper.deleteOne(SMS_MODAL, { id: smsId });

		if (data) return res.status(204).json({ message: data });

		return res.status(400).json({ message: 'Could not delete the requested record' });
	}
}

export default SmsActions;

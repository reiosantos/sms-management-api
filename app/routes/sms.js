import express from 'express';
import SmsActions from '../actions/sms';
import Helpers from '../helpers';
import SmsMiddleware from '../middlewares/smsMiddleware';

const smsRouter = express.Router({});

smsRouter
	.get('/sms', SmsActions.getAllSms)
	.get('/sms/:smsId',
		SmsMiddleware.validate('getSms'),
		Helpers.returnErrors,
		SmsActions.getSms)
	.post('/sms',
		SmsMiddleware.validate('createSms'),
		Helpers.returnErrors,
		SmsActions.createSms)
	.delete('/sms/:smsId',
		SmsMiddleware.validate('getSms'),
		Helpers.returnErrors,
		SmsActions.deleteSms);

export default smsRouter;

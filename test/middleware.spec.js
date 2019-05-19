import { expect } from 'chai';
import UserMiddleware from '../app/middlewares/userMiddleware';

describe('Middleware', () => {
	it('should return empty array', () => {
		const ret = UserMiddleware.validate();
		expect(ret).to.be.a('Array');
		expect(ret).to.eql([]);
	});
});

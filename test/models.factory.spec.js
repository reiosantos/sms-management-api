import { expect } from 'chai';
import ModelFactory from '../app/models/models.factory';

describe('ModelFactory', () => {
	it('should retutn null when no name is given', () => {
		const model = ModelFactory.getModel();
		expect(model).to.be.eql(null);

		const model1 = ModelFactory.getModel('unknownName');
		expect(model1).to.be.eql(null);
	});
});

'use strict';

describe('Taxes E2E Tests:', function() {
	describe('Test Taxes page', function() {
		it('Should not include new Taxes', function() {
			browser.get('http://localhost:3000/#!/taxes');
			expect(element.all(by.repeater('tax in taxes')).count()).toEqual(0);
		});
	});
});

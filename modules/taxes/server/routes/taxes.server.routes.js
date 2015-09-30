'use strict';

/**
 * Module dependencies.
 */
var taxes = require('../controllers/taxes.server.controller');
var taxesPolicy = require('../policies/taxes.server.policy');

module.exports = function(app) {
	// Taxes Routes
	app.route('/api/taxes').all()
		.get(taxes.list).all(taxesPolicy.isAllowed)
		.post(taxes.create);

	app.route('/api/taxes/:taxId').all(taxesPolicy.isAllowed)
		.get(taxes.read)
		.put(taxes.update)
		.delete(taxes.delete);

	// Finish by binding the Tax middleware
	app.param('taxId', taxes.taxByID);

	// Taxes Routes
	app.route('/api/types').all()
		.get(taxes.allTypes).all(taxesPolicy.isAllowed);	
};
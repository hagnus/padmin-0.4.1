'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Tax = mongoose.model('modTax'),
	TaxType = mongoose.model('modTaxType'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Tax
 */
exports.create = function(req, res) {
	var tax = new Tax(req.body);
	tax.user = req.user;

	tax.save(function(err) {
		if (err) {
			console.log(err);
			console.log(err.code);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tax);
		}
	});
};

/**
 * Show the current Tax
 */
exports.read = function(req, res) {
	res.jsonp(req.tax);
};

/**
 * Update a Tax
 */
exports.update = function(req, res) {
	var tax = req.tax ;

	tax = _.extend(tax , req.body);

	tax.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tax);
		}
	});
};

/**
 * Delete an Tax
 */
exports.delete = function(req, res) {
	var tax = req.tax ;

	tax.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tax);
		}
	});
};

/**
 * List of Taxes
 */
exports.list = function(req, res) { 
	var populateQuery = [{path:'user', select:'displayName'}, {path:'type', select:'_id name tag'}];

	Tax.find().sort('-created').populate(populateQuery).exec(function(err, taxes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(taxes);
		}
	});
};

/**
 * Tax middleware
 */
exports.taxByID = function(req, res, next, id) { 
	var populateQuery = [{path:'user', select:'displayName'}, {path:'type', select:'_id name tag'}];

	Tax.findById(id).populate(populateQuery).exec(function(err, tax) {
		if (err) return next(err);
		if (! tax) return next(new Error('Falha ao carregar o Imposto ' + id));
		req.tax = tax ;
		next();
	});
};


/**
 * List of TaxesType
 */
exports.allTypes = function(req, res) {
	TaxType.find().sort('name').exec(function(err, types) {
		if (err) {
			return res.status(500).json({
				error: 'Não foi possível listar os tipos de impostos'
			});
		} else {
			res.json(types);
		}
	});
};
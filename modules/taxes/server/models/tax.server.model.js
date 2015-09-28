'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tax Schema
 */
var TaxSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'O nome deve ser preenchido'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	value: {
		type: Number,
		default: 0,
		required: 'O valor do imposto deve ser preenchido' 
	},
	type: {
		type: Schema.ObjectId,
		ref: 'modTaxType'
	},	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var TaxTypeSchema = new Schema({
  	name: {
	  	type: String,
	  	trim: true
  	},
 	tag: {
	  	type: String,
	  	trim: true
  	}
});


mongoose.model('modTax', TaxSchema, 'taxes');
mongoose.model('modTaxType', TaxTypeSchema, 'taxes-type');
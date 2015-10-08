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
		required: 'O nome do imposto deve ser preenchido'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	value: {
		type: Number,
		required: 'O valor do imposto deve ser informado' 
	},
	type: {
		type: Schema.ObjectId,
		ref: 'modTaxType',
		required: 'Selecione o tipo do imposto' 
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
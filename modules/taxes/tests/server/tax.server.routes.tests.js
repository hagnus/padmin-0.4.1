'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tax = mongoose.model('Tax'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tax;

/**
 * Tax routes tests
 */
describe('Tax CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tax
		user.save(function() {
			tax = {
				name: 'Tax Name'
			};

			done();
		});
	});

	it('should be able to save Tax instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tax
				agent.post('/api/taxes')
					.send(tax)
					.expect(200)
					.end(function(taxSaveErr, taxSaveRes) {
						// Handle Tax save error
						if (taxSaveErr) done(taxSaveErr);

						// Get a list of Taxes
						agent.get('/api/taxes')
							.end(function(taxesGetErr, taxesGetRes) {
								// Handle Tax save error
								if (taxesGetErr) done(taxesGetErr);

								// Get Taxes list
								var taxes = taxesGetRes.body;

								// Set assertions
								(taxes[0].user._id).should.equal(userId);
								(taxes[0].name).should.match('Tax Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tax instance if not logged in', function(done) {
		agent.post('/api/taxes')
			.send(tax)
			.expect(403)
			.end(function(taxSaveErr, taxSaveRes) {
				// Call the assertion callback
				done(taxSaveErr);
			});
	});

	it('should not be able to save Tax instance if no name is provided', function(done) {
		// Invalidate name field
		tax.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tax
				agent.post('/api/taxes')
					.send(tax)
					.expect(400)
					.end(function(taxSaveErr, taxSaveRes) {
						// Set message assertion
						(taxSaveRes.body.message).should.match('Please fill Tax name');
						
						// Handle Tax save error
						done(taxSaveErr);
					});
			});
	});

	it('should be able to update Tax instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tax
				agent.post('/api/taxes')
					.send(tax)
					.expect(200)
					.end(function(taxSaveErr, taxSaveRes) {
						// Handle Tax save error
						if (taxSaveErr) done(taxSaveErr);

						// Update Tax name
						tax.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tax
						agent.put('/api/taxes/' + taxSaveRes.body._id)
							.send(tax)
							.expect(200)
							.end(function(taxUpdateErr, taxUpdateRes) {
								// Handle Tax update error
								if (taxUpdateErr) done(taxUpdateErr);

								// Set assertions
								(taxUpdateRes.body._id).should.equal(taxSaveRes.body._id);
								(taxUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Taxes if not signed in', function(done) {
		// Create new Tax model instance
		var taxObj = new Tax(tax);

		// Save the Tax
		taxObj.save(function() {
			// Request Taxes
			request(app).get('/api/taxes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tax if not signed in', function(done) {
		// Create new Tax model instance
		var taxObj = new Tax(tax);

		// Save the Tax
		taxObj.save(function() {
			request(app).get('/api/taxes/' + taxObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tax.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tax instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tax
				agent.post('/api/taxes')
					.send(tax)
					.expect(200)
					.end(function(taxSaveErr, taxSaveRes) {
						// Handle Tax save error
						if (taxSaveErr) done(taxSaveErr);

						// Delete existing Tax
						agent.delete('/api/taxes/' + taxSaveRes.body._id)
							.send(tax)
							.expect(200)
							.end(function(taxDeleteErr, taxDeleteRes) {
								// Handle Tax error error
								if (taxDeleteErr) done(taxDeleteErr);

								// Set assertions
								(taxDeleteRes.body._id).should.equal(taxSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tax instance if not signed in', function(done) {
		// Set Tax user 
		tax.user = user;

		// Create new Tax model instance
		var taxObj = new Tax(tax);

		// Save the Tax
		taxObj.save(function() {
			// Try deleting Tax
			request(app).delete('/api/taxes/' + taxObj._id)
			.expect(403)
			.end(function(taxDeleteErr, taxDeleteRes) {
				// Set message assertion
				(taxDeleteRes.body.message).should.match('User is not authorized');

				// Handle Tax error error
				done(taxDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tax.remove().exec();
		done();
	});
});
'use strict';

(function() {
	// Taxes Controller Spec
	describe('Taxes Controller Tests', function() {
		// Initialize global variables
		var TaxesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Taxes controller.
			TaxesController = $controller('TaxesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tax object fetched from XHR', inject(function(Taxes) {
			// Create sample Tax using the Taxes service
			var sampleTax = new Taxes({
				name: 'New Tax'
			});

			// Create a sample Taxes array that includes the new Tax
			var sampleTaxes = [sampleTax];

			// Set GET response
			$httpBackend.expectGET('api/taxes').respond(sampleTaxes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.taxes).toEqualData(sampleTaxes);
		}));

		it('$scope.findOne() should create an array with one Tax object fetched from XHR using a taxId URL parameter', inject(function(Taxes) {
			// Define a sample Tax object
			var sampleTax = new Taxes({
				name: 'New Tax'
			});

			// Set the URL parameter
			$stateParams.taxId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/taxes\/([0-9a-fA-F]{24})$/).respond(sampleTax);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tax).toEqualData(sampleTax);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Taxes) {
			// Create a sample Tax object
			var sampleTaxPostData = new Taxes({
				name: 'New Tax'
			});

			// Create a sample Tax response
			var sampleTaxResponse = new Taxes({
				_id: '525cf20451979dea2c000001',
				name: 'New Tax'
			});

			// Fixture mock form input values
			scope.name = 'New Tax';

			// Set POST response
			$httpBackend.expectPOST('api/taxes', sampleTaxPostData).respond(sampleTaxResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tax was created
			expect($location.path()).toBe('/taxes/' + sampleTaxResponse._id);
		}));

		it('$scope.update() should update a valid Tax', inject(function(Taxes) {
			// Define a sample Tax put data
			var sampleTaxPutData = new Taxes({
				_id: '525cf20451979dea2c000001',
				name: 'New Tax'
			});

			// Mock Tax in scope
			scope.tax = sampleTaxPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/taxes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/taxes/' + sampleTaxPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid taxId and remove the Tax from the scope', inject(function(Taxes) {
			// Create new Tax object
			var sampleTax = new Taxes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Taxes array and include the Tax
			scope.taxes = [sampleTax];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/taxes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTax);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.taxes.length).toBe(0);
		}));
	});
}());
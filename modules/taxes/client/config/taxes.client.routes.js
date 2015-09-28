'use strict';

//Setting up route
angular.module('taxes').config(['$stateProvider',
	function($stateProvider) {
		// Taxes state routing
		$stateProvider.
		state('taxes', {
			abstract: true,
			url: '/taxes',
			template: '<ui-view/>'
		}).
		state('taxes.list', {
			url: '',
			templateUrl: 'modules/taxes/views/list-taxes.client.view.html'
		}).
		state('taxes.create', {
			url: '/create',
			templateUrl: 'modules/taxes/views/create-tax.client.view.html'
		}).
		state('taxes.view', {
			url: '/:taxId',
			templateUrl: 'modules/taxes/views/view-tax.client.view.html'
		}).
		state('taxes.edit', {
			url: '/:taxId/edit',
			templateUrl: 'modules/taxes/views/edit-tax.client.view.html'
		});
	}
]);
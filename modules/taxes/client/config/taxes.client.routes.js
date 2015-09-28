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
			templateUrl: 'modules/taxes/client/views/list-taxes.client.view.html'
		}).
		state('taxes.create', {
			url: '/create',
			templateUrl: 'modules/taxes/client/views/create-tax.client.view.html'
		}).
		state('taxes.view', {
			url: '/:taxId',
			templateUrl: 'modules/taxes/client/views/view-tax.client.view.html'
		}).
		state('taxes.edit', {
			url: '/:taxId/edit',
			templateUrl: 'modules/taxes/client/views/edit-tax.client.view.html'
		});
	}
]);
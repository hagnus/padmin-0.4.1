'use strict';

// Configuring the Taxes module
angular.module('taxes').run(['Menus',
	function(Menus) {
		// Add the Taxes dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Taxes',
			state: 'taxes',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'taxes', {
			title: 'List Taxes',
			state: 'taxes.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'taxes', {
			title: 'Create Tax',
			state: 'taxes.create'
		});
	}
]);
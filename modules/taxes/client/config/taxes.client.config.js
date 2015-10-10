'use strict';

// Configuring the Taxes module
angular.module('taxes').run(['Menus',
	function(Menus) {
		// Add the Taxes dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Impostos',
			state: 'taxes.list'
		});
	}
]);
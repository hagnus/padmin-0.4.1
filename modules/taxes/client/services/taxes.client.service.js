'use strict';

//Taxes service used to communicate Taxes REST endpoints
angular.module('taxes')

.factory('Taxes', ['$resource',
	function($resource) {
		return $resource('api/taxes/:taxId', { taxId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('TaxTypes', ['$resource',
	function($resource) {
		return $resource('api/types/:typeId', { typeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
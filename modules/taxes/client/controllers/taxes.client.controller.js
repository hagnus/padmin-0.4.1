'use strict';

angular.module('taxes').directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue);
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}]);

// Taxes controller
angular.module('taxes').controller('TaxesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Taxes', 'TaxTypes',
	function($scope, $stateParams, $location, Authentication, Taxes, TaxTypes ) {
		$scope.authentication = Authentication;

	    $scope.pagingOptions = {
	        pageSizes: [10, 25, 50],
	        pageSize: 25,
	        currentPage: 1,
	        maxSize: 5
	    };
		$scope.filterOptions = {
	        filterText: '',
	        useExternalFilter: false
	    }; 

	    $scope.totalServerItems = 0;

	    $scope.setPagingData = function(data, page, pageSize){	
	        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);

	        $scope.taxes = pagedData;
	        $scope.totalServerItems = data.length;
	        $scope.pagingOptions.pageSize = pageSize;

	        if (!$scope.$$phase) {
	            $scope.$apply();
	        }
	    };

	    $scope.findAsync = function (pageSize, page, searchText) {
	        setTimeout(function () {
	            var data;
	            if (searchText) {
	                var ft = searchText.toLowerCase();

					Taxes.query().$promise.then(function (largeLoad) {		

	                    data = largeLoad.filter(function(item) {
	                        return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
	                    });

	                    $scope.setPagingData(data,page,pageSize);
					});

	            } else {
	            	Taxes.query().$promise.then(function (largeLoad) {
	            		$scope.setPagingData(largeLoad,page,pageSize);
	            	});
	            }
	        }, 100);
	    };	    

	    $scope.$watch('pagingOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal && 
	        	(newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
	          $scope.findAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	        }
	    }, true);

	    $scope.$watch('filterOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal) {
	          $scope.findAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	        }
	    }, true);		

		// Create new Tax
		$scope.create = function() {
			// Create new Tax object
			var tax = new Taxes ({
				name: $scope.name,
				type: $scope.selectedType._id,
				value: $scope.value,
				description: $scope.description	
			});

			// Redirect after save
			tax.$save(function(response) {
				$location.path('taxes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tax
		$scope.remove = function( tax ) {
			if ( tax ) { tax.$remove();

				for (var i in $scope.taxes ) {
					if ($scope.taxes [i] === tax ) {
						$scope.taxes.splice(i, 1);
					}
				}
			} else {
				$scope.tax.$remove(function() {
					$location.path('taxes');
				});
			}
		};

		// Update existing Tax
		$scope.update = function() {
			var tax = $scope.tax;
			//tax.type = $scope.selectedType._id;

			tax.$update(function() {
				$location.path('taxes');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Taxes
		$scope.find = function() {
			$scope.taxes = Taxes.query();
		};

		// Find existing Tax
		$scope.findOne = function() {
			$scope.tax = Taxes.get({ 
				taxId: $stateParams.taxId
			});

	        $scope.types = TaxTypes.query();				
		};

	    $scope.findTypes = function() {
	        $scope.types = TaxTypes.query();
	    }; 		
	}
]);
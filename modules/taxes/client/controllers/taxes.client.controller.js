'use strict';

// Taxes controller
angular.module('taxes').controller('TaxesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Taxes', 'TaxTypes',
	function($scope, $stateParams, $location, Authentication, Taxes, TaxTypes ) {
		$scope.authentication = Authentication;	

		$scope.selectedType = {};

	    $scope.pagingOptions = {
	        pageSizes: [10, 25, 50],
	        pageSize: 25,
	        currentPage: 1,
	        maxSize: 5
	    };

	    $scope.totalServerItems = 0;

		$scope.filterOptions = {
	        filterText: '',
	        name: '',
	        value: '',
	        type: '',
	        useExternalFilter: false
	    };

	    $scope.clearFilter = function() {
			$scope.filterOptions = {
		        filterText: '',
		        name: '',
		        value: '',
		        type: '',
		        useExternalFilter: false
		    };	    	
	    };

	    $scope.setPagingData = function(data, page, pageSize){	
	        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);

	        $scope.taxes = pagedData;
	        $scope.totalServerItems = data.length;
	        $scope.pagingOptions.pageSize = pageSize;

	        if (!$scope.$$phase) {
	            $scope.$apply();
	        }
	    };

	    $scope.findAsync = function (pageSize, page, searchObject) {
	        setTimeout(function () {
	            var data;
	            if (searchObject) {
	                var ftName  = searchObject.name.toLowerCase();
	                var ftType  = searchObject.type.toLowerCase();
	                var ftValue = searchObject.value.toLowerCase();
	                var ftAll   = searchObject.filterText.toLowerCase();

					Taxes.query().$promise.then(function (largeLoad) {		

	                    data = largeLoad.filter(function(item) {
	                    	var found = (JSON.stringify(item.name).toLowerCase().indexOf(ftName) !== -1 ) &&
	                    				(JSON.stringify(item.type).toLowerCase().indexOf(ftType) !== -1 ) &&
	                    				(JSON.stringify(item.value).toLowerCase().indexOf(ftValue) !== -1 ) &&
	                    				((JSON.stringify(item.name).toLowerCase().indexOf(ftAll) !== -1 ) ||
	                    				 (JSON.stringify(item.value).toLowerCase().indexOf(ftAll) !== -1 ) ||
	                    				 (JSON.stringify(item.type).toLowerCase().indexOf(ftAll) !== -1 ));
	                        return found;
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
	          $scope.findAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
	        }
	    }, true);

	    $scope.$watch('filterOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal) {
	          $scope.findAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
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
				$location.path('taxes');

				clearFields();
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

			tax.$update(function(response) {
				$location.path('taxes');
				
				clearFields();
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

	    $scope.cancel = function() {
	        $location.path('taxes');
	        clearFields();
	    };

	    var clearFields = function() {
			$scope.name = '';
			$scope.value = '';
			$scope.description = '';
			$scope.selectedType = {};
	    };
	}
]);
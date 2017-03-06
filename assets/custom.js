var app = angular.module('nodejs_test', []);

app.controller('MainController', function($scope, MainService){
	$scope.isDepartmentsShown = true;
	$scope.isEmployeesShown = false;

	$scope.showDepartments = function(){
		$scope.isDepartmentsShown = true;
		$scope.isEmployeesShown = false;
	};
	$scope.showEmployees = function(){
		$scope.isDepartmentsShown = false;
		$scope.isEmployeesShown = true;
	};

	$scope.departments = [];
	$scope.loadDepartments = function(){
		MainService.loadDepartments(function(data){
			$scope.departments = data;
			$scope.$parent.departments = data;
		});
	};
	$scope.loadDepartments();
});
app.controller('DepartmentsController', function($scope, MainService){
	$scope.modal = {
		id: '',
		name: ''
	};
	$scope.fillModal = function(id){
		$scope.$apply(function(){
			$scope.modal = {
				id: '',
				name: ''
			};
		});
		$scope.$parent.departments.forEach(function(item){
			if(item.id == id){
				$scope.$apply(function(){
					$scope.modal.id = item.id;
					$scope.modal.name = item.name;
				});
				return false;
			}
		});
	};
	$scope.update = function(){
		if(!$scope.modal.id){
			$scope.add();
		}
		else{
			MainService.updateDepartment($scope.modal.id, $scope.modal.name, $scope.$parent.loadDepartments);
		}
		$scope.$broadcast('resData');
	};
	$scope.add = function(){
		MainService.addDepartment($scope.modal.name, $scope.$parent.loadDepartments);
	};
	$scope.remove = function(id){
		$scope.$parent.departments.forEach(function(item){
			if(item.id == id){
				if(confirm(['Remove', item.name.toString() + '?'].join(' '))){
					MainService.removeDepartment(id, $scope.$parent.loadDepartments);
				}
				return false;
			}
		});
	};
});
app.controller('EmployeesController', function($scope, MainService){
	$scope.employees = [];
	$scope.modal = {
		id: '',
		firstName: '',
		lastName: '',
		department: {
			id: '',
			value: ''
		}
	};
	$scope.loadEmployees = function(){
		MainService.loadEmployees(function(data){
			$scope.employees = data;
		});
	};
	$scope.fillModal = function(id){
		$scope.$apply(function(){
			$scope.modal = {
				id: '',
				firstName: '',
				lastName: '',
				department: {
					id: '',
					value: ''
				}
			};
		});
		$scope.employees.forEach(function(item){
			if(item.id == id){
				$scope.$apply(function(){
					$scope.modal.id = item.id;
					$scope.modal.firstName = item.firstName;
					$scope.modal.lastName = item.lastName;
					$scope.modal.department = {
						id: item.department._id,
						value: item.department.name
					};
				});
				return false;
			}
		});
	};
	$scope.update = function(){
		if(!$scope.modal.id){
			$scope.add();
		}
		else{
			MainService.updateEmployee($scope.modal.id, $scope.modal.firstName, $scope.modal.lastName, $scope.modal.department.id, $scope.loadEmployees);
		}
		$scope.$broadcast('resData');
	};
	$scope.add = function(){
		MainService.addEmployee($scope.modal.firstName, $scope.modal.lastName, $scope.modal.department.id, $scope.loadEmployees);
	};
	$scope.remove = function(id){
		$scope.employees.forEach(function(item){
			if(item.id == id){
				if(confirm(['Remove', item.firstName, item.lastName + '?'].join(' '))){
					MainService.removeEmployee(id, $scope.loadEmployees);
				}
				return false;
			}
		});
	};

	$scope.loadEmployees();
});
app.service('MainService', function($http){
	return {
		loadDepartments: function(callback){
			return $http.get('/api/department').then(function(response){
				return callback(response.data);
			});
		},
		loadEmployees: function(callback){
			return $http.get('/api/employee').then(function(response){
				return callback(response.data);
			});
		},
		updateDepartment: function(id, name, success){
			$http.post('/api/department', {
				id: id,
				name: name
			}).then(function(response){
				console.log(response);
				if(response.data.result === true){
					success();
				}
				else{
					alert('Remove error!');
				}
			});
		},
		updateEmployee: function(id, firstName, lastName, department, success){
			$http.post('/api/employee', {
				id: id,
				firstName: firstName,
				lastName: lastName,
				department: department
			}).then(function(response){
				console.log(response);
				if(response.data.result === true){
					success();
				}
				else{
					alert('Remove error!');
				}
			});
		},
		addDepartment: function(name, success){
			$http.post('/api/department', {
				name: name
			}).then(function(response){
				console.log(response);
				if(response.data.result === true){
					success();
				}
				else{
					alert('Remove error!');
				}
			});
		},
		addEmployee: function(firstName, lastName, department, success){
			$http.post('/api/employee', {
				firstName: firstName,
				lastName: lastName,
				department: department
			}).then(function(response){
				console.log(response);
				if(response.data.result === true){
					success();
				}
				else{
					alert('Remove error!');
				}
			});
		},
		removeDepartment: function(id, success){
			$http.post('/api/removeDepartment', {
				id: id
			}).then(function(response){
				if(response.data.result === true){
					success();
				}
				else{
					alert('Remove error!');
				}
			});	
		},
		removeEmployee: function(id, success){
			$http.post('/api/removeEmployee', {
				id: id
			}).then(function(response){
				if(response.data.result === true){
					success();
				}
				else{
					alert('Remove error!');
				}
			});	
		}
	};
});
app.directive('openModal', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var $element = angular.element(element);
			$element.on('click', function(){
				var id = $element.closest('tr').attr('data-id');
				scope.fillModal(id);
				angular.element(attrs.openModal).modal('show');
			});

			scope.$on('resData', function(e, data){
				angular.element('.modal').modal('hide');
			});
		}
	};
});

var myapp = angular.module('ccApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';

	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
	};
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

/*
//used for basic read from json
app.factory('postService', function($http){
	var baseUrl = "/api/Orders";
	var factory = {};
	factory.getAll = function(){
		return $http.get(baseUrl);
	};
	return factory;
});
*/
app.factory('orderService', function($resource){
	return $resource('/api/orders/:id');
});

app.controller('mainController', function($scope, $rootScope, postService){
	$scope.orders = postService.query();
	$scope.newOrder = {created_by: '', cupcakeFlavor: '', created_at: ''};
/*
//used for basic read from json
	postService.getAll().success(function(data){
		$scope.posts = data;
	});
*/
	$scope.order = function() {
		$scope.newOrder.created_by = $rootScope.current_user;
		$scope.newOrder.created_at = Date.now();
		orderService.save($scope.newOrder), function(){
			$scope.orders = orderService.query();
			$scope.newOrder = {created_by: '', cupcakeFlavor: '', created_at: ''};
		});
	};
	$scope.delete = function(post)	{
		postService.delete({id: order._id});
		$scope.posts = postService.query();
	};
});
app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

angular.module('playground')
.controller('DashController', [
	'$scope', '$location', '$timeout', 'authService', 'patternService', 'staticFactory', 'utilsFactory',
	function($scope, $location, $timeout, authService, patternService, staticFactory, utilsFactory) {

	// vars and utils
	// -------------------------------------------------------------------------------------------

	// load patterns data and init callback
	var getPatternsData = function(callback){
		if ($scope.patterns == undefined) {
			var promise = patternService.getPatterns();
			if (callback) {
				promise.then(function(result){
					callback(result.data);
				}, function(){
					console.log('[dash.getPatternsData]: ', 'Failed loading patterns data.');
				});
			} else {
				return promise;
			}
		} else {
			if (callback) {
				callback($scope.patterns);
			} else {
				return $scope.patterns;
			}
		}
	};

	// view model
	// -------------------------------------------------------------------------------------------

	//get patterns data
	getPatternsData(function(data){
		$scope.patterns = data;
	});

	//check if pattern is newly created/updated
	$scope.isNewPattern = function(time){
		return utilsFactory.getDisplayTime(time) == 'Today'
			? true
			: false;
	};

	//check if pattern is visible to current visitor
	$scope.isPatternVisible = function(pattern){
		var visible = false;
		//pattern is visible if isPublic or created by pattern.author
		if (pattern.isPublic || pattern.author == $scope.user.name) {
			visible = true;
		}
		return visible;
	}

	// view methods
	// -------------------------------------------------------------------------------------------

	//create new pattern
	$scope.newPattern = function(){
		//get patterns data
		getPatternsData(onPatternsData);

		//handlers
		function onPatternsData(data){
			//vars
			var patternsData = data;
			var newPatternID = utilsFactory.generateUID();

			//make sure new pattern id is unique
			while (patternsData[newPatternID] != undefined) {
				newPatternID = utilsFactory.generateUID();
			}

			//prep duplicate pattern data obj
			var newPatternObj = $.extend( {}, staticFactory.tmplNewPattern );
			newPatternObj.id = newPatternID;
			newPatternObj.lastupdate = new Date().getTime();
			if ($scope.user && $scope.user.name) {
				newPatternObj.author = $scope.user.name;
				newPatternObj.isPublic = false;
			}

			//save duplicate pattern data and route to new location
			var request = patternService.putPattern(newPatternID, newPatternObj);
			request.then(function(){
				$scope.patterns[newPatternID] = newPatternObj;
				$location.path( '/pattern/' + newPatternID );
				console.log('[dash.newPattern]: Added new pattern ' + newPatternID + ' to cloud!');
			}, function(){
				console.log('[dash.newPattern]: Failed adding new pattern ' + newPatternID + ' to cloud!');
				alert('Failed adding new pattern, try again!');
			});
		}
	};

	//copy target pattern
	$scope.copyPattern = function(id){
		//get patterns data
		getPatternsData(onPatternsData);

		//handlers
		function onPatternsData(data){
			//vars
			var patternsData = data;
			var targetPatternID = id;
			var newPatternID = utilsFactory.generateUID();

			//exit
			if (patternsData[targetPatternID] == undefined) {
				console.log('[dash.copyPattern]: ', 'targetPatternID does not exist!');
				return false;
			}

			//make sure new pattern id is unique
			while (patternsData[newPatternID] != undefined) {
				newPatternID = utilsFactory.generateUID();
			}

			//prep duplicate pattern data obj
			var newPatternObj = $.extend( {}, patternsData[targetPatternID]);
			newPatternObj.id = newPatternID;
			newPatternObj.title = 'Copy of ' + newPatternObj.title;
			newPatternObj.lastupdate = new Date().getTime();
			if ($scope.user && $scope.user.name) {
				newPatternObj.author = $scope.user.name;
				newPatternObj.isPublic = false;
			}

			//save duplicate pattern data and route to new location
			var request = patternService.putPattern(newPatternID, newPatternObj);
			request.then(function(){
				$scope.patterns[newPatternID] = newPatternObj;
				$location.path( '/pattern/' + newPatternID );
				console.log('[dash.copyPattern]: ', targetPatternID + ' copied to ' + newPatternID + ' in cloud!');
			}, function(){
				console.log('[dash.copyPattern]: ', targetPatternID + ' failed copying to ' + newPatternID + ' in cloud!');
				alert('Failed duplicating pattern, try again!');
			});
		}
	};

	//delete target pattern
	$scope.deletePattern = function(id){
		//get patterns data
		getPatternsData(onPatternsData);

		//handlers
		function onPatternsData(data){
			//vars
			var patternsData = data;
			var targetPatternID = id;

			//exit
			if (patternsData[targetPatternID] == undefined) {
				console.log('[dash.deletePattern]: ', 'targetPatternID does not exist!');
				return false;
			}

			//remove target pattern obj
			var request = patternService.deletePattern(targetPatternID);
			request.then(function(){
				delete $scope.patterns[targetPatternID];
				console.log('[dash.deletePattern]: ', targetPatternID + ' deleted in cloud!');
			}, function(){
				console.log('[dash.deletePattern]: ', targetPatternID + ' failed deleting in cloud!');
				alert('Failed removing pattern, try again!');
			});
		}
	};

	// auth methods
	// -------------------------------------------------------------------------------------------

	// login
	$scope.login = function(provider){
		authService.login(provider);
	}
	// logout
	$scope.logout = function(){
		authService.logout();
	}
	// updateUserData
	$scope.updateUserData = function(){
		if (authService.authData == null) {
			console.log("[dash.updateUserData]: Update user info to null");
			$scope.user = {
				id: undefined,
				name: undefined,
				picture: undefined
			};
		} else {
			console.log("[dash.updateUserData]: Update to logged-in user info");
			var userdata = authService.authData[authService.authData.provider];
			//use $timeout to defer and invoke function with $apply block
			//without causing an '$digest already in progress' error
			$timeout(function(){
				$scope.user = {
					id: authService.authData.uid,
					name: userdata.displayName,
					picture: userdata.cachedUserProfile.picture
				};
			});
		}
	}

	// onAuth handler
	authService.ref.onAuth(function(authData){
		$scope.updateUserData();
	});
}]);

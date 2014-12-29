angular.module('playground')
.controller('DashController', [
	'$scope', '$location', 'patternService', 'staticFactory', 'utilsFactory',
	function($scope, $location, patternService, staticFactory, utilsFactory) {

	// utils
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

			//save duplicate pattern data and route to new location
			var request = patternService.putPattern(newPatternID, newPatternObj);
			request.then(function(){
				$scope.patterns[newPatternID] = newPatternObj;
				$location.path( '/pattern/' + newPatternID );
				console.log('[dash.newPattern]: added new pattern ' + newPatternID + ' in cloud!');
			}, function(){

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
				console.log('[patternService.onPatternsData]: ', 'targetPatternID does not exist!');
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

			//save duplicate pattern data and route to new location
			var request = patternService.putPattern(newPatternID, newPatternObj);
			request.then(function(){
				$scope.patterns[newPatternID] = newPatternObj;
				$location.path( '/pattern/' + newPatternID );
				console.log('[dash.copyPattern]: ', targetPatternID + ' copied to ' + newPatternID + ' in cloud!');
			}, function(){

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
				console.log('[patternService.onPatternsData]: ', 'targetPatternID does not exist!');
				return false;
			}

			//remove target pattern obj
			var request = patternService.deletePattern(targetPatternID);
			request.then(function(){
				delete $scope.patterns[targetPatternID];
				console.log('[dash.deletePattern]: ', targetPatternID + ' deleted in cloud!');
			}, function(){

			});
		}
	};

}]);

angular.module('playground')
.controller('DashController', [
	'$scope', '$location', 'patternService', 'staticFactory', 'utilsFactory',
	function($scope, $location, patternService, staticFactory, utilsFactory) {

	// view methods
	// -------------------------------------------------------------------------------------------

	//copy target pattern
	$scope.copyPattern = function(id){
		//get patterns data
		var patternsDataPromise = patternService.getPatterns();
		patternsDataPromise.then(function(result){
			onPatternsData(result);
		}, function(){
			console.log('[patternService.getPatterns]: ', 'Failed loading pattern data.');
			alert('Failed loading patterns data, try again!');
		});

		//handlers
		function onPatternsData(result){
			//vars
			var patternsData = result.data;
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
				$location.path( '/pattern/' + newPatternID );
				console.log('[dash.copyPattern]: ', targetPatternID + ' copied to ' + newPatternID + ' in cloud!');
			}, function(){

			});
		}
	};

	//delete target pattern
	$scope.deletePattern = function(id){
		//get patterns data
		var patternsDataPromise = patternService.getPatterns();
		patternsDataPromise.then(function(result){
			onPatternsData(result);
		}, function(){
			console.log('[patternService.getPatterns]: ', 'Failed loading pattern data.');
			alert('Failed loading patterns data, try again!');
		});

		//handlers
		function onPatternsData(result){
			//vars
			var patternsData = result.data;
			var targetPatternID = id;

			//exit
			if (patternsData[targetPatternID] == undefined) {
				console.log('[patternService.onPatternsData]: ', 'targetPatternID does not exist!');
				return false;
			}

			//remove target pattern obj
			var request = patternService.deletePattern(targetPatternID);
			request.then(function(){
				console.log('[dash.deletePattern]: ', targetPatternID + ' deleted in cloud!');
			}, function(){

			});
		}
	};

}]);

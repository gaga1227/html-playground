angular.module('playground')

// convert object to array
.filter('objToArr', [function(){
	return function(obj) {
		var arr = [];
		for(key in obj){
			arr.push(obj[key]);
		}
		return arr;
	}
}])

// convert time number to display string
.filter('toDisplayTime', ['utilsFactory', function(utilsFactory){
	return function(input) {
		var output = utilsFactory.getDisplayTime(input);
		return output;
	}
}]);



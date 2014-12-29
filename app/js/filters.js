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
}]);



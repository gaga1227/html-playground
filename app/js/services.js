angular.module('playground')

// static factory
.factory('staticFactory', [function(){
	var statics = {
		webServiceURL: 'https://patternplayground.firebaseio.com/',
		patternsPath: 'patterns/',
		reposPath: 'repos',
		suffix: '.json'
	};
	return statics;
}])

// repo service
// -------------------------------------------------------------------------------------------
.service('repoService', [function() {

}])

// pattern service
// -------------------------------------------------------------------------------------------
.service('patternService', ['staticFactory', '$http', function(staticFactory, $http) {
	this.getPattern = function(id) {
		var s = staticFactory;
		return $http.get(s.webServiceURL + s.patternsPath + id + s.suffix);
	};
	this.putPattern = function(id) {
	};
}]);

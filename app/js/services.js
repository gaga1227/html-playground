angular.module('playground')

// static factory
.factory('staticFactory', [function(){
	var statics = {
		//pattern service
		webServiceURL: 'https://patternplayground.firebaseio.com/',
		patternsPath: 'patterns',
		reposPath: 'repos',
		suffix: '.json',

		//HTML beautify params
		styleHtmlOptions : {
			indent_char : '\t',
			indent_size : 1,
			max_char : 0
		}
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
		return $http.get(s.webServiceURL + s.patternsPath + '/' + id + s.suffix);
	};
	this.putPattern = function(id, patternObj) {
		var s = staticFactory;
		var data = {};
		data[id] = patternObj;
		return $http.put(s.webServiceURL + s.patternsPath + s.suffix, data);
	};
}]);

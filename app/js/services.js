angular.module('playground')

// static factory
.factory('staticFactory', [function(){
	var statics = {
		//pattern service
		webServiceURL: 'https://patternplayground.firebaseio.com/',
		patternsPath: 'patterns',
		reposPath: 'repos',
		suffix: '.json',

		//ace editor options
		editorOptions: {
			// maxLines: 'Infinity',
			vScrollBarAlwaysVisible: true,
			showInvisibles: true,
			fontSize: '16px'
		},

		//HTML beautify/minify params
		beautifyHtmlOptions : {
			indent_char : '\t',
			indent_size : 1,
			max_char : 0
		},
		minifyHtmlOptions : {
			removeCDATASectionsFromCDATA: true,
			collapseWhitespace : true,
			// conservativeCollapse : true,
			collapseBooleanAttributes : true,
			removeIgnored : true
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

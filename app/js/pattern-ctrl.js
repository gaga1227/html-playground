angular.module('playground')
.controller('PatternController', ['$scope', '$sce', 'patternService', function($scope, $sce, patternService) {

	// ace editor init and config
	// -------------------------------------------------------------------------------------------

	// on load
	$scope.aceLoaded = function(_editor) {
		//options
		_editor.setOptions({
			// maxLines: 'Infinity',
			vScrollBarAlwaysVisible: true,
			showInvisibles: true,
			fontSize: '16px'
		});

		//configure session
		_editor.getSession()
			.setUseSoftTabs(false);

		//pass ref to scope
		$scope.editor = _editor;
	};
	// on change
	$scope.aceChanged = function(e) {
		// console.log(e);
	};

	// view model data
	// -------------------------------------------------------------------------------------------

	// repo data
	$scope.repo = {
		"id": "BS331",
		"name": "Bootstrap 3.3.1",
		"path": "repo/bs/",
		"css": [
			{ "path": "css/", "filename": "bootstrap" },
			{ "path": "css/", "filename": "bootstrap-theme" }
		]
	};

	// Load pattern data
	patternService.getPattern('BS-001')
		.then(function(result){
			onPatternData(result.data);
		},
		function(){

		});


	// handler - onPatternData
	function onPatternData(data){
		//set scope data
		$scope.pattern = data;

		// inputs
		// -------------------------------------------------------------------------------------------

		//beautify stored html before display
		var style_html_options = {
			indent_char : '\t',
			indent_size : 1,
			max_char : 0
		};
		$scope.pattern.input = style_html($scope.pattern.html, style_html_options);

		// display
		// -------------------------------------------------------------------------------------------

		//common vars
		var $frame = $('#app-pattern-display');
		var $frameHead = $frame.contents().find('head');
		var $frameBody = $frame.contents().find('body');

		//generate repo file
		var getRepoFile = function(file, ext) {
			var url = $scope.repo.path + file.path + file.filename + '.' + ext;
			var $file;
			if (ext == 'css') {
				$file = $('<link>');
				$file.attr({
					"rel" : "stylesheet",
					"href" : url
				});
			}
			else if (ext == 'js') {
				$file = $('<script></script>');
				$file.attr({
					"src" : url
				});
			}
			return $file;
		}

		//inject repo css dependencies
		$.each($scope.repo.css, function(idx, ele){
			$frameHead.append( getRepoFile(ele, 'css') );
		});

		//watch input value and translate to display
		var cancelPatternInputWatch = $scope.$watch('pattern.input', function(){
			//inject to iframe
			$frameBody.html($scope.pattern.input);
		});

		//clean up watch
		$scope.$on('destroy', function(e){
			cancelPatternInputWatch();
		});
	}

}]);

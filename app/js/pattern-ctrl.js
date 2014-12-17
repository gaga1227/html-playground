angular.module('playground')
.controller('PatternController', [
	'$scope', '$sce', 'patternService', 'staticFactory', 'utilsFactory',
	function($scope, $sce, patternService, staticFactory, utilsFactory) {

	// vars and utils
	// -------------------------------------------------------------------------------------------

	// check if editor's html is updated compared to saved html in model
	var isHtmlUpdated = function(){
		var isUpdated = ($scope.pattern.html == minify($scope.input, staticFactory.minifyHtmlOptions))
			? false
			: true;
		return isUpdated;
	};

	// ace editor init and config
	// -------------------------------------------------------------------------------------------

	// on load
	$scope.aceLoaded = function(_editor) {
		//options
		_editor.setOptions(staticFactory.editorOptions);

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

	//UI mode
	$scope.settingsActive = utilsFactory.settingsActive;

	//input data for editor
	$scope.input = '';

	// repo
	$scope.repo = {
		"id": "BS331",
		"name": "Bootstrap 3.3.1",
		"path": "repo/bs/",
		"css": [
			{ "path": "css/", "filename": "bootstrap" },
			{ "path": "css/", "filename": "bootstrap-theme" }
		]
	};

	// view methods
	// -------------------------------------------------------------------------------------------

	//save to cloud
	$scope.save = function(){
		//validation
		if (!$scope.pattern.title) {
			console.log('[pattern.save]: ', 'Pattern title is empty, exit.');
			alert('Pattern title cannot be empty!');
			return false;
		}

		//exit
		if (!isHtmlUpdated() && !utilsFactory.isInputUpdated($scope.patternInfoForm.patternTitle)) {
			console.log('[pattern.save]: ', 'No updates to input, exit.');
			return false;
		}

		//prep time data
		$scope.pattern.lastupdate = !isNaN($scope.pattern.lastupdate) ? $scope.pattern.lastupdate : 0;
		$scope.pattern.lastupdate = Math.max($scope.pattern.lastupdate, new Date().getTime());
		$scope.sincelastupdate = utilsFactory.getDisplayTimePeriod($scope.pattern.lastupdate);

		//prep html data
		$scope.input = style_html($scope.input, staticFactory.beautifyHtmlOptions);
		$scope.pattern.html = minify($scope.input, staticFactory.minifyHtmlOptions);

		//call pattern service
		var request = patternService.putPattern($scope.pattern.id, $scope.pattern);
		request.then(function(){
			//reset pattern title input
			utilsFactory.resetInput($scope.patternInfoForm, 'patternTitle');

			console.log('[pattern.save]: ', 'updates saved in cloud!');
			alert('Pattern Updates Saved!');
		}, function(){

		});
	};

	//revert to last saved version
	$scope.revert = function(){
		//exit
		if (!isHtmlUpdated()) {
			console.log('[pattern.revert]: ', 'No updates to input, exit.');
			return false;
		}

		//revert input valur to stored model value
		$scope.input = style_html($scope.pattern.html, staticFactory.beautifyHtmlOptions);

		console.log('[pattern.revert]: ', 'reverted back to stored html value.');
	};

	//toggle settings
	$scope.toggleSettings = function(){
		//trigger UI update
		utilsFactory.toggleSettings();

		//update mode data
		$scope.settingsActive = utilsFactory.settingsActive;

		//if has ace editor
		if ($scope.editor) {
			$('.app-pattern').one(staticFactory.events.transitionEnd, function(){
				$scope.editor.resize();
			});
		}
	}

	//convert time to display msg
	$scope.getTimeDisplayMsg = function(time){
		return utilsFactory.getDisplayTime(time);
	}

	// display pattern data
	// -------------------------------------------------------------------------------------------

	//load pattern data
	patternService.getPattern('BS-001')
		.then(function(result){
			onPatternData(result.data);
		},
		function(){

		});

	// load pattern data handler
	function onPatternData(data){
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
		$frameHead.empty();
		$.each($scope.repo.css, function(idx, ele){
			$frameHead.append( getRepoFile(ele, 'css') );
		});

		//set scope data from result data
		$scope.pattern = data;

		//prep time data
		$scope.sincelastupdate = utilsFactory.getDisplayTimePeriod($scope.pattern.lastupdate);

		//prep input data for editor
		$scope.input = style_html($scope.pattern.html, staticFactory.beautifyHtmlOptions);

		//watch input value and inject to display
		var cancelPatternInputWatch = $scope.$watch('input', function(){
			//inject to iframe
			$frameBody.html($scope.input);
		});

		//clean up watch
		$scope.$on('destroy', function(e){
			cancelPatternInputWatch();
		});
	}

}]);

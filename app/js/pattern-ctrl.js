angular.module('playground')
.controller('PatternController', [
	'$scope', '$sce', '$q', 'patternService', 'repoService', 'staticFactory', 'utilsFactory',
	function($scope, $sce, $q, patternService, repoService, staticFactory, utilsFactory) {

	// vars and utils
	// -------------------------------------------------------------------------------------------

	// check if editor's html is updated compared to saved html in model
	var isHtmlUpdated = function(){
		//input syntax error handling
		try {
			minify($scope.input, staticFactory.minifyHtmlOptions);
		} catch(e) {
			//if getting parse errors
			if (e.indexOf('Parse Error') != -1) {
				console.log('[pattern.isHtmlUpdated]: ', 'Input HTML has syntax error, exit.');
				alert('Your HTML input is not valid, fix it and try again!');
			}
			//return false to prevent saving/revert
			return false;
		}

		//if no error caught from input html
		var isUpdated = ($scope.pattern.html == minify($scope.input, staticFactory.minifyHtmlOptions))
			? false
			: true;
		return isUpdated;
	};

	// updated iframe head dependencies from a list
	var updateHeadDependencies = function($tgt, list, ext){
		//exit
		if (!$tgt.length) return;
		if (ext == undefined) return;
		//inject list of dependencies
		$tgt.empty();
		if (list && list.length) {
			$.each(list, function(idx, ele){
				$tgt.append( utilsFactory.getRepoFile($scope.repo.path, ele, ext) );
			});
		}
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

	// view data
	// -------------------------------------------------------------------------------------------

	//UI mode
	$scope.settingsActive = utilsFactory.settingsActive;

	//input data for editor
	$scope.input = '';

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
		if (!isHtmlUpdated()
			&& !utilsFactory.isInputUpdated($scope.patternInfoForm.patternTitle)
			&& !utilsFactory.isInputUpdated($scope.patternInfoForm.patternRepo)) {
			console.log('[pattern.save]: ', 'No updates to input, exit.');
			alert('No Valid Pattern Updates to Save!');
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
			utilsFactory.resetInput($scope.patternInfoForm, 'patternRepo');

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
			alert('No Valid Pattern Updates to Revert!');
			return false;
		}

		//revert input valur to stored model value
		$scope.input = style_html($scope.pattern.html, staticFactory.beautifyHtmlOptions);

		console.log('[pattern.revert]: ', 'reverted back to stored html value.');
		alert('Pattern Updates Reverted!');
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

	// view pattern/repos data
	// -------------------------------------------------------------------------------------------

	//load pattern/repos data
	var patternDataPromises = [];
	patternDataPromises.push( repoService.getRepos() );
	patternDataPromises.push( patternService.getPattern('BS-001') );

	$q.all(patternDataPromises)
		.then(function(result){
			onPatternData(result);
		},
		function(){
			console.log('[patternService.getPattern]: ', 'Failed loading pattern data.');
			alert('Failed loading pattern data, try again!');
		});

	// pattern data handler
	function onPatternData(result){
		//common vars
		var $frame = $('#app-pattern-display'),
			$frameHead = $frame.contents().find('head'),
			$frameBody = $frame.contents().find('body');

		//set data from result to view model
		var patternData = result[1].data,
			repoData = result[0].data;

		$scope.pattern = patternData;
		$scope.repos = repoData;
		$scope.repo = repoData[$scope.pattern.repo];

		//inject repo css dependencies
		updateHeadDependencies($frameHead, $scope.repo.css, 'css');

		//watch input value and inject to display on update
		var cancelPatternInputWatch = $scope.$watch('input', function(){
			$frameBody.html($scope.input);
		});

		//watch pattern.repo value and inject assets
		var cancelPatternRepoWatch = $scope.$watch('pattern.repo', function(){
			//update new repo data
			$scope.repo = repoData[$scope.pattern.repo];
			//inject assets
			updateHeadDependencies($frameHead, $scope.repo.css, 'css');

			console.log('[WATCH:pattern.repo]: ', 'Pattern repo updated to: ' + $scope.repo.id);
		});

		//prep time data
		$scope.sincelastupdate = utilsFactory.getDisplayTimePeriod($scope.pattern.lastupdate);
		//prep input data for editor
		$scope.input = style_html($scope.pattern.html, staticFactory.beautifyHtmlOptions);

		//clean ups
		$scope.$on('destroy', function(e){
			cancelPatternInputWatch();
			cancelPatternRepoWatch();
		});
	}

}]);

angular.module('playground')

// static factory
.factory('staticFactory', [function(){
	var statics = {
		//UI classes
		classes: {
			activeCls: 'active',
			settingsActiveCls: 'settingsActive'
		},

		//events
		events: {
			transitionEnd: 'webkitTransitionEnd transitionend',
			animationEnd: 'webkitAnimationEnd animationend'
		},

		//pattern service
		webServiceURL: 'https://patternplayground.firebaseio.com/',
		patternsPath: 'patterns',
		reposPath: 'repos',
		suffix: '.json',

		//template objects
		tmplNewPattern: {
			author: 'JohnnyX',
			repo: 'BS-331',
			title: 'New Pattern',
			html: '<div class=\"container-fluid\"><div class=\"row\"><div class=\"col-md-6 col-md-offset-3 text-center\"><h1><b>Welcome to Pattern Playground!</b></h1><p class=\"lead\">The <b>Pattern Playground</b>provides you a friendly environment to play with your HTML snippets with different CSS repositories.</p><hr><h3>Features</h3><ul class=\"text-left\"><li>To use the playground, all you need to know is some HTML markup.</li><li>All patterns are safely saved in cloud via <a href=\"https://www.firebase.com/\" target=\"_blank\">Firebase</a>.</li><li>You can <b>create</b>new patterns, <b>edit</b>and <b>save</b>existing ones, or <b>delete</b>them if not longer needed.</li><li>You can choose from popular CSS frameworks like <a href=\"http://getbootstrap.com/css/\" target=\"_blank\">Bootstrap</a>, <a href=\"http://foundation.zurb.com/docs/\" target=\"_blank\">Foundation</a>, and built-in private repositories.</li></ul><h3>How to use</h3><p>Coming soon...</p><h3>Credits</h3><p>Brought to you by Johnny Xu</p><hr><p><small>Version: 0.1<br>2014.12.30</small></p></div></div></div>'
		},

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

//utils factory
// -------------------------------------------------------------------------------------------
.factory('utilsFactory', ['staticFactory', function(staticFactory){
	var utils = {
		//unique ID for pattern
		generateUID: function() {
			return ("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6);
		},

		//construct repo asset file elem from data
		getRepoFile: function(repoPath, file, ext) {
			var url = repoPath + file.path + file.filename + '.' + ext;
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
		},

		//format time point into display text
		getDisplayTime: function(time) {
			if (new Date(time) == 'Invalid Date') {
				console.log('[services.getDisplayTime]: Invalid Date');
				return false;
			}
			var timeDisplay = '';
			var date = new Date(time).toDateString();
			var today = new Date().toDateString();

			if (date == today) {
				timeDisplay = 'Today';
			} else {
				timeDisplay = date;
			}

			return timeDisplay;
		},

		//format time period into display text
		getDisplayTimePeriod: function(lasttime) {
			var timeDiffSec = Math.round((new Date().getTime() - lasttime) / 1000);
			var timeDisplay = '';
			var timeNumberInUnit;

			var formatDisplayMsg = function(num, unit){
				var msg = num + ' ' + unit + ((num > 1)?'s':'') + ' ago';
				return msg;
			};

			//less than 10 mins
			if (timeDiffSec < 60 * 10) {
				timeDisplay = 'just now';
			}
			//more than 10 mins
			if (timeDiffSec >= 60 * 10) {
				timeNumberInUnit = Math.floor(timeDiffSec/60);
				timeDisplay = formatDisplayMsg(timeNumberInUnit, 'minute');
			}
			//more than 1 hour
			if (timeDiffSec >= 3600) {
				timeNumberInUnit = Math.floor(timeDiffSec/3600);
				timeDisplay = formatDisplayMsg(timeNumberInUnit, 'hour');
			}
			//more than 1 day
			if (timeDiffSec >= 3600 * 24) {
				timeNumberInUnit = Math.floor(timeDiffSec/3600/24);
				timeDisplay = formatDisplayMsg(timeNumberInUnit, 'day');
			}

			return timeDisplay;
		},

		//check if input has been updated
		isInputUpdated: function(input){
			var isUpdated = input.$dirty;
			return isUpdated;
		},

		//reset input
		resetInput: function(form, input){
			form.$setPristine(input, true);
			form.$setUntouched(input, true);
		},

		//toggle settings penel
		settingsActive: false,
		toggleSettings: function() {
			//toggle state
			this.settingsActive = !this.settingsActive;
			//update UI
			var $app = $('.app-view'),
				activeCls = staticFactory.classes.settingsActiveCls;
			if (!$app.length) return;
			if (this.settingsActive) {
				$app.addClass(activeCls);
			} else {
				$app.removeClass(activeCls);
			}
		}
	};

	return utils;
}])

// repo service
// -------------------------------------------------------------------------------------------
.service('repoService', ['staticFactory', '$http', function(staticFactory, $http) {
	var config = {
		cache: true
	};
	this.getRepos = function() {
		var s = staticFactory;
		return $http.get(s.webServiceURL + s.reposPath + s.suffix, config);
	};
	this.getRepo = function(id) {
		var s = staticFactory;
		return $http.get(s.webServiceURL + s.reposPath + '/' + id + s.suffix, config);
	};
}])

// pattern service
// -------------------------------------------------------------------------------------------
.service('patternService', ['staticFactory', '$http', function(staticFactory, $http) {
	var config = {
		cache: false
	};
	this.getPattern = function(id) {
		var s = staticFactory;
		return $http.get(s.webServiceURL + s.patternsPath + '/' + id + s.suffix, config);
	};
	this.putPattern = function(id, patternObj) {
		var s = staticFactory;
		return $http.put(s.webServiceURL + s.patternsPath + '/' + id + s.suffix, patternObj);
	};
	this.deletePattern = function(id) {
		var s = staticFactory;
		return $http.delete(s.webServiceURL + s.patternsPath + '/' + id + s.suffix);
	};
	this.getPatterns = function() {
		var s = staticFactory;
		return $http.get(s.webServiceURL + s.patternsPath + s.suffix, config);
	};
}]);

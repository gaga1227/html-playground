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
			author: 'Public User',
			isPublic: true,
			repo: 'BS-331',
			title: 'New Pattern',
			html: "<!-- Default intro content --><div class=\"container\"><div class=\"row\"><div class=\"col-md-8 col-md-offset-2 text-center\"><div><img src=\"imgs/logo.svg\" width=\"200\" height=\"200\"></div><h1><b>Welcome to Pattern Playground!</b></h1><p class=\"lead\">The <b>Pattern Playground</b> provides you a friendly environment to play with your HTML snippets with different CSS repositories.</p><hr><h3><b>Features</b></h3><ul class=\"text-left\"><li>To use the playground, all you need to know is some HTML markup.</li><li>All patterns are safely saved in cloud via <a href=\"https://www.firebase.com/\" target=\"_blank\">Firebase</a>.</li><li>You can <b>create</b> new patterns, <b>edit</b> and <b>save</b> existing ones, or <b>delete</b> them if not longer needed.</li><li>You can choose from popular CSS frameworks like <a href=\"http://getbootstrap.com/css/\" target=\"_blank\">Bootstrap</a>, <a href=\"http://foundation.zurb.com/docs/\" target=\"_blank\">Foundation</a>, and built-in private repositories.</li></ul><hr><h3><b>How to use</b></h3><div class=\"row\"><div class=\"col-sm-6 section\"><img src=\"imgs/help-btn-dash.png\" width=\"60\" height=\"60\"><h4>Menu Button</h4><p>takes you back to the pattern dashboard where you can add, copy, edit and delete individual patterns.</p></div><div class=\"col-sm-6 section\"><img src=\"imgs/help-btn-revert.png\" width=\"60\" height=\"60\"><h4>Revert Button</h4><p>reverts any unsaved updates you made in the pattern code editor. This does not revert pattern name and repo changes.</p></div><div class=\"col-sm-6 section\"><img src=\"imgs/help-btn-save.png\" width=\"60\" height=\"60\"><h4>Save Button</h4><p>saves any valid pattern code updates from the editor into the cloud! It also reformats the editor source code for better readability.</p></div><div class=\"col-sm-6 section\"><img src=\"imgs/help-btn-info.png\" width=\"60\" height=\"60\"><h4>Pattern Info Button</h4><p>opens the side menu where you will find more information. You can also update pattern's name and CSS repo.</p></div></div><hr><h3><b>Credits</b></h3><p>Brought to you by Johnny Xu</p><p class=\"discreet\"><small>Version: 0.1<br>2014.12.31</small></p></div></div></div><!-- Custom CSS styles --><style type=\"text/css\">body {\n\tcolor: #555;\n\tfont-size: 16px;\n}\n.container {\n\tmargin-top: 2em;\n\tmargin-bottom: 2em;\n}\nhr {\n\tmargin: 2.5em 0;\n\tborder-color: #ffc947;\n}\nh1 {\n\tcolor: #fc9436;\n}\nh3 {\n\tcolor: #ff2b57;\n}\na, a:hover, a:visited {\n\tcolor: #007df5;\n}\n.section {\n\tmargin: 1em 0;\n}\n.section h4 {\n\tmargin: 0.8em 0;\n\tfont-weight: bold;\n}\n.section img {\n\tborder-radius: 50%;\n}</style>"
		},

		//ace editor options
		editorOptions: {
			vScrollBarAlwaysVisible: true,
			showInvisibles: true,
			fontSize: '16px'
		},

		//HTML beautify/minify params
		beautifyHtmlOptions : {
			indent_char : '\t',
			indent_size : 1,
			max_char : 0,
			indent_scripts: 'keep',
			unformatted: [
				'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li',
				'span', 'a', 'sub', 'sup', 'b', 'i', 'u'
			]
		},
		minifyHtmlOptions : {
			removeCDATASectionsFromCDATA: true,
			collapseWhitespace : true,
			conservativeCollapse : false,
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
			if (time == undefined) return false;
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

// user auth service
// -------------------------------------------------------------------------------------------
.service('authService', ['staticFactory', function(staticFactory) {
	//properties
	this.ref = new Firebase(staticFactory.webServiceURL);
	//methods
	this.login = function(provider) {
		if (!provider) {
			console.log('[authService.login]: Invalid login provider token!');
			return false;
		}
		this.ref.authWithOAuthPopup(provider, function(error, authData) {
			if (error) {
				console.log('[authService.login]: Login Failed!', error);
			}
		});
	};
	this.logout = function(){
		this.ref.unauth();
	}

	//onAuth handler
	var _this = this;
	this.ref.onAuth(function(authData){
		if (authData == null) {
			console.log("[authService.onAuth]: User logged out");
		} else {
			console.log("[authService.onAuth]: User logged in");
		}
		_this.authData = authData;
	});
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

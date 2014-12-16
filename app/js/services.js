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

		//format time into display text
		getDisplayTime: function(lasttime) {
			var timeDiffSec = Math.round((new Date().getTime() - lasttime) / 1000);
			var timeDisplay = '';
			//less than 10 mins
			if (timeDiffSec < 60 * 10) {
				timeDisplay = 'just now';
			}
			//more than 10 mins
			if (timeDiffSec >= 60 * 10) {
				timeDisplay = Math.floor(timeDiffSec/60) + ' min(s) ago';
			}
			//more than 1 hour
			if (timeDiffSec >= 3600) {
				timeDisplay = Math.floor(timeDiffSec/3600) + ' hr(s) ago';
			}
			//more than 1 day
			if (timeDiffSec >= 3600 * 24) {
				timeDisplay = Math.floor(timeDiffSec/3600/24) + ' Day(s) ago';
			}

			return timeDisplay;
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

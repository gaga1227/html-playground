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

		//format time point into display text
		getDisplayTime: function(time) {
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

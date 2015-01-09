angular.module('playground')
.controller('LoginController', [
	'$scope', 'staticFactory', 'utilsFactory',
	function($scope, staticFactory, utilsFactory) {

	// vars and utils
	// -------------------------------------------------------------------------------------------


	// view data
	// -------------------------------------------------------------------------------------------


	// view methods
	// -------------------------------------------------------------------------------------------

	// login
	var ref = new Firebase("https://patternplayground.firebaseio.com");
	ref.onAuth(function(authData){
		if (authData == null) {
			console.log("User logged out");
			$scope.user = {
				id: undefined,
				name: undefined,
				picture: undefined
			};
		} else {
			console.log("User logged in: ", authData);
			var userdata = authData[authData.provider];
$scope.user = {
					id: authData.uid,
					name: userdata.displayName,
					picture: userdata.cachedUserProfile.picture
				};
		}
	});

	$scope.login = function(){
		ref.authWithOAuthPopup("google", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			}
		});
	}

	// logout
	$scope.logout = function(){
		ref.unauth();
	}

}]);

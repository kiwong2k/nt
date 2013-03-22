'use strict';

/* Directives */

iwc.app.
	directive('iwcngLayout', function() {
		return {
			restrict: 'A',
			scope: {},
			controller: function($scope, $element) {
				var lefts = $scope.lefts = [];
				var rights = $scope.rights = [];
				var tops = $scope.tops = [];
				var bottoms = $scope.bottoms = [];
				var centers = $scope.centers = [];

				this.layoutTop = function(pane, element) {
					console.log("layoutTop", pane, element);
					tops.push(element);
				}

				this.layoutBottom = function(pane, element) {
					console.log("layoutTop", pane, element);
					bottoms.push(element);
				}

				this.layoutLeft = function(pane, element) {
					console.log("layoutLeft", pane, element);
					lefts.push(element);
				}

				this.layoutRight = function(pane, element) {
					console.log("layoutRight", pane);
					rights.push(element);
				}

				this.layoutCenter = function(pane, element) {
					// only handle left center right  or top center bottom
					if (lefts.length || rights.length) {

						// float left or right

						var marginLeft = 0, marginRight = 0;

						angular.forEach(lefts, function(left, i) {
							marginLeft += $(left).outerWidth(true);
							$(left).css('float', 'left');
							$(left).css('height', '100%');
						});

						angular.forEach(rights, function(right, i) {
							marginRight += $(right).outerWidth(true);
							$(right).css('float', 'right');
							$(right).css('height', '100%');
						});


						// make the element
						//      position: relative
						//      margin-left: marginLeft
						//      margin-right: marginRight
						//      width: auto
						$(element).css('position', 'relative');
						$(element).css('margin-left', marginLeft);
						$(element).css('margin-right', marginRight);
						$(element).css('width', 'auto');
						$(element).css('height', '100%');

					}
					console.log("layoutCenter", pane, element);

				}


			}
		};
	}).
	directive('iwcngLeft', function() {
		return {
			require: '^iwcngLayout',
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutLeft(scope, element);
			}
		};
	}).
	directive('iwcngCenter', function() {
		return {
			require: '^iwcngLayout',
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutCenter(scope, element);
			}
		};
	})


'use strict';

/* Directives */

iwc.app.
	directive('iwcngLayout', function() {
		return {
			restrict: 'A',
			scope: {},
			link: function(scope, element, attrs) {
				$(element).css('height', '100%');
				$(element).css('position', 'relative');
			},
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

						var marginLeft = 0, marginRight = 0;

						// cannot use float left/rght because height issue
						// use position:absolute instead
						angular.forEach(lefts, function(left, i) {

							$(left).css('position', 'absolute');
							$(left).css('left', marginLeft);
							$(left).css('top', '0');
							$(left).css('bottom', '0');

							marginLeft += $(left).outerWidth(true);
						});

						angular.forEach(rights, function(right, i) {
   							$(right).css('position', 'absolute');
							$(right).css('right', marginRight)
							$(right).css('top', '0');
							$(right).css('bottom', '0');
							marginRight += $(right).outerWidth(true);
						});


						// make the element
						//      position: relative
						//      margin-left: marginLeft
						//      margin-right: marginRight
						//      width: auto
						$(element).css('position', 'absolute');
						$(element).css('left', marginLeft);
						$(element).css('right', marginRight);
						$(element).css('width', 'auto');
						$(element).css('top', '0');
						$(element).css('bottom', '0');

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


'use strict';

/* Directives */

iwc.app.
	directive('iwcngLayout', function() {
		return {
			restrict: 'A',
		   	scope: true,
			link: function(scope, element, attrs) {
				$(element).css('height', '100%');
				$(element).css('position', 'relative');
			},
			controller: function($scope, $element) {
				var lefts = [], rights = [], tops = [], bottoms = [], centers = [];
				var marginLeft = 0, marginRight = 0, marginTop = 0,  marginBottom = 0;
				var ltr = undefined;

				this.layoutTop = function(pane, element) {
					console.log("layoutTop", pane, element);
					tops.push(element);
					ltr = !!ltr;
				}

				this.layoutBottom = function(pane, element) {
					console.log("layoutTop", pane, element);
					bottoms.push(element);
					ltr = !!ltr;
				}

				this.layoutLeft = function(pane, element) {
					console.log("layoutLeft", pane, element);
					lefts.push(element);
					ltr = (ltr === undefined) ? true : ltr;
				}

				this.layoutRight = function(pane, element) {
					console.log("layoutRight", pane);
					rights.push(element);
					ltr = (ltr === undefined) ? true : ltr;
				}

				this.left2Right = function() {
					if (lefts.length || rights.length) {
						angular.forEach(lefts, function(left, i) {
							$(left).css({
								'position': 'absolute',
								'top': marginTop,
 								'bottom': marginBottom,
								'left': marginLeft
							});
							marginLeft += $(left).outerWidth(true);
						});

						angular.forEach(rights, function(right, i) {
							$(right).css({
								'position': 'absolute',
								'top': marginTop,
								'right': marginRight,
								'bottom': marginBottom
							});
							marginRight += $(right).outerWidth(true);
						});
					}
				}

				this.top2Bottom = function() {
					if (tops.length || bottoms.length) {
						angular.forEach(tops, function(top, i) {
							$(top).css({
								'position': 'absolute',
								'top': marginTop,
								'right': marginRight,
								'left': marginLeft
							});
							console.log(top + ", marginTop=" + marginTop + ", total tops=" + tops.length)
							marginTop += $(top).outerHeight(true);

						});

						angular.forEach(bottoms, function(bottom, i) {
							$(bottom).css({
								'position': 'absolute',
								'right': marginRight,
								'bottom': marginBottom,
								'left': marginLeft
							});
							marginBottom += $(bottom).outerHeight(true);
						});
					}
				}


				this.layoutCenter = function(pane, element) {
					if (ltr) {
						this.left2Right();
						this.top2Bottom();
					} else {
						this.top2Bottom();
						this.left2Right();
					}

					$(element).css({
						'position': 'absolute',
						'top': marginTop,
						'right': marginRight,
						'bottom': marginBottom,
						'left': marginLeft,
						'width': 'auto'
					});
					console.log("layoutCenter", pane, element);

				}


			}
		};
	}).
	directive('iwcngTop', function() {
		return {
			require: '^iwcngLayout',
			scope: true,
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutTop(scope, element);
			}
		};
	}).
	directive('iwcngBottom', function() {
		return {
			require: '^iwcngLayout',
			scope: true,
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutBottom(scope, element);
			}
		};
	}).
	directive('iwcngLeft', function() {
		return {
			require: '^iwcngLayout',
			scope: true,
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutLeft(scope, element);
			}
		};
	}).
	directive('iwcngRight', function() {
		return {
			require: '^iwcngLayout',
			scope: true,
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutRight(scope, element);
			}
		};
	}).
	directive('iwcngCenter', function() {
		return {
			require: '^iwcngLayout',
			scope: true,
			restrict: 'A',
			link: function(scope, element, attrs, layoutCtrl) {
				layoutCtrl.layoutCenter(scope, element);
			}
		};
	})


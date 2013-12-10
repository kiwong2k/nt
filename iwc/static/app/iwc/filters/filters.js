'use strict';

/* Filters */
iwc.app
.filter('smartdate', ['$filter', function($filter) {
	return function(input) {
		var now = new Date();
		var before = new Date(input);
		var msInADay = 86400000;
		var diffInDays = (now.getTime() - input < 2*msInADay) 
			? now.getDate() - before.getDate()
			: -1;
		
		switch (diffInDays) {
			case 0: 
				return $filter('date')(input, 'shortTime');
				break;
			case 1:
				return "yesterday";
				break;
			default:
				// are they in the same year?
				return (now.getFullYear() == before.getFullYear()) 
					? $filter('date')(input, 'MMM d')
					: $filter('date')(input, 'shortDate');
				break;
		}
		
	}
}]);


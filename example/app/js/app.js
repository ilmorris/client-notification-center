define([
	'lib/notifier/notifier'
], function(Notifier) {
	var App = function() {
		this.notifier = new Notifier();
	};
	
	App.prototype = {
		
	};
	
	return App;
});
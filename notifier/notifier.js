define([], function() {
	var Notifier = function(view, opt) {
		var opt = opt || {};
		
		// Notification queue
		this._queue = {
			timed: [],
			promised: []
		};
		
		// Display time defaults
		this._minTime = opt['minTime'] || 1000;
		this._maxTime = opt['maxTime'] || 5000;
		
		this._viewIsBusy = false;
	};
	
	
	Notifier.prototype = {
		// When notification is added, start request chain
		addNotification: function(message, opt) {		// TODO: add callback for notification willDisplay and willDismiss events
			var notif = new Notification(message, this, opt);
			this._queue.timed.push(notif);
			
			!this._current ? this.next() : console.log('View is currently busy');
		},
		addDeferredNotification: function(message, opt) {
			var notif = new Notification(message, this, opt);
		},
		// Clear notification queues
		clearNotifications: function() {
			this._queue = {
				timed: [],
				promised: []
			};
			
			this._viewIsBusy = false;
		},
		
		// Get display time for notification
		getDisplayTime: function() {
			return this._maxTime;		// TODO: add logic for determining display time based on queue length
		},
		
		// Get currently active notification
		getCurrent: function() {
			return this._current;
		},
		next: function() {
			// Called by notification after it's been displayed
			// Check each notification queue (timed and promised) to get next notification
			if (this._queue.timed.length) {
				this._current = this._queue.timed[this._queue.timed.length-1];
				this._queue.timed.pop();
			} else {
				this._current = null;
			}
			
			// Check if notification is currently being displayed, start display()
			if (!this._viewIsBusy) {
				this._current ? this._current.display() : console.log('queue empty');
			}
		}
	};
	
	function Notification(message, notifier, opt) {
		this._message = message;		// Message
		this._notifier = notifier;		// Reference to notifier
		this._created = new Date();		// Createdatetime
	}
	
	Notification.prototype = {
		display: function() {
			var self = this;
			self._notifier._viewisBusy = true;
			$('#msg-center').html(self._message);
			console.log(this._message);		// TODO: clean this up to add view binding and allow difference implementations for different notifs
			setTimeout(function() {
				$('#msg-center').html('');
				self._notifier._viewisBusy = false;
				self._notifier.next();
			}, self._notifier.getDisplayTime());
		},
		dismiss: function() {
			
		}
	};
	
	return Notifier;
});
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery');
    var Utils = require('utils');

	var readyDeferred = $.Deferred();

	module.exports = {
        isReady: false,
        readyDeferred: readyDeferred,
        ready: readyDeferred.promise(),
        init: function() {
            var that = this;
            // Configure the environment
            if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) && cordova) {
                console.log('Using PhoneGap/Cordova!');
                App.Env.cordova = true;
            } else {
                console.log('Using Browser: ' + navigator.userAgent);
                that.onReady();
            }

            // See if device is already ready
            if(GLOBAL_onReady === true){
                // alert('is already onReady');
                setTimeout(function(){
                    that.onReady();
                },100);
            } else {
                document.addEventListener("deviceready", function(){
                    // alert('deviceready ready 324');
                    that.onReady();
                }, false);
            }
        },
        onReady: function() {
            if (this.isReady === true) {
                return;
            }
            this.isReady = true;

            // Load device specific stylesheet
            if (App.Env.cordova) {
                App.Env.platform = 'android';
                try {
                    App.Env.platform = device.platform.toLowerCase();
                } catch (err) {
                    console.log(err);
                }
            } else {
                // For dev purposes only
                App.Env.platform = 'browser';
            }
            $('head').append('<link rel="stylesheet" href="css/'+ App.Env.platform +'.css" type="text/css" />');

            // Status bar colors
            try {
                if (App.Env.platform == 'ios') {
                    // App.MainView has NOT been created yet
                    App.StatusBar = true;

                    StatusBar.overlaysWebView(true);
                    StatusBar.backgroundColorByHexString(App.Preferences.StatusBarBackgroundColor);
                    // Utils.Notification.Toast('OK status bar');
                }
            } catch(err) {
                console.log(err);
                Utils.Notification.Toast('Failed status bar');
            }

            // Resolve deferred
            this.readyDeferred.resolve();

            // Track.js
            // - only using in production
            if(App.Env.cordova && App.Env.prod){
                _trackLogging();
            }
        },
        trackLogging: function() {
            // lazy-load track.js
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src = 'src/lib/track.js';
            // $(script).attr('data-token', Credentials.trackjs_token);

            // trackjs options
            window._trackJs = Credentials.trackjs_opts;
            window._trackJs.version = App.Env.version;
            $("body").append( script );
        }
    };
});
require.config({
    waitSeconds: 7,
    paths: {
        analytics: '../src/utils/Analytics',
        jquery: '../src/lib/jquery',
        'jquery-adapter' : '../src/lib/jquery-adapter',
        underscore: '../src/lib/underscore',
        utils: '../src/utils/Utils'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: 'jquery'
        },
        'backbone': {
            deps: ['underscore', 'jquery', 'moment'],
            exports: 'Backbone'
        },
        'backbone-adapter': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        'jquery-adapter': {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
    //,urlArgs: "bust=" + (new Date()).getDate()
});

define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var Analytics =     require('analytics');
    var DeviceUtils =   require('../src/utils/DeviceUtils');
    var Utils =         require('utils');

    var EventHandler =  require('../src/famous/core/EventHandler');
    var Engine =        require('famous/core/Engine');

    var $ = require('jquery-adapter');
    var _ = require('underscore');

    var DefaultCache = {

    };

    // load App defaults
    App = {
        Cache: _.defaults({}, DefaultCache),
        DefaultCache: DefaultCache,
        Env: {
            cordova: false
        },
        Events: new EventHandler(),
        Preferences: {

        },
        shortName: "monticello"
    };

    // Load App Configuration Details
    var ConfigXml = require('text!config.xml');
    // - Parse config.xml and set approprate App variables
    App.Config = $($.parseXML(ConfigXml));
    if(App.Config.find("widget").get(0).attributes.id.value.indexOf('.pub') !== -1){
        App.Env.prod = true;
        App.Env.version = App.Config.find("widget").get(0).attributes.version.value;
        App.Preferences.StatusBarBackgroundColor = App.Config.find("widget").find('preference[name="StatusBarBackgroundColor"]').get(0).attributes.value.value;
    }
    // - remove loading background
    document.body.setAttribute('style',"");
    // - Google Analytics Plugin
    Analytics.init();

    // load models

    // configure device
    DeviceUtils.init();

    // Load App Localization / Globalization
    App.Cache.language = localStorage.getItem('language_v1');
    var GlobalizationDeferred = $.Deferred();
    if(!App.Cache.language || App.Cache.language.length <= 0){
        App.Cache.language = 'en';  // set default
        // Get Language
        try {
            navigator.globalization.getLocaleName(
                function (locale) {
                    console.info('locale: ' + locale.value);
                    // validate we support this locale!
                    var localeNormalized = Utils.Locale.normalize(locale.value);
                    if(localeNormalized !== false){
                        // Set the locale
                        console.info('locale normalized: ' + localeNormalized);
                        App.Cache.language = localeNormalized;
                    }
                    GlobalizationDeferred.resolve();
                },
                function () {
                    alert('Error getting locale');
                }
            );
        }catch(err){
            // use default
            GlobalizationDeferred.resolve();
        }
    } else {
        // Have the language already
        GlobalizationDeferred.resolve();
    }

    // Run the application
    var i18nOpt = {
        lng: App.Cache.language,
        ns: {namespaces: ['ns.common'], defaultNs: 'ns.common'}, //{ namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'},
        useLocalStorage: false,
        debug: true
    };
    GlobalizationDeferred.promise().then(function() {
        $.i18n.init(i18nOpt, function(t) {
            _run(t);
        });
    });

    //////////////////////////////////

    // helper methods

    //////////////////////////////////

    function _run(t) {

        // localization initialized
        App.t = t;

        // Backbone.js Router
        // App.Router = require('router')(App); // Passing "App" context to Router also

        // create the main context
        App.MainContext = Engine.createContext();
        App.MainContext.setPerspective(1000);
//
//        // MainView
//        App.MainView = new View();
//        App.MainView.SizeMod = new StateModifier({
//            size: [undefined, undefined]
//        });
//        App.MainContext.add(App.MainView.SizeMod).add(App.MainView);
//
//        // Add main background image (pattern)
//        App.MainBackground = new Surface({
//            size: [undefined, undefined],
//            classes: ['overall-background']
//        });
//        App.MainView.add(Utils.usePlane('background')).add(App.MainBackground);
//
//        // Create main Lightbox
//        App.MainController = new Lightbox();
//        App.MainController.getSize = function(){
//            return [undefined, undefined];
//        };
//        App.MainController.resetOptions = function(){
//            this.setOptions(Lightbox.DEFAULT_OPTIONS);
//        };
//
//        App.defaultSize = [window.innerWidth, window.innerHeight]; // use Device Width/height via native plugin?
//        // document.body.setAttribute('style',"width:"+window.innerWidth+"px;height:"+window.innerHeight+"px");
//        // Utils.Notification.Toast(window.innerHeight);
//        App.mainSize = [window.innerWidth, window.innerHeight];
//        // Engine.nextTick(function() {
//        //     console.log('After tick=' + App.MainContext.getSize());
//        //     App.mainSize = App.MainContext.getSize();
//        // });
//
//        App.MainContext.on('resize', function(e) {
//            // Utils.Notification.Toast('Resized');
//            App.MainView.SizeMod.setSize(App.mainSize);
//            // document.body.setAttribute('style',"height:"+App.mainSize[1]+"px");
//        }.bind(this));
//
//
//        // Layout for StatusBar / Controller
//        if(App.Config.devicePlatform == 'ios'){
//            App.StatusBar = true;
//        }
//
//        // App.StatusBar set in device_ready
//        App.DeviceReady.ready.then(function(){
//
//            var ratios = [1];
//            if(App.StatusBar === true){
//                ratios = [true, 1];
//            }
//            App.MainView.Layout = new FlexibleLayout({
//                direction: 1,
//                ratios: ratios
//            });
//            App.MainView.Layout.Views = [];
//
//
//            // iOS StatusBar (above MainController lightbox, if necessary)
//            App.StatusBarView = new Surface({
//                size: [undefined, 20],
//                classes: ['status-bar-default'],
//                properties: {
//                    // backgroundColor: App.ConfigImportant.StatusBarBackgroundColor
//                }
//            });
//            if(App.StatusBar === true){
//                App.MainView.Layout.Views.push(App.StatusBarView);
//            }
//
//            App.MainView.Layout.Views.push(App.MainController);
//            App.MainView.Layout.sequenceFrom(App.MainView.Layout.Views);
//
//            // Add Lightbox/RenderController to mainContext
//            App.MainView.add(Utils.usePlane('content')).add(App.MainView.Layout);
//
//        });
//
//        // Add GenericToast
//        // - attaches to MainContext at the Root at is an overlay for Toast notifications (more fun animation options than Native Toast)
//        // - todo...
//
//        // Add GenericOnlineStatus
//        // - we want to effectively communicate to the user when we have lost or are experiencing a degraded internet connection
//        // - todo...
//
//        // Main Footer
//        var createMainFooter = function(){
//            // var that = this;
//            App.Views.MainFooter = new View();
//
//            // create the footer
//            App.Views.MainFooter.Tabs = new StandardTabBar();
//            var tmpTabs = App.Views.MainFooter.Tabs;
//
//            tmpTabs.defineSection('home', {
//                content: '<i class="icon ion-home"></i><div><span class="ellipsis-all">'+App.t('footer.waiting')+'</span></div>',
//                onClasses: ['footer-tabbar-default', 'on'],
//                offClasses: ['footer-tabbar-default', 'off']
//            });
//            tmpTabs.defineSection('messages', {
//                content: '<i class="icon ion-android-inbox"></i><div><span class="ellipsis-all">'+App.t('footer.messages')+'</span></div>',
//                onClasses: ['footer-tabbar-default', 'on'],
//                offClasses: ['footer-tabbar-default', 'off']
//            });
//            tmpTabs.defineSection('profiles', {
//                content: '<i class="icon ion-person"></i><div><span class="ellipsis-all">'+App.t('footer.profiles')+'</span></div>',
//                onClasses: ['footer-tabbar-default', 'on'],
//                offClasses: ['footer-tabbar-default', 'off']
//            });
//            tmpTabs.defineSection('friends', {
//                content: '<i class="icon ion-android-friends"></i><div><span class="ellipsis-all">'+App.t('footer.friends')+'</span></div>',
//                onClasses: ['footer-tabbar-default', 'on'],
//                offClasses: ['footer-tabbar-default', 'off']
//            });
//
//
//
//            tmpTabs.on('select', function(result, eventTriggered){
//                console.error(eventTriggered);
//                console.error(result);
//                switch(result.id){
//
//                    case 'home':
//                        App.history.navigate('user/waiting');
//                        break;
//
//                    case 'profiles':
//                        App.history.navigate('user',{history: false});
//                        break;
//
//                    case 'messages':
//                        App.history.navigate('inbox');
//                        break;
//
//                    case 'friends':
//                        App.history.navigate('friend/list');
//                        break;
//
//                    default:
//                        alert('none chosen');
//                        break;
//                }
//            });
//
//
//            // Attach header to the layout
//            App.Views.MainFooter.originMod = new StateModifier({
//                origin: [0, 1]
//            });
//            App.Views.MainFooter.positionMod = new StateModifier({
//                transform: Transform.translate(0,60,0)
//            });
//            App.Views.MainFooter.sizeMod = new StateModifier({
//                size: [undefined, 60]
//            });
//
//            App.Views.MainFooter.add(App.Views.MainFooter.originMod).add(App.Views.MainFooter.positionMod).add(App.Views.MainFooter.sizeMod).add(App.Views.MainFooter.Tabs);
//
//            App.Views.MainFooter.show = function(transition){
//                transition = transition || {
//                    duration: 750,
//                    curve: Easing.outExpo
//                };
//                App.Views.MainFooter.positionMod.setTransform(Transform.translate(0,0,0), transition);
//            };
//
//            App.Views.MainFooter.hide = function(transition){
//                transition = transition || {
//                    duration: 250,
//                    curve: Easing.inExpo
//                };
//                App.Views.MainFooter.positionMod.setTransform(Transform.translate(0,1000,0), transition);
//            };
//
//            // Add to maincontext
//            App.MainView.add(Utils.usePlane('mainfooter')).add(App.Views.MainFooter);
//
//        };
//        createMainFooter();
//
//        // Splash Page (bloom loading)
//        // - terminated by the
//        var createSplashLoading = function(){
//            // var that = this;
//            App.Views.SplashLoading = new RenderController({
//                inTransition: false,
//                // outTransition: false,
//            });
//            App.Views.SplashLoading.View = new View();
//            App.Views.SplashLoading.View.SizeMod = new StateModifier({
//                size: [undefined, undefined]
//            });
//            App.Views.SplashLoading.View.OriginMod = new StateModifier({
//                origin: [0.5,0.5]
//            });
//            var viewNode = App.Views.SplashLoading.View.add(App.Views.SplashLoading.View.SizeMod).add(App.Views.SplashLoading.View.OriginMod);
//            App.Views.SplashLoading.BgSurface = new Surface({
//                content: '',
//                size: [undefined, undefined],
//                properties: {
//                    backgroundColor: '#444'
//                }
//            });
//
//
//            // spinning logo
//
//            // 0 - innermost
//            App.Views.SplashLoading.Logo = new Surface({
//                content: 'Waiting App',
//                classes: ['splash-surface-default'],
//                properties: {
//                    // 'backface-visibility' : 'visible'
//                },
//                // content: 'https://dl.dropboxusercontent.com/u/6673634/wehicle_square.svg',
//                size: [window.innerWidth, 70]
//            });
//            App.Views.SplashLoading.Logo.useOpacity = 0;
//            var splashOpacity = 0;
//            App.Views.SplashLoading.Logo.StateMod = new StateModifier({
//                opacity: App.Views.SplashLoading.Logo.useOpacity
//            });
//            App.Views.SplashLoading.Logo.Mod = new Modifier({
//                opacity: function(){
//                    // splashOpacity += 0.01;
//                    // var through = splashOpacity % 1.20;
//                    // var topOrBottom = (parseInt(splashOpacity / 1.20,10)) % 2;
//                    // if(topOrBottom == 1){
//                    //     through = 1 - through;
//                    // }
//                    // return through;
//                    return 1;
//                }
//            });
//
//            // App.Views.SplashLoading.hide = function(thisView){
//            //     // if(App.Views.SplashLoading.CurrentPopover === thisView){
//            //         App.Views.SplashLoading.hide();
//            //     // }
//            // };
//
//            App.Functions.action = function(){
//
//                var durationOfOpacity = 2000;
//
//                if(App.Views.SplashLoading.Logo.useOpacity != 1){
//                    App.Views.SplashLoading.Logo.useOpacity = 1;
//                } else {
//                    App.Views.SplashLoading.Logo.useOpacity = 0.1;
//                }
//                App.Views.SplashLoading.Logo.StateMod.setOpacity(App.Views.SplashLoading.Logo.useOpacity,{
//                    curve: 'linear',
//                    duration: durationOfOpacity
//                });
//
//                Timer.setTimeout(function(){
//                    if(App.Views.SplashLoading._showing != -1){
//                        App.Functions.action();
//                    }
//                },durationOfOpacity);
//
//                // rotate it
//                // Timer.setTimeout(function(){
//                // App.Views.SplashLoading.Logo.StateMod.setTransform(Transform.rotateY(Math.PI),{
//                //     duration: 1000,
//                //     curve: 'linear',
//                // }, function(){
//                //     // App.Views.SplashLoading.Logo.StateMod.setTransform(0,{
//                //     //     duration: 1000,
//                //     //     curve: 'linear'
//                //     // });
//                // });
//                // },250);
//
//                // if(1==1){
//                //     Timer.setTimeout(function(){
//                //         App.Functions.action();
//                //     },3000);
//                // }
//
//            }
//
//            App.Views.SplashLoading.View.add(Utils.usePlane('splashLoading',1)).add(App.Views.SplashLoading.BgSurface);
//            viewNode.add(Utils.usePlane('splashLoading',2)).add(App.Views.SplashLoading.Logo.StateMod).add(App.Views.SplashLoading.Logo.Mod).add(App.Views.SplashLoading.Logo);
//
//            App.Views.SplashLoading.show(App.Views.SplashLoading.View);
//            App.MainView.add(Utils.usePlane('splashLoading')).add(App.Views.SplashLoading);
//
//        };
//        createSplashLoading();
//
//
//        // Add ToastController to mainContext
//        // - it should be a ViewSequence or something that allows multiple 'toasts' to be displayed at once, with animations)
//        // - todo
//        var toastNode = new RenderNode();
//        App.MainView.add(toastNode);
//
//        // Add FPS Surface to MainView
//        var fps = new View();
//        fps.Surface = new Surface({
//            content: 'fps',
//            size: [12,12],
//            classes: ['fps-counter-default']
//        });
//        fps.Mod = new StateModifier({
//            opacity: 0,
//            origin: [1,1]
//        });
//        Timer.setInterval(function(){
//            var fpsNum = parseInt(Engine.getFPS(), 10);
//            var thresh = App.Credentials.fps_threshold;
//            if(fpsNum >= thresh){
//                fps.Mod.setOpacity(0);
//            }
//            if(fpsNum < thresh && App.Credentials.show_fps){
//                fps.Mod.setOpacity(1);
//            }
//
//            fps.Surface.setContent(fpsNum);
//        },1000);
//        fps.add(fps.Mod).add(fps.Surface);
//        App.MainView.add(Utils.usePlane('fps')).add(fps);
//
//        App.StartRouter = new App.Router.DefaultRouter();
//
//        console.info('StartRouter');
//
//        // Start history watching
//        // - don't initiate based on the first view, always restart
//        var initialUrl = false;
//        if(1==1 && window.location.hash.toString() != ''){
//            // Skip goto Home
//            initialUrl = true;
//            Backbone.history.start();
//        } else {
//            Backbone.history.start({silent: true});
//            App.history.navigate(''); // should go to a "loading" page while we figure out who is logged in
//        }
//
//
//        // Test login
//        $.ajaxSetup({
//            cache: false,
//            contentType: 'application/json', // need to do JSON.stringify() every .data in an $.ajax!
//            statusCode: {
//                401: function(){
//                    // Redirect the to the login page.
//                    // alert(401);
//                    // window.location.replace('/#login');
//
//                },
//                403: function() {
//                    // alert(403);
//                    // 403 -- Access denied
//                    // window.location.replace('/#denied');
//                    App.Data.User.clear();
//                },
//                404: function() {
//                    // alert(404);
//                    // 403 -- Access denied
//                    // window.location.replace('/#denied');
//                },
//                500: function() {
//                    // alert(500);
//                    // 403 -- Access denied
//                    // window.location.replace('/#denied');
//                }
//            }
//        });
//
//        // Start Splashscreen
//        Timer.setTimeout(function(){
//            try {
//                App.Functions.action();
//                if(App.Data.usePg){
//                    navigator.splashscreen.hide();
//                } else {
//                    App.Functions.action();
//                }
//            }catch(err){
//                alert('failed hiding splash screen');
//                alert(err);
//            }
//        },500);
//
//        // Set up ajax credentials for later calls using this user
//        App.Data.UserToken = localStorage.getItem(App.Credentials.local_token_key);
//
//        App.Data.User = new UserModel.User(); // empty, because Waiting doesn't have a GET for users
//        if(!App.Data.UserToken || App.Data.UserToken == 'undefined'){
//            App.history.navigate('landing');
//            return;
//        }
//        $.ajaxSetup({
//            headers: {
//                'x-token' : App.Data.UserToken
//                // 'Authorization' : 'Bearer ' + App.Data.UserToken
//            }
//        });
//
//        // Preload models
//        PreloadModels(App);
//
//        // Navigate to home_route
//        // - if it is a "Default"-style view, we should use history:false
//        App.history.navigate(App.Credentials.home_route);
//
//        // if(localStorage.getItem(App.Credentials.Waiting_verified_email_key) == 1){
//        //     // Navigate to my controllers (Dashboard)
//        //     // Utils.Notification.Toast();
//        //     App.history.navigate('fleet');
//        //     return;
//        // }
//
//        // // Need to check if verified yet
//        // App.Data.User.verifiedEmail()
//        // .then(function(){
//        //     localStorage.setItem(App.Credentials.Waiting_verified_email_key, 1)
//        //     App.history.navigate('controller/view');
//        // })
//        // .fail(function(err){
//        //     // alert('failed verify');
//        //     // alert(App.Data.UserToken);
//        //     // console.log(err);
//        //     if([0,503].indexOf(err.status) !== -1){
//        //         // server error, we should stop here as well?
//        //         // - no, just pretend it worked ok, that the email was verified
//        //         App.history.navigate('controller/view');
//        //         return;
//        //     }
//        //     App.history.navigate('user/verifyemail');
//        //     Utils.Popover.Help({
//        //         title: "Email Not Verified",
//        //         body: "To activate your Waiting, please verify your email address by clicking the link in the email you should have received. "
//        //     });
//        // });
//

    };

});
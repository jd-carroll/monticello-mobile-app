/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Modifier =      require('famous/core/Modifier');
    var Surface =       require('famous/core/Surface');
    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview =    require('famous/views/Scrollview');

    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Drag = require('famous/physics/forces/Drag');
    var Spring = require('famous/physics/forces/Spring');

    var EventHandler = require('famous/core/EventHandler');
    var OptionsManager = require('famous/core/OptionsManager');
    var ViewSequence = require('famous/core/ViewSequence');
    var Utility = require('famous/utilities/Utility');

    var GenericSync = require('famous/inputs/GenericSync');
    //var ScrollSync = require('famous/inputs/ScrollSync');
    var TouchSync = require('famous/inputs/TouchSync');
    GenericSync.register({touch : TouchSync});

    var ExhibitStory =  require('./ExhibitStory');

    /** @enum */
    var SpringStates = {
        NONE: 0,
        SCROLL: 1,
        FULL: 2
    };

    function ExhibitStoryList(options) {
        View.apply(this, arguments);

        // patch options with defaults
        this.options = Object.create(ExhibitStoryList.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        // create sub-components
        this.sync = new GenericSync(
            ['touch'],
            {
                rails: true
            }
        );

        this._physicsEngine = new PhysicsEngine();
        this._particle = new Particle();
        this._physicsEngine.addBody(this._particle);

        this.spring = new Spring({
            anchor: [0, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        });
        this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: this.options.drag
        });
        this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: this.options.friction
        });

        // state
        this._touchCount = 0;
        this._heightPct = 0.45;
        this._height = this._heightPct * window.innerHeight; // window or view?
        this._displacement = [0, 0];
        this._touchVelocity = [0, 0];
        this.setPosition([10, this._height]);

        _createScrollview.call(this);

        this._eventInput.pipe(this.sync);
        this.sync.pipe(this._eventInput);

        _bindEvents.call(this);

        // override default options with passed-in custom options
        if (options) this.setOptions(options);
    }

    ExhibitStoryList.DEFAULT_OPTIONS = {
        viewPageSpeed: 0.3,
        scrollPeriod: 300,
        scrollDamp: 1,
        fullPeriod: 500,
        fullDamp: 0.8,
        speedLimit: 5
    };

    function _createScrollview() {
        this._scrollview = new Scrollview({
            direction: Utility.Direction.X
        });
        this._scrollview.AlignMod = new StateModifier({
            align: [0, 1],
            origin: [0, 1]
        });
        this._scrollview.PosMod = new Modifier({
            transform: function() {
                var pos = this.getPosition();
                return Transform.translate(pos[0], 0, 0)
            }.bind(this)
        });
        this._scrollview.SizeMod = new Modifier({
            size: function() {
                var pos = this.getPosition();
                return [undefined, pos[1]];
            }.bind(this)
        });
        this.add(this._scrollview.AlignMod)
            .add(this._scrollview.PosMod)
            .add(this._scrollview.SizeMod)
            .add(this._scrollview);

        // get the model
        // create each gallery viewer
        this.galleries = [];
        for (var i = 0; i < 10; i++) {
            this.galleries[i] = new ExhibitStory({
                height: this._height
            });
            this.galleries[i].positionFrom(this.getPosition.bind(this));

            this.galleries[i].pipe(this._scrollview);
            this._eventInput.subscribe(this.galleries[i]);
        }
        this._scrollview.sequenceFrom(this.galleries);
    }

    function _handleStart(event) {
        this._touchCount = event.count;
        if (event.count === undefined) this._touchCount = 1;

        this.setVelocity([0, 0]);
        this._touchVelocity = [0 ,0];
    }

    function _handleMove(event) {
        // if this is the first touch event, store the state
        if (!this._updating) {
            this._updating = event;

            // if the first movement is left/right
            if (Math.abs(event.delta[0]) > 0 && Math.abs(event.delta[1]) == 0) {
                // process the movement in the scrollview
                this._updatePosition = false;
            }
            // if the first movement is up/down
            else if (Math.abs(event.delta[0]) == 0 && Math.abs(event.delta[1]) > 0) {
                // process the movement on the modifier
                this._updatePosition = true;
                // don't process the movement in scrollview
                this._scrollview._earlyEnd = true;

                // normalize the event

                // remove the rails
                this.sync.setOptions({
                    rails: false
                });
            }
            // if we can't determine movement
            else {
                console.error("Failed to set direction, event had delta: " + event.delta);
                // wait for the next update
                this._updating = null;
            }
        }

        // process the movement locally
        if (this._updatePosition) {
            var position = this.getPosition();
            // if the new position is below the starting height, scale movement by 0.3
            if (event.position[1] > 0 && position[1] < this._height) {
                event.delta[1] = event.delta[1] * 0.4;
            }

            // set the position
            this.setPosition([position[0] + event.delta[0], position[1] - event.delta[1]]);

            //// update the heights
            //for (var key in this.galleries) {
            //    this.galleries[key].setHeight(this._height + this._displacement[1]);
            //}
        }
    }

    function _handleEnd(event) {
        this._touchCount = event.count || 0;
        if (!this._touchCount) {
            var velocityX = event.velocity[0];
            var velocityY = event.velocity[1];
            var speedLimit = this.options.speedLimit;
            if (Math.abs(velocityX) > speedLimit) velocityX = speedLimit;
            if (Math.abs(velocityY) > speedLimit) velocityY = speedLimit;
            this.setVelocity([velocityX, velocityY]);
            this._touchVelocity = 0;

            _handlePosition.call(this);

            // restore the defaults
            this._updating = null;
            this._updatePosition = false;
            this.sync.setOptions({
                rails: true
            });
        }
    }

    function _bindEvents() {
        this._eventInput.bindThis(this);
        this._eventInput.on('start', _handleStart);
        this._eventInput.on('update', _handleMove);
        this._eventInput.on('end', _handleEnd);
    }

    function _attachAgents() {
        if (this._springState) this._physicsEngine.attach([this.spring], this._particle);
        else this._physicsEngine.attach([this.drag, this.friction], this._particle);
    }

    function _detachAgents() {
        this._springState = SpringStates.NONE;
        this._physicsEngine.detachAll();
    }

    function _handlePosition() {
        if (this._touchCount) return;

        var velocity = this.getVelocity();
        var velocitySwitch = Math.abs(velocity[1]) > this.options.viewPageSpeed;

        // parameters to determine when to switch
        var position = this.getPosition();
        var halfway = window.innerHeight * ((1 - this._heightPct) / 2 + this._heightPct);
        var positionFull = halfway < position[1];

        var velocityFull = velocity[1] < 0;

        if ((positionFull && !velocitySwitch) || (velocitySwitch && velocityFull)) {
            _setSpring.call(this, SpringStates.FULL);
        }
        else {
            _setSpring.call(this, SpringStates.SCROLL);
        }
    }

    function _setSpring(springState) {
        var springOptions;
        if (springState === SpringStates.SCROLL) {
            springOptions = {
                anchor: [10, this._height, 0],
                period: this.options.scrollPeriod,
                dampingRatio: this.options.scrollDamp
            };
        }
        else if (springState === SpringStates.FULL) {
            springOptions = {
                anchor: [0, window.innerHeight, 0],
                period: this.options.fullPeriod,
                dampingRatio: this.options.fullDamp
            };
        }

        this.spring.setOptions(springOptions);
        if (springState && !this._springState) {
            _detachAgents.call(this);
            this._springState = springState;
            _attachAgents.call(this);
        }
        this._springState = springState;
    }

    ExhibitStoryList.prototype = Object.create(View.prototype);
    ExhibitStoryList.prototype.constructor = ExhibitStoryList;

    ExhibitStoryList.prototype.getPosition = function getPosition() {
        return this._particle.getPosition();
    };

    ExhibitStoryList.prototype.setPosition = function getPosition(position) {
        this._particle.setPosition(position);
    };

    ExhibitStoryList.prototype.getVelocity = function getVelocity() {
        return this._particle.getVelocity();
    };

    ExhibitStoryList.prototype.setVelocity = function setVelocity(velocity) {
        this._particle.setVelocity(velocity);
    };

    ExhibitStoryList.prototype.render = function render() {
        var pos = this.getPosition();
        if (!this.lastPos || this.lastPos[0] != pos[0] || this.lastPos[1] != pos[1])
            console.log(pos);

        this.lastPos = pos;
        return View.prototype.render.call(this, arguments);
    };

    module.exports = ExhibitStoryList;
});

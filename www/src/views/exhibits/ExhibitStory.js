/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Modifier =      require('famous/core/Modifier');
    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var Surface =       require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface =  require('famous/surfaces/ImageSurface');
    var Timer =         require('famous/utilities/Timer');
    var Lightbox =      require('famous/views/Lightbox');

    var Utils               = require('utils');

    function ExhibitStory(options) {
        View.apply(this, arguments);

        this.aspect = window.innerWidth / window.innerHeight;
        this._surface = new Surface({
            classes: ['exhibit-story']
        });
        this._surface.SizeMod = new Modifier({
            size: function() {
                var height = this.getHeight();
                var width = height * this.aspect;
                return [width, height];
            }.bind(this)
        });
        this.add(this._surface.SizeMod).add(this._surface);
        this._surface.pipe(this._eventOutput);
        this._size = null;

        if (options) this.setOptions(options);
    }

    ExhibitStory.prototype = Object.create(View.prototype);
    ExhibitStory.prototype.constructor = ExhibitStory;

    ExhibitStory.prototype.setOptions = function setOptions(options) {
        View.prototype.setOptions.call(this, options);
        if (options.height) this.setHeight(options.height);
    };

    ExhibitStory.prototype.getHeight = function() {
        if (this._positionGetter){
            var pos = this._positionGetter.call(this);
            this.height = pos[1];
        }

        return this.height;
    };

    // TODO: Determine if this will work or if you need to set the size on all the surface mod's
    ExhibitStory.prototype.setHeight = function(height, transition, callback) {
        this.height = height;
    };

    ExhibitStory.prototype.positionFrom = function positionFrom(position) {
        if (position instanceof Function) this._positionGetter = position;
        else if (position && position.get) this._positionGetter = position.get.bind(position);
        else {
            this._positionGetter = null;
            this.height = position;
        }
    };

    module.exports = ExhibitStory;
});

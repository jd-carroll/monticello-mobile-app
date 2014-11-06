/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var Surface =       require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface =  require('famous/surfaces/ImageSurface');
    var Timer =         require('famous/utilities/Timer');
    var Lightbox =      require('famous/views/Lightbox');

    var PositionScrollview  = require('views/common/PositionScrollview');
    var Utils               = require('utils');

    function ExhibitStory() {
        View.apply(this, arguments);

        var height = window.innerHeight * 0.55;
        var width = window.innerWidth * 0.45;
        console.log('width: ' + width + ' height: ' + height);
        this._surface = new Surface({
            classes: ['exhibit-story']
        });
        this._surface.SizeMod = new StateModifier({
            size: [width, height]
        });
        this.add(this._surface.SizeMod).add(this._surface);
    }

    ExhibitStory.prototype = Object.create(View.prototype);
    ExhibitStory.prototype.constructor = ExhibitStory;

    module.exports = ExhibitStory;
});

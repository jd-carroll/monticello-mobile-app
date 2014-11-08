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

        var height = window.innerHeight * 0.45;
        var width = height * 2 / 3;
        this._surface = new Surface({
            classes: ['exhibit-story']
        });
        this._surface.SizeMod = new StateModifier({
            size: [width, height],
            transform: Transform.translate(0, 0, 0)
        });
        this.add(this._surface.SizeMod).add(this._surface);
        this._surface.pipe(this._eventOutput);
    }

    ExhibitStory.prototype = Object.create(View.prototype);
    ExhibitStory.prototype.constructor = ExhibitStory;

    module.exports = ExhibitStory;
});

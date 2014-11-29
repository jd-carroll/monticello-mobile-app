/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var RenderNode =    require('famous/core/RenderNode');
    var Surface =       require('famous/core/Surface');
    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface =  require('famous/surfaces/ImageSurface');
    var Timer =         require('famous/utilities/Timer');
    var Lightbox =      require('famous/views/Lightbox');

    var Utils               = require('utils');

    function GallerySummary(summary) {
        View.apply(this, arguments);

        var title = new Surface({
            content: summary.title,
            size: [undefined, undefined]
        });
        this.add(title);
        title.pipe(this._eventOutput);
    }

    GallerySummary.prototype = Object.create(View.prototype);
    GallerySummary.prototype.constructor = GallerySummary;

    module.exports = GallerySummary;
});

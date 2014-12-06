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
    var StateModifier = require('famous/modifiers/StateModifier');
    var Utility =       require('famous/utilities/Utility');
    var Scrollview =    require('famous/views/Scrollview');

    var GallerySummary =  require('./GallerySummary');

    function GallerySummaryList() {
        View.apply(this, arguments);

        // load temporary model
        var summaries = JSON.parse(require('text!views/galleries/GallerySummaries.json'));

        // create the listview
        this._scrollview = new Scrollview({
            direction: Utility.Direction.X,
            paginated: true
        });
        this._scrollview.AlignMod = new StateModifier({
            align: [0, 0],
            origin: [0, 0]
        });
        this._scrollview.SizeMod = new StateModifier({
            size: [undefined, window.innerHeight]
        });
        this.add(this._scrollview.AlignMod)
            .add(this._scrollview.SizeMod)
            .add(this._scrollview);

        // get the model
        // create each gallery viewer
        this.galleries = [];
        for (var i = 0; i < summaries.summaries.length; i++) {
            var summary = summaries.summaries[i];
            this.galleries[i] = new GallerySummary({}, summary);

            this.galleries[i].pipe(this._scrollview);
            this._eventInput.subscribe(this.galleries[i]);
        }
        this._scrollview.sequenceFrom(this.galleries);
    }

    GallerySummaryList.prototype = Object.create(View.prototype);
    GallerySummaryList.prototype.constructor = GallerySummaryList;

    module.exports = GallerySummaryList;
});

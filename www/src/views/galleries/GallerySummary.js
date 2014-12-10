/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Modifier =      require('famous/core/Modifier');
    var RenderNode =    require('famous/core/RenderNode');
    var Surface =       require('famous/core/Surface');
    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface =  require('famous/surfaces/ImageSurface');
    var Timer =         require('famous/utilities/Timer');
    var Lightbox =      require('famous/views/Lightbox');
    var RenderController = require('famous/views/RenderController');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    var Utils               = require('utils');

    function GallerySummary(options, summary) {
        View.apply(this, options);

        var self = this;

        this.container = new ContainerSurface();

        // Create title area content
        this.Title = new Surface({
            size: [true, true]
        });
        this.Title.Controller = new RenderController();
        this.updateTitle(summary.title);
        // this.Title.pipe(this._eventOutput);

        this.SubTitle = new Surface({
            size: [true, true]
        });
        this.SubTitle.Controller = new RenderController();
        this.updateSubTitle(summary.subtitle);
        // this.SubTitle.pipe(this._eventOutput);

        this.TitleLayout = new SequentialLayout({
            direction: 1
        });
        this.TitleLayout.sequenceFrom([this.Title, this.SubTitle]);
        var z = Utils.usePlane(20000, 0, 0, true);
        this.TitleLayout.PosMod = new Modifier({
            transform: Transform.translate(5, 4, z),
            align: [0, 0],
            origin: [0, 0]
        });
        this.container.add(this.TitleLayout.PosMod).add(this.TitleLayout);

        // subtitle

        // picture lightbox

        // control behavior

        this.lightbox = new Lightbox({
            inTransform: Transform.identity,
            inOpacity: 0,
            inOrigin: [.5, .5],
            outTransform: Transform.identity,
            outOpacity: 0,
            outOrigin: [.5, .5],
            showTransform: Transform.identity,
            showOpacity: 1,
            showOrigin: [.5, .5],
            inTransition: {
                duration: 1e3
            },
            outTransition: {
                duration: 1e3
            },
            overlap: !0
        });

        if (summary.images) {
            this.covers = [];
            for (var t = 0; t < summary.images.length; t++) {
                var surf = new Surface({
                    content: '<div class="gallery-background-top" style="float:top;height:50%;background-image:url(' + summary.images[t] + ')"></div>' +
                    '<div class="gallery-background-bottom" style="float:bottom;height:50%;background-image:url(' + summary.images[t] + ')"></div>'
                });
                this.covers.push(surf);
            }
            var coverIndex = 0;
            this.lightbox.show(this.covers[0]);

            Timer.setInterval(function () {
                coverIndex++;
                if (coverIndex === this.covers.length) coverIndex = 0;
                this.lightbox.show(this.covers[coverIndex]);
            }.bind(this), 12000);

            var modifier = new StateModifier({
                align: [0, 0],
                origin: [0, 0]
            });
            this.container.add(modifier).add(this.lightbox);
        }

        this.container.SizeMod = new StateModifier({
            size: [window.innerWidth, window.innerHeight]
        });
        this.add(this.container.SizeMod).add(this.container);
        this.container.pipe(this._eventOutput);
        this._size = null;

        if (options) this.setOptions(options);
    }

    //function _createTitle(self) {
    //    this.Title = new Surface({
    //        size: [true, true]
    //    });
    //    this.Title.Controller = new RenderController();
    //}

    //function _createSubTitle(self) {
    //    this.SubTitle = new Surface({
    //        size: [true, true]
    //    });
    //    this.SubTitle.Controller = new RenderController();
    //}

    GallerySummary.prototype = Object.create(View.prototype);
    GallerySummary.prototype.constructor = GallerySummary;

    GallerySummary.prototype.updateTitle = function updateTitle(title) {
        if (title) {
            this.Title.Controller.show(this.Title);
            this.Title.setContent('<span class="gallery-title">' + title + '</span>');
        }
        else {
            this.Title.Controller.hide(this.Title);
            this.Title.setContent(null);
        }
    };

    GallerySummary.prototype.updateSubTitle = function updateSubTitle(subtitle) {
        if (subtitle) {
            this.SubTitle.Controller.show(this.SubTitle);
            this.SubTitle.setContent('<span class="gallery-subtitle">' + subtitle + '</span>');
        }
        else {
            this.SubTitle.Controller.hide(this.SubTitle);
            this.SubTitle.setContent(null);
        }
    };

    GallerySummary.prototype.getSize = function getSize() {
        return [window.innerWidth, window.innerHeight];
    };

    module.exports = GallerySummary;
});

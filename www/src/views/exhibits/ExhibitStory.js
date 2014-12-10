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
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    var Utils               = require('utils');

    function ExhibitStory(options) {
        View.apply(this, arguments);

        this.container = new ContainerSurface({
            classes: ['exhibit-story']
        });

        this.aspect = 2 / 3;
        if (!options.exhibit) {
            this._surface = new Surface({
                classes: ['exhibit-story'],
                content: '<span class="empty"></span>' +
                '<span class="empty-line1"></span>' +
                '<span class="empty-line2"></span>' +
                '<span class="empty-line3"></span>' +
                '<span class="empty-line4"></span>' +
                '<span class="empty-line5"></span>' +
                '<span class="empty-line6"></span>'
            });
            this.container.add(this._surface);
        }
        else {
            var offset = 10;
            var exhibit = options.exhibit;
            if (exhibit.profilePic) {
                this._title = new Surface({
                    classes: ['exhibit-title'],
                    content: '<img src="' + exhibit.profilePic + '">'
                });
                this._title.PosMod = new StateModifier({
                    transform: Transform.translate(10, offset, 0.001)
                });
                this.container.add(this._title.PosMod).add(this._title);
                offset += 70;
            }
            if (exhibit.title) {
                this._title = new Surface({
                    classes: ['exhibit-title'],
                    content: '<span>' + exhibit.title + '</span>'
                });
                this._title.PosMod = new StateModifier({
                    transform: Transform.translate(10, offset, 0.001)
                });
                this.container.add(this._title.PosMod).add(this._title);
                offset += 20;
            }

            //for (var i = 0; i < exhibit.content.length; i++) {
            //    var contentSurface = new Surface({
            //        content: exhibit.content[i]
            //    });
            //    contentSurface.PosMod = new StateModifier({
            //        transform: Transform.translate(10, offset, 0.001)
            //    });
            //    this.container.add(contentSurface.PosMod).add(contentSurface);
            //}
        }

        this.container.SizeMod = new Modifier({
            size: function() {
                var height = window.innerHeight,
                    width = window.innerWidth;
                if (!this.fullScreen) {
                    var height = this.getHeight();
                    var width = height * this.aspect;
                }
                return [width, height];
            }.bind(this)
        });
        this.add(this.container.SizeMod).add(this.container);
        this.container.pipe(this._eventOutput);
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

    ExhibitStory.prototype.setFullScreen = function setFullScreen(fullScreen) {
        this.fullScreen = fullScreen;
    };

    module.exports = ExhibitStory;
});

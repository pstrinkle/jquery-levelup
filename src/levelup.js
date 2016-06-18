/**
 * jquery-levelup - jQuery Plugin to draw animated increment and decrement to a
 *  number styled from video games.
 * URL: http://pstrinkle.github.com/jquery-levelup
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 1.0.2
 * Copyright 2016 Patrick Trinkle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {
    function LevelUp(config) {
        this.init(config);
    }

    LevelUp.prototype = {
        /**
         * This is the only required option.
         * @type {number}
         */
        start: 0,

        /**
         * This is the current value.
         * @type {number}
         */
        value: 0,

        /**
         * Whether we separate numbers in thousands.
         * @type {boolean}
         */
        showThousands: false,
        /**
         * The thousands separator to use.
         * @tyep {string}
         */
        thousandSep: ',',

        /**
         * These are the settings for the incrementer.
         * @type {object}
         */
        incrementer : {
            bold: true,
            color: null,
            class: null,
        },

        /**
         * These are the settings for the decrementer
         * @type {object}
         */
        decrementer : {
            bold: true,
            color: null,
            class: null,
        },

        //----------------------- protected properties and methods -------------
        /**
         * @protected
         */
        constructor: LevelUp,

        /**
         * Container element. Should be passed into constructor config
         * @protected
         * @type {jQuery}
         */
        el: null,

        /**
         * Init/re-init the object
         * @param {object} config - Config
         */
        init: function(config) {
            $.extend(this, config);
        },

        getValue: function() {
            return this.value;
        },

        setValue: function(newValue) {
            this.value = newValue;
        },

        dataName : 'levelup',

        animateUpdate : function (update) {
        	var instance = this;
            /* transition to this */
            var $tw = instance.el;
            var p = $tw.position();
            var h = $tw.height();
            var w = $tw.width();
            // start it all the way to the left, then figure out its width
            var nl = p.left + w;
            
            if (update >= 0) {
                /* 
                 * They have the same height, so just position it above by the 
                 * height.
                 */

                if (instance.showThousands) {
                    update = numberWithCommas(update, instance.thousandSep);
                }

                var nt = p.top - h;
                var s = getStyle(nt, nl, instance.incrementer);
                var $x = $('<span>', {text: "+" + update, style: s});
                if (instance.incrementer.class) {
                    $x.addClass(instance.incrementer.class);
                }
            } else {
                /* 
                 * They have the same height, so just position it at the same 
                 * place.
                 */

                if (instance.showThousands) {
                    update = numberWithCommas(update, instance.thousandSep);
                }

                var nt = p.top;
                var s = getStyle(nt, nl, instance.decrementer);
                var $x = $('<span>', {text: update, style: s});
                if (instance.decrementer.class) {
                    $x.addClass(instance.decrementer.class);
                }
            }

            // width is 0 until it's rendered.
            $tw.parent().append($x);
            var realWidth = $x.width();
            var newerLeft = nl - realWidth;
            $x.css('left', newerLeft + 'px');

            // lower if after ~1/4th of a second.
            setTimeout(function(){
                $x.css(trans);
                var e = nt + (h);
                $x.css('top', e + 'px');
                setTimeout(function() {
                    $x.remove();

                    /* equivalent to a volatile pointer read */
                    var value = $tw.data(instance.dataName).getValue();
                    if (instance.showThousands) {
                        value = numberWithCommas(value, instance.thousandSep);
                    }

                    $tw.text(value);
                }, 250);
            }, 100);
        },
    }

    var trans = {'-webkit-transition' : 'all 0.25s',
                 '-moz-transition' : 'all 0.25s',
                 '-o-transition' : 'all 0.25s',
                 'transition' : 'all 0.25s'};

    function numberWithCommas(x, sep) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    }
    
    /* 
     * Should it always be bold? or is that incorrect, I can't recall yet.
     * I should have it check if the thing beneath it is bold?
     */
    function getStyle(top, left, settings) {
        /* 
         * Yes it's less optimal, why am I building it every time?
         * I was already technically just building a giant string...
         */
        var styles = ["position:absolute",
                      "top:" + top + "px",
                      "left:" + left + "px",
                      "z-index:999"
        ];

        if (settings.bold) {
            styles.push("font-weight:bold");
        }

        if (settings.color) {
            styles.push("color:" + settings.color);
        }

        return styles.join(";");
    }
    
    //----------------------- Initiating jQuery plugin -------------------------

    /**
     * Set up an animated incrementer/decrementer.
     * 
     * @param configOrCommand - Config object or command name
     *     Example: { ... };
     *     you may set any public property (see above);
     *     you may use .levelup('increment', incrementWith) to increment the 
     *     value
     *     you may use .levelup('decrement', decrementWith) to decrement the 
     *     value
     *
     * @param commandArgument - Some commands (like 'increment') may require an 
     *     argument
     */
    $.fn.levelup = function(configOrCommand, commandArgument) {
        /* It is possible that the text will be updated out of sequence
         * because of the timeouts, that you might not end up with the
         * right value, so the right value is basically always in data.
         */
    	var dataName = LevelUp.prototype.dataName;

        if (typeof configOrCommand == 'string') {
            commandArgument = parseInt(commandArgument); /* just in case. */

            if (configOrCommand === 'increment') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    instance.setValue(instance.getValue() + commandArgument);
                    instance.animateUpdate(commandArgument);
                });
            } else if (configOrCommand === 'decrement') {
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    instance.setValue(instance.getValue() - commandArgument);
                    instance.animateUpdate(-1 * commandArgument);
                });
            } else if (configOrCommand === 'reset') {
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    instance.setValue(instance.start);
                    instance.el.text(instance.start);
                });
            } else if (configOrCommand === 'get') {
                var instance = $(this).data(dataName);
                return instance.getValue();
            }
        }

        /* handle init here, I later plan to use other options, such as formatting. */
        return this.each(function() {
            var el = $(this), instance = el.data(dataName),
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                /* they've set up some data values for us already to use. */
                instance.init(config);
            } else {
                var initialConfig = $.extend({}, el.data());
                config = $.extend(initialConfig, config);
                config.el = el;

                /* We don't want a true deep copy of the whole prototype. */
                if (config.incrementer) {
                    var inc = $.extend(true, {}, LevelUp.prototype.incrementer, config.incrementer);
                    $.extend(config.incrementer, inc);
                }

                if (config.decrementer) {
                    var dec = $.extend(true, {}, LevelUp.prototype.decrementer, config.decrementer);
                    $.extend(config.decrementer, dec);
                }

                instance = new LevelUp(config);
                el.data(dataName, instance);

                if (instance.showThousands) {
                    instance.start = numberWithCommas(instance.start, instance.thousandSep);
                }
                el.text(instance.start);
            }
        });
    };
}(jQuery));

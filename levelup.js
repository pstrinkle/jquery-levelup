/**
 * jquery-levelup - jQuery Plugin to draw animated increment and decrement to a
 *  number styled from video games.
 * URL: ...
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 0.1
 * License: Apache 2
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
        }
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
        var dataName = 'levelup';
        var trans = {'-webkit-transition' : 'all 0.25s',
                     '-moz-transition' : 'all 0.25s',
                     '-o-transition' : 'all 0.25s',
                     'transition' : 'all 0.25s'};

        /* 
         * Should it always be bold? or is that incorrect, I can't recall yet.
         * I should have it check if the thing beneath it is bold?
         */
        function getStyle(top, left) {
            /* 
             * Yes it's less optimal, why am I building it every time?
             * I was already technically just building a giant string...
             */
            var styles = ["font-weight:bold",
                             "position:absolute",
                             "top:" + top + "px",
                             "left:" + left + "px",
                             "z-index:999"
            ];

            return styles.join(";");
        }

        function animateUpdate(instance, update) {
        	/* transition to this */
            var $tw = instance.el;
            var p = $tw.position();
            var h = $tw.height();
            var w = $tw.width();
            // start it all the way to the left, then figure out its width
            var nl = p.left + w;

            if (update >= 0) {
                // they have the same height, so just position it above by the height.
                var nt = p.top - h;
                var $x = $('<span>', {text: "+" + update, style: getStyle(nt, nl)});
            } else {
                // they have the same height, so just position it at the same place.
                var nt = p.top;
                var $x = $('<span>', {text: update, style: getStyle(nt, nl)});
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
                    $tw.text($tw.data(dataName).getValue());
                }, 250);
            }, 100);
        }

        /* It is possible that the text will be updated out of sequence
         * because of the timeouts, that you might not end up with the
         * right value, so the right value is basically always in data.
         */
        if (typeof configOrCommand == 'string') {
            commandArgument = parseInt(commandArgument); /* just in case. */

            if (configOrCommand === 'increment') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    instance.setValue(instance.getValue() + commandArgument);
                    animateUpdate(instance, commandArgument);
                });
            } else if (configOrCommand === 'decrement') {
                return this.each(function() {
                    var instance = $(this).data(dataName);
                    instance.setValue(instance.getValue() - commandArgument);
                    animateUpdate(instance, -1 * commandArgument);
                });
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
                instance = new LevelUp(config);
                el.data(dataName, instance);

                el.text(instance.start);
            }
        });
    };
}(jQuery));
